/**
 * InspectorPanel — Glassmorphism slide-out panel for module inspection
 * Shows Audit View, Prompt Playback, Decision Tree depending on module type
 */
import { decodeTTSPrompt } from '../parser/ttsDecoder.js';

export class InspectorPanel {
  constructor() {
    this.panel = document.getElementById('inspector-panel');
    this.title = document.getElementById('inspector-title');
    this.type = document.getElementById('inspector-type');
    this.icon = document.getElementById('inspector-icon');
    this.body = document.getElementById('inspector-body');
    this.closeBtn = document.getElementById('inspector-close');

    this.closeBtn.addEventListener('click', () => this.close());
    this.isOpen = false;
  }

  open(moduleData) {
    if (!moduleData) return;

    this.title.textContent = moduleData.moduleName;
    this.type.textContent = moduleData.moduleType;

    // Set icon
    this.icon.className = 'inspector-icon';
    const iconMap = {
      incomingCall: { class: 'incoming', emoji: '📡' },
      skillTransfer: { class: 'skill', emoji: '🔧' },
      case: { class: 'case', emoji: '🔀' },
      hangup: { class: 'hangup', emoji: '📴' },
      play: { class: 'play', emoji: '🔊' },
      startOnHangup: { class: 'start', emoji: '⚡' }
    };
    const iconInfo = iconMap[moduleData.moduleType] || { class: 'start', emoji: '◆' };
    this.icon.classList.add(iconInfo.class);
    this.icon.textContent = iconInfo.emoji;

    // Build body content
    this.body.innerHTML = this._buildContent(moduleData);

    // Show panel
    this.panel.classList.remove('hidden');
    requestAnimationFrame(() => {
      this.panel.classList.add('visible');
    });
    this.isOpen = true;
  }

  close() {
    this.panel.classList.remove('visible');
    this.panel.classList.add('hidden');
    this.isOpen = false;
  }

  _buildContent(mod) {
    let html = '';

    // Common metadata section
    html += this._section('Module Identity', `
      ${this._kv('Module ID', mod.moduleId, 'info')}
      ${this._kv('Flow', mod.flow === 'main' ? 'Main IVR' : 'On-Hangup', 'info')}
      ${this._kv('Position', `X: ${mod.locationX}  Y: ${mod.locationY}`)}
      ${mod.singleDescendant ? this._kv('Next Module', mod.singleDescendant.substring(0, 12) + '…', 'info') : ''}
      ${mod.ascendants.length ? this._kv('Ascendants', mod.ascendants.length + ' module(s)') : ''}
    `);

    // Type-specific sections
    switch (mod.moduleType) {
      case 'skillTransfer':
        html += this._buildSkillTransferView(mod);
        break;
      case 'case':
        html += this._buildCaseView(mod);
        break;
      case 'play':
        html += this._buildPlayView(mod);
        break;
      case 'hangup':
        html += this._buildHangupView(mod);
        break;
      case 'incomingCall':
        html += this._buildIncomingCallView(mod);
        break;
    }

    return html;
  }

  _buildSkillTransferView(mod) {
    const d = mod.data;
    let html = '';

    // Audit View — the key diagnostic section
    html += this._section('⚠️ Audit View', `
      ${this._kv('Skill', d.skillName || 'N/A', 'info')}
      ${this._kv('Max Queue Time', d.maxQueueTime ? d.maxQueueTime + 's' : 'N/A', d.maxQueueTime > 300 ? 'warn' : 'ok')}
      ${this._kv('Max Ring Time', d.maxRingTime ? d.maxRingTime + 's' : 'N/A', d.maxRingTime < 20 ? 'warn' : 'ok')}
      ${this._kv('Place on Break if No Answer', d.placeOnBreakIfNoAnswer ? 'YES' : 'NO', d.placeOnBreakIfNoAnswer ? 'warn' : 'ok')}
      ${this._kv('Queue if On Call', d.queueIfOnCall ? 'YES' : 'NO')}
      ${this._kv('On-Call Queue Time', d.onCallQueueTime ? d.onCallQueueTime + 's' : 'N/A')}
      ${this._kv('Music on Hold', d.enableMusicOnHold ? 'Enabled' : 'Disabled', 'ok')}
      ${this._kv('VM on Queue Timeout', d.vmTransferOnQueueTimeout ? 'YES' : 'NO')}
      ${this._kv('Pause Before Transfer', d.pauseBeforeTransfer ? d.pauseBeforeTransfer + 's' : '0s')}
    `);

    // Transfer algorithm
    html += this._section('Transfer Algorithm', `
      ${this._kv('Algorithm', d.algorithmType || 'N/A', 'info')}
      ${this._kv('Time Window', d.statAlgorithmTimeWindow || 'N/A')}
      ${this._kv('Priority Change', d.priorityChangeType || 'N/A')}
      ${d.priorityChangeValue ? this._kv('Priority Value', '+' + d.priorityChangeValue) : ''}
    `);

    // Disposition
    if (d.disposition) {
      html += this._section('Disposition', `
        ${this._kv('Name', d.disposition.name, d.disposition.name === 'Abandon' ? 'warn' : '')}
        ${this._kv('ID', d.disposition.id)}
      `);
    }

    // Diagnostic callouts
    const warnings = [];
    if (d.maxQueueTime > 300) {
      warnings.push(`<strong>Long Queue:</strong> Max queue time is ${d.maxQueueTime}s (${Math.round(d.maxQueueTime / 60)} min). Callers may abandon before reaching an agent.`);
    }
    if (d.maxRingTime && d.maxRingTime < 20) {
      warnings.push(`<strong>Short Ring:</strong> Max ring time is only ${d.maxRingTime}s. Agents have limited time to pick up.`);
    }
    if (d.placeOnBreakIfNoAnswer) {
      warnings.push(`<strong>Auto-Break:</strong> Agents go "Not Ready" if they don't answer within ${d.maxRingTime}s. This is why agents may show as unavailable.`);
    }

    if (warnings.length) {
      html += `<div class="inspector-section">
        <div class="inspector-section-title">🚨 Diagnostic Alerts</div>
        ${warnings.map(w => `<div class="kv-row" style="flex-direction:column;align-items:flex-start;gap:4px;padding:12px;background:rgba(255,61,90,0.05);border:1px solid rgba(255,61,90,0.1);border-radius:8px;margin-bottom:8px;">
          <span style="font-size:0.78rem;color:var(--accent-red);line-height:1.5;">${w}</span>
        </div>`).join('')}
      </div>`;
    }

    return html;
  }

