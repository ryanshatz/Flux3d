/**
 * CallSimulator — Simulates a phone call's journey through an IVR script
 * 
 * Scans the parsed IVR data for decision variables (e.g., Call.ANI),
 * then walks the graph from IncomingCall, evaluating branch conditions
 * at each case/ifElse module to determine the exact path the call takes.
 */

export class CallSimulator {
  /**
   * Extract all unique variable names used in case/ifElse branch conditions.
   * These become the input fields the user needs to fill in.
   * @param {Object} parsedData - Output of parseFive9IVR()
   * @returns {Array<{name: string, label: string, placeholder: string}>}
   */
  static extractVariables(parsedData) {
    const vars = new Map(); // variableName -> Set of example values

    for (const mod of parsedData.modules) {
      if (mod.moduleType !== 'case' && mod.moduleType !== 'ifElse') continue;
      const branches = mod.data.branches || [];

      for (const branch of branches) {
        if (branch.leftOperand && branch.leftOperand !== 'value') {
          const varName = branch.leftOperand;
          if (!vars.has(varName)) vars.set(varName, new Set());
          if (branch.rightValue) {
            vars.get(varName).add(branch.rightValue.trim());
          }
        }
      }
    }

    // Build field descriptors
    const fields = [];
    for (const [varName, examples] of vars) {
      const exArr = [...examples].slice(0, 3);
      const isPhone = varName.toLowerCase().includes('ani') || 
                       varName.toLowerCase().includes('dnis') ||
                       varName.toLowerCase().includes('phone') ||
                       varName.toLowerCase().includes('number');

      fields.push({
        name: varName,
        label: CallSimulator._humanizeVarName(varName),
        placeholder: isPhone ? 'e.g. 5551234567' : (exArr.length > 0 ? `e.g. ${exArr[0]}` : ''),
        type: isPhone ? 'tel' : 'text',
        examples: exArr
      });
    }

    return fields;
  }

  /**
   * Simulate a call through the IVR graph with the given variable values.
   * @param {Object} parsedData - Output of parseFive9IVR()
   * @param {Object} variables - Map of variableName -> user-entered value
   * @returns {{path: string[], log: Array<{moduleId, moduleName, action, detail}>}}
   */
  static simulate(parsedData, variables) {
    const { modules, moduleMap } = parsedData;
    const path = [];
    const log = [];
    const visited = new Set();

    // Find entry point
    const entry = modules.find(m => m.moduleType === 'incomingCall');
    if (!entry) return { path, log };

    let currentId = entry.moduleId;
    const MAX_STEPS = 50; // safety valve

    for (let step = 0; step < MAX_STEPS; step++) {
      if (!currentId || visited.has(currentId)) break;
      visited.add(currentId);

      const mod = moduleMap[currentId];
      if (!mod) break;

      path.push(currentId);

      // Determine next module based on type
      if (mod.moduleType === 'case' || mod.moduleType === 'ifElse') {
        const result = CallSimulator._evaluateBranches(mod, variables);
        
        if (result.matched) {
          log.push({
            moduleId: currentId,
            moduleName: mod.moduleName,
            moduleType: mod.moduleType,
            action: 'MATCHED',
            detail: `Branch "${result.branchName}" matched (${result.variable} ${result.comparison} "${result.value}")`
          });
          currentId = result.descendantId;
        } else {
          // No match — follow exceptionalDescendant or "No Match" branch
          const noMatchBranch = (mod.data.branches || []).find(b => b.name === 'No Match');
          const fallbackId = noMatchBranch?.descendantId || mod.exceptionalDescendant || mod.singleDescendant;
          
          log.push({
            moduleId: currentId,
            moduleName: mod.moduleName,
            moduleType: mod.moduleType,
            action: 'NO MATCH',
            detail: `No branch matched → following ${noMatchBranch ? '"No Match" branch' : 'default path'}`
          });
          currentId = fallbackId;
        }
      } else if (mod.moduleType === 'hangup') {
        log.push({
          moduleId: currentId,
          moduleName: mod.moduleName,
          moduleType: mod.moduleType,
          action: 'HANGUP',
          detail: mod.data.disposition ? `Disposition: ${mod.data.disposition.name}` : 'Call terminated'
        });
        break; // Terminal
      } else if (mod.moduleType === 'skillTransfer') {
        log.push({
          moduleId: currentId,
          moduleName: mod.moduleName,
          moduleType: mod.moduleType,
          action: 'TRANSFER',
          detail: `Transfer to skill: ${mod.data.skillName || 'unknown'}`
        });
        // Continue to next module if there is one
        currentId = mod.singleDescendant;
        if (!currentId) break;
      } else {
        // All other modules — just follow singleDescendant
        log.push({
          moduleId: currentId,
          moduleName: mod.moduleName,
          moduleType: mod.moduleType,
          action: 'PASS',
          detail: mod.moduleType === 'play' ? 'Playing prompt' : 
                  mod.moduleType === 'setVariable' ? 'Setting variable' :
                  'Processing'
        });
        currentId = mod.singleDescendant;
        if (!currentId) break;
      }
    }

    return { path, log };
  }

  /**
   * Evaluate all branches of a case/ifElse module against user variables.
   */
  static _evaluateBranches(mod, variables) {
    const branches = mod.data.branches || [];

    for (const branch of branches) {
      if (branch.name === 'No Match') continue; // Skip the fallback

      const varName = branch.leftOperand || '';
      const comparison = (branch.comparisonType || 'EQUALS').toUpperCase();
      const expectedValue = (branch.rightValue || '').trim();
      const actualValue = (variables[varName] || '').trim();

      if (!varName || !expectedValue) continue;

      let matched = false;
      switch (comparison) {
        case 'EQUALS':
          matched = actualValue === expectedValue;
          break;
        case 'NOT_EQUALS':
          matched = actualValue !== expectedValue;
          break;
        case 'CONTAINS':
          matched = actualValue.includes(expectedValue);
          break;
        case 'STARTS_WITH':
          matched = actualValue.startsWith(expectedValue);
          break;
        case 'ENDS_WITH':
          matched = actualValue.endsWith(expectedValue);
          break;
        default:
          matched = actualValue === expectedValue;
      }

      if (matched) {
        return {
          matched: true,
          branchName: branch.name,
          descendantId: branch.descendantId,
          variable: varName,
          comparison,
          value: expectedValue
        };
      }
    }

    return { matched: false };
  }

  /**
   * Convert variable names like "Call.ANI" to "Caller ANI (Phone Number)"
   */
  static _humanizeVarName(varName) {
    const map = {
      'Call.ANI': 'Caller Phone Number (ANI)',
      'Call.DNIS': 'Dialed Number (DNIS)',
      'Call.campaign_id': 'Campaign ID',
      'Call.campaign_name': 'Campaign Name',
    };
    if (map[varName]) return map[varName];

    // Generic: "Call.someVar" → "Some Var"
    return varName
      .replace(/^Call\./, '')
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .replace(/^\w/, c => c.toUpperCase());
  }
}
