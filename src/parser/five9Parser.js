/**
 * Five9 IVR XML Parser
 * Parses .five9ivr XML files into a structured graph representation
 */

const MODULE_TYPES = [
  'incomingCall', 'skillTransfer', 'case', 'hangup',
  'play', 'startOnHangup', 'input', 'menu', 'setVariable',
  'queryModule', 'ifElse', 'voiceInput', 'getUserInfo',
  'conferenceTransfer', 'getDigits', 'record',
  'voiceMailTransfer', 'thirdPartyTransfer', 'lookupCRMRecord',
  'crmUpdate', 'agentTransfer'
];

export function parseFive9IVR(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid XML: ' + parseError.textContent);
  }

  const ivrScript = doc.querySelector('ivrScript');
  if (!ivrScript) throw new Error('Not a valid Five9 IVR file: missing <ivrScript>');

  const domainId = getText(ivrScript, 'domainId');
  const mainModulesEl = ivrScript.querySelector(':scope > modules');
  const hangupModulesEl = ivrScript.querySelector(':scope > modulesOnHangup');

  const modules = [];
  const edges = [];
  const moduleMap = {};

  // Parse main modules
  if (mainModulesEl) {
    parseModulesContainer(mainModulesEl, modules, edges, moduleMap, 'main');
  }

  // Parse on-hangup modules
  if (hangupModulesEl) {
    parseModulesContainer(hangupModulesEl, modules, edges, moduleMap, 'onHangup');
  }

  // Parse multi-language prompts
  const prompts = parseMultiLanguagePrompts(ivrScript);

  // Compute stats
  const stats = computeStats(modules, edges);

  return {
    domainId,
    modules,
    edges,
    moduleMap,
    prompts,
    stats
  };
}

function parseModulesContainer(container, modules, edges, moduleMap, flow) {
  for (const child of container.children) {
    const moduleType = child.tagName;
    if (!MODULE_TYPES.includes(moduleType)) continue;

    const mod = parseModule(child, moduleType, flow);
    modules.push(mod);
    moduleMap[mod.moduleId] = mod;

    // Build edges from singleDescendant
    const singleDesc = getText(child, 'singleDescendant');
    if (singleDesc) {
      edges.push({
        from: mod.moduleId,
        to: singleDesc,
        type: 'primary'
      });
    }

    // Build edges from exceptionalDescendant
    const exceptionalDesc = getText(child, 'exceptionalDescendant');
    if (exceptionalDesc && exceptionalDesc !== singleDesc) {
      edges.push({
        from: mod.moduleId,
        to: exceptionalDesc,
        type: 'exceptional'
      });
    }

    // Build edges from case/ifElse branches
    if ((moduleType === 'case' || moduleType === 'ifElse') && mod.data.branches) {
      for (const branch of mod.data.branches) {
        if (branch.descendantId) {
          const existing = edges.find(e => e.from === mod.moduleId && e.to === branch.descendantId);
          if (!existing) {
            edges.push({
              from: mod.moduleId,
              to: branch.descendantId,
              type: 'branch',
              label: branch.name
            });
          }
        }
      }
    }
  }
}

function parseModule(el, moduleType, flow) {
  const mod = {
    moduleType,
    moduleId: getText(el, 'moduleId'),
    moduleName: getText(el, 'moduleName'),
    locationX: parseInt(getText(el, 'locationX') || '0'),
    locationY: parseInt(getText(el, 'locationY') || '0'),
    flow,
    ascendants: getTextArray(el, 'ascendants'),
    singleDescendant: getText(el, 'singleDescendant'),
    exceptionalDescendant: getText(el, 'exceptionalDescendant'),
    data: {}
  };

  const dataEl = el.querySelector(':scope > data');
  if (dataEl) {
    mod.data = parseModuleData(dataEl, moduleType);
  }

  return mod;
}