  _buildCaseView(mod) {
    const d = mod.data;
    let html = '';

    if (d.branches && d.branches.length > 0) {
      const blockedBranches = d.branches.filter(b => b.name !== 'No Match');
      const noMatchBranch = d.branches.find(b => b.name === 'No Match');

      // Decision tree summary
      html += this._section('🔀 Decision Logic', `
        ${this._kv('Variable Tested', blockedBranches[0]?.leftOperand || 'Call.ANI', 'info')}
        ${this._kv('Comparison', blockedBranches[0]?.comparisonType || 'EQUALS', 'info')}
        ${this._kv('Blocked Entries', blockedBranches.length.toString(), 'warn')}
        ${noMatchBranch ? this._kv('Default Path', 'Passes through', 'ok') : ''}
      `);

      // Decision tree visual
      html += `<div class="inspector-section">
        <div class="inspector-section-title">Decision Tree</div>
        <div class="decision-tree">`;

      // Show "No Match" (pass-through) first
      if (noMatchBranch) {
        html += `<div class="decision-branch">
          <div class="branch-indicator pass"></div>
          <span class="branch-name">No Match (pass-through)</span>
          <span class="branch-target">→ Continue</span>
        </div>`;
      }

      html += `</div></div>`;

      // Blocked ANI list
      html += `<div class="inspector-section">
        <div class="inspector-section-title">🚫 Blocked Callers (${blockedBranches.length})</div>
        <div class="blocked-list">`;

      blockedBranches.forEach(b => {
        html += `<div class="blocked-item" title="${b.comparisonType} ${b.rightValue || b.name}">${b.name}</div>`;
      });

      html += `</div></div>`;
    }

    return html;
  }

  _buildPlayView(mod) {
    const d = mod.data;
    let html = '';

    // Prompt playback
    html += `<div class="inspector-section">
      <div class="inspector-section-title">🔊 Prompt Playback</div>`;

    if (d.ttsXml) {
      const decoded = decodeTTSPrompt(d.ttsXml);
      if (decoded) {
        html += `<div class="tts-display">${this._escapeHtml(decoded.text || decoded.xml || '[No text content]')}</div>`;

        if (decoded.segments && decoded.segments.length > 0) {
          html += `<div style="margin-top:12px;">`;
          decoded.segments.forEach(seg => {
            html += `<div class="kv-row">
              <span class="kv-key">${seg.type}</span>
              <span class="kv-value" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;">${this._escapeHtml(seg.content.substring(0, 80))}</span>
            </div>`;
          });
          html += `</div>`;
        }
      } else {
        html += `<div class="tts-display">[Unable to decode TTS prompt]</div>`;
      }
    } else {
      html += `<div class="tts-display">[No TTS prompt data]</div>`;
    }

    html += `</div>`;

    // Playback settings
    html += this._section('Settings', `
      ${this._kv('Interruptible', d.interruptible ? 'YES' : 'NO')}
      ${d.disposition ? this._kv('Disposition', d.disposition.name) : ''}
    `);

    return html;
  }

  _buildHangupView(mod) {
    const d = mod.data;
    let html = '';

    html += this._section('Hangup Configuration', `
      ${d.disposition ? this._kv('Disposition', d.disposition.name, d.disposition.name.includes('Disconnect') ? 'warn' : '') : ''}
      ${d.disposition ? this._kv('Disposition ID', d.disposition.id) : ''}
      ${this._kv('Return to Caller', d.returnToCallingModule ? 'YES' : 'NO')}
      ${this._kv('Overwrite Disposition', d.overwriteDisposition ? 'YES' : 'NO')}
    `);

    return html;
  }

  _buildIncomingCallView(mod) {
    let html = '';

    html += this._section('Entry Point', `
      ${this._kv('Type', 'Incoming Call Entry Portal', 'info')}
      ${this._kv('Next Module', mod.singleDescendant ? mod.singleDescendant.substring(0, 16) + '…' : 'None', 'info')}
    `);

    return html;
  }

  // Helpers
  _section(title, content) {
    return `<div class="inspector-section">
      <div class="inspector-section-title">${title}</div>
      ${content}
    </div>`;
  }

  _kv(key, value, variant = '') {
    return `<div class="kv-row">
      <span class="kv-key">${key}</span>
      <span class="kv-value ${variant}">${value}</span>
    </div>`;
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
