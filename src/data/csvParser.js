/**
 * CSV Parser for Five9 Call Log Reports
 * Maps call records to IVR module paths for heat-mapping
 */

export function parseCallLogCSV(csvText) {
  const lines = csvText.split('\n').filter(l => l.trim());
  if (lines.length < 2) return { records: [], pathVolumes: {}, moduleVolumes: {} };

  const headers = parseCSVLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record = {};
    headers.forEach((h, idx) => {
      record[h.trim()] = values[idx]?.trim() || '';
    });
    records.push(record);
  }

  return analyzeCallData(records);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function analyzeCallData(records) {
  const pathVolumes = {};
  const moduleVolumes = {};
  const abandonData = {};
  const dispositions = {};

  records.forEach(r => {
    // Track dispositions
    const dispo = r['DISPOSITION'] || r['Disposition'] || r['disposition'] || '';
    if (dispo) {
      dispositions[dispo] = (dispositions[dispo] || 0) + 1;
    }

    // Track IVR path if available
    const ivrPath = r['IVR_PATH'] || r['IVR Path'] || r['ivr_path'] || '';
    if (ivrPath) {
      pathVolumes[ivrPath] = (pathVolumes[ivrPath] || 0) + 1;
    }

    // Track skill/queue data
    const skill = r['SKILL'] || r['Skill'] || r['skill'] || '';
    if (skill) {
      moduleVolumes[skill] = (moduleVolumes[skill] || 0) + 1;
    }

    // Track abandons
    if (dispo.toLowerCase().includes('abandon')) {
      const queueTime = parseFloat(r['QUEUE_TIME'] || r['Queue Time'] || '0');
      if (!abandonData[skill]) abandonData[skill] = [];
      abandonData[skill].push(queueTime);
    }
  });

  return {
    records,
    pathVolumes,
    moduleVolumes,
    dispositions,
    abandonData,
    totalCalls: records.length
  };
}

/**
 * Generates simulated heat-map data for demo mode
 */
export function generateDemoHeatData(modules, edges) {
  const moduleVolumes = {};
  const edgeVolumes = {};
  const frictionModules = new Set();
  const successModules = new Set();

  modules.forEach(mod => {
    switch (mod.moduleType) {
      case 'incomingCall':
        moduleVolumes[mod.moduleId] = 10000;
        break;
      case 'case':
        moduleVolumes[mod.moduleId] = 9500;
        break;
      case 'skillTransfer':
        moduleVolumes[mod.moduleId] = 8200;
        if (mod.data.maxQueueTime > 300) {
          frictionModules.add(mod.moduleId);
        }
        break;
      case 'play':
        moduleVolumes[mod.moduleId] = 7500;
        successModules.add(mod.moduleId);
        break;
      case 'hangup':
        moduleVolumes[mod.moduleId] = mod.flow === 'main' ? 500 : 7000;
        break;
      default:
        moduleVolumes[mod.moduleId] = 5000;
    }
  });

  edges.forEach(edge => {
    const fromVol = moduleVolumes[edge.from] || 1000;
    const toVol = moduleVolumes[edge.to] || 1000;
    const vol = Math.min(fromVol, toVol);
    edgeVolumes[`${edge.from}->${edge.to}`] = vol;
  });

  return {
    moduleVolumes,
    edgeVolumes,
    frictionModules: [...frictionModules],
    successModules: [...successModules],
    maxVolume: 10000
  };
}