function parseModuleData(dataEl, moduleType) {
  const data = {};

  switch (moduleType) {
    case 'skillTransfer':
      data.maxQueueTime = getInt(dataEl, 'maxQueueTime');
      data.maxRingTime = getInt(dataEl, 'maxRingTime');
      data.placeOnBreakIfNoAnswer = getText(dataEl, 'placeOnBreakIfNoAnswer') === 'true';
      data.queueIfOnCall = getText(dataEl, 'queueIfOnCall') === 'true';
      data.onCallQueueTime = getInt(dataEl, 'onCallQueueTime');
      data.enableMusicOnHold = getText(dataEl, 'enableMusicOnHold') === 'true';
      data.vmTransferOnQueueTimeout = getText(dataEl, 'vmTransferOnQueueTimeout') === 'true';
      data.pauseBeforeTransfer = getInt(dataEl, 'pauseBeforeTransfer');
      data.clearDigitBuffer = getText(dataEl, 'clearDigitBuffer') === 'true';

      // Disposition
      const dispoEl = dataEl.querySelector(':scope > dispo');
      if (dispoEl) {
        data.disposition = {
          id: getText(dispoEl, 'id'),
          name: getText(dispoEl, 'name')
        };
      }

      // Skills
      const skillsEx = dataEl.querySelector('listOfSkillsEx');
      if (skillsEx) {
        const extObj = skillsEx.querySelector('extrnalObj');
        if (extObj) {
          data.skillName = getText(extObj, 'name');
          data.skillId = getText(extObj, 'id');
        }
      }

      // Transfer algorithm
      const algoEl = dataEl.querySelector('transferAlgorithm');
      if (algoEl) {
        data.algorithmType = getText(algoEl, 'algorithmType');
        data.statAlgorithmTimeWindow = getText(algoEl, 'statAlgorithmTimeWindow');
      }

      // Priority
      data.priorityChangeType = getText(dataEl, 'priorityChangeType');
      const pv = dataEl.querySelector('priorityChangeValue');
      if (pv) {
        const iv = pv.querySelector('integerValue');
        if (iv) data.priorityChangeValue = getInt(iv, 'value');
      }
      break;

    case 'case':
      data.branches = [];
      const branchesEl = dataEl.querySelector('branches');
      if (branchesEl) {
        for (const entry of branchesEl.querySelectorAll(':scope > entry')) {
          const key = getText(entry, 'key');
          const valueEl = entry.querySelector('value');
          if (valueEl) {
            const branch = {
              name: key,
              descendantId: getText(valueEl, 'desc'),
              conditions: []
            };

            const condEl = valueEl.querySelector('conditions');
            if (condEl && condEl.children.length > 0) {
              branch.comparisonType = getText(condEl, 'comparisonType');
              const leftOp = condEl.querySelector('leftOperand');
              if (leftOp) {
                branch.leftOperand = getText(leftOp, 'variableName') || 'value';
              }
              const rightOp = condEl.querySelector('rightOperand');
              if (rightOp) {
                const sv = rightOp.querySelector('stringValue');
                if (sv) branch.rightValue = getText(sv, 'value');
              }
            }

            data.branches.push(branch);
          }
        }
      }
      break;

    case 'hangup':
      const hDispoEl = dataEl.querySelector(':scope > dispo');
      if (hDispoEl) {
        data.disposition = {
          id: getText(hDispoEl, 'id'),
          name: getText(hDispoEl, 'name')
        };
      }
      data.returnToCallingModule = getText(dataEl, 'returnToCallingModule') === 'true';
      data.overwriteDisposition = getText(dataEl, 'overwriteDisposition') === 'true';
      break;

    case 'play':
      const promptEl = dataEl.querySelector(':scope > prompt');
      if (promptEl) {
        const ttsEl = promptEl.querySelector('ttsPrompt');
        if (ttsEl) {
          data.ttsXml = getText(ttsEl, 'xml');
          data.promptTTSEnumed = getText(ttsEl, 'promptTTSEnumed') === 'true';
        }
        data.interruptible = getText(promptEl, 'interruptible') === 'true';
      }
      const pDispoEl = dataEl.querySelector(':scope > dispo');
      if (pDispoEl) {
        data.disposition = {
          id: getText(pDispoEl, 'id'),
          name: getText(pDispoEl, 'name')
        };
      }
      break;

    case 'ifElse':
      data.branches = [];
      const ifBranchesEl = dataEl.querySelector('branches');
      if (ifBranchesEl) {
        for (const entry of ifBranchesEl.querySelectorAll(':scope > entry')) {
          const key = getText(entry, 'key');
          const valueEl = entry.querySelector('value');
          if (valueEl) {
            const branch = {
              name: key,
              descendantId: getText(valueEl, 'desc'),
              conditions: []
            };
            data.branches.push(branch);
          }
        }
      }
      break;
  }

  return data;
}

function parseMultiLanguagePrompts(ivrScript) {
  const prompts = {};
  const mlp = ivrScript.querySelector('multiLanguagesPrompts');
  if (!mlp) return prompts;

  for (const entry of mlp.querySelectorAll(':scope > entry')) {
    const key = getText(entry, 'key');
    const valueEl = entry.querySelector('value');
    if (valueEl) {
      prompts[key] = {
        promptId: getText(valueEl, 'promptId'),
        name: getText(valueEl, 'name'),
        description: getText(valueEl, 'description'),
        type: getText(valueEl, 'type')
      };
    }
  }

  return prompts;
}

function computeStats(modules, edges) {
  const blockedCount = modules
    .filter(m => m.moduleType === 'case')
    .reduce((acc, m) => {
      const branches = m.data.branches || [];
      return acc + branches.filter(b => b.name !== 'No Match').length;
    }, 0);

  const skills = new Set();
  modules.forEach(m => {
    if (m.data.skillName) skills.add(m.data.skillName);
  });

  return {
    totalModules: modules.length,
    totalConnections: edges.length,
    blockedANIs: blockedCount,
    skills: skills.size,
    skillNames: [...skills]
  };
}

// Utility helpers
function getText(el, tag) {
  const child = el.querySelector(':scope > ' + tag);
  return child ? child.textContent.trim() : '';
}

function getTextArray(el, tag) {
  const children = el.querySelectorAll(':scope > ' + tag);
  return Array.from(children).map(c => c.textContent.trim());
}

function getInt(el, tag) {
  const val = getText(el, tag);
  return val ? parseInt(val, 10) : 0;
}
