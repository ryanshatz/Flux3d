/**
 * Flux3D — Main Application Entry Point
 * Wires parser → scene → UI. Handles file uploads and demo mode.
 */
import { parseFive9IVR } from './parser/five9Parser.js';
import { generateDemoHeatData } from './data/csvParser.js';
import { parseCallLogCSV } from './data/csvParser.js';
import { SceneManager } from './scene/SceneManager.js';
import { InspectorPanel } from './ui/InspectorPanel.js';

class Flux3D {
  constructor() {
    this.parsedData = null;
    this.heatData = null;
    this.sceneManager = null;
    this.inspector = null;

    this._init();
  }

  async _init() {
    // Initialize 3D scene
    const container = document.getElementById('canvas-container');
    this.sceneManager = new SceneManager(container);

    // Initialize inspector
    this.inspector = new InspectorPanel();

    // Wire module click callback
    this.sceneManager.onModuleClick = (moduleId) => {
      const mod = this.parsedData?.moduleMap[moduleId];
      if (mod) {
        this.inspector.open(mod);
      }
    };

    // Wire toolbar buttons
    this._setupToolbar();

    // Wire file drop zone
    this._setupDropZone();

    // Try to auto-load bundled demo file
    await this._loadBundledDemo();

    // Hide loading overlay
    setTimeout(() => {
      const overlay = document.getElementById('loading-overlay');
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 800);

      // Show onboarding toast on first visit
      this._showOnboarding();
    }, 1500);
  }

  async _loadBundledDemo() {
    try {
      const base = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${base}INBOUND OPEN.five9ivr`);
      if (response.ok) {
        const text = await response.text();
        this._processIVRFile(text, 'INBOUND OPEN.five9ivr');
      }
    } catch (e) {
      console.log('No bundled demo file found, waiting for user upload.');
    }
  }

  _processIVRFile(xmlText, fileName) {
    try {
      this.parsedData = parseFive9IVR(xmlText);

      // Generate demo heat data
      this.heatData = generateDemoHeatData(this.parsedData.modules, this.parsedData.edges);

      // Build 3D scene
      this.sceneManager.buildGraph(this.parsedData, this.heatData);

      // Update UI
      document.getElementById('script-name').textContent = fileName;
      this._updateStats();

      console.log('Parsed IVR:', this.parsedData);
    } catch (e) {
      console.error('Failed to parse IVR file:', e);
      alert('Failed to parse IVR file: ' + e.message);
    }
  }

  _processCSVFile(csvText, fileName) {
    try {
      const csvData = parseCallLogCSV(csvText);
      console.log('Parsed CSV:', csvData);

      // TODO: Map CSV data to real heat-map values
      // For now, regenerate the scene with existing heat data
      alert(`Loaded ${csvData.totalCalls} call records from ${fileName}`);
    } catch (e) {
      console.error('Failed to parse CSV:', e);
      alert('Failed to parse CSV file: ' + e.message);
    }
  }

  _updateStats() {
    if (!this.parsedData) return;

    const { stats } = this.parsedData;
    document.getElementById('stat-modules').textContent = `${stats.totalModules} modules`;
    document.getElementById('stat-connections').textContent = `${stats.totalConnections} connections`;
    document.getElementById('stat-blocked').textContent = `${stats.blockedANIs} ANIs`;
    document.getElementById('stat-skills').textContent = `${stats.skills} skills`;

    const statsInline = document.getElementById('stats-inline');
    statsInline.classList.remove('hidden');
  }

  _setupToolbar() {
    // IVR Upload
    const btnIvr = document.getElementById('btn-upload-ivr');
    const inputIvr = document.getElementById('file-input-ivr');
    btnIvr.addEventListener('click', () => inputIvr.click());
    inputIvr.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => this._processIVRFile(ev.target.result, file.name);
        reader.readAsText(file);
      }
    });

    // CSV Upload
    const btnCsv = document.getElementById('btn-upload-csv');
    const inputCsv = document.getElementById('file-input-csv');
    btnCsv.addEventListener('click', () => inputCsv.click());
    inputCsv.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => this._processCSVFile(ev.target.result, file.name);
        reader.readAsText(file);
      }
    });

    // Toggle Labels
    const btnLabels = document.getElementById('btn-toggle-labels');
    btnLabels.addEventListener('click', () => {
      btnLabels.classList.toggle('active');
      this.sceneManager.toggleLabels(btnLabels.classList.contains('active'));
    });

    // Toggle Heat Map (animated)
    const btnHeat = document.getElementById('btn-toggle-heat');
    btnHeat.addEventListener('click', () => {
      btnHeat.classList.toggle('active');
      const enabled = btnHeat.classList.contains('active');
      this.sceneManager.toggleHeatMap(enabled, this.parsedData, this.heatData);
      const btnAni = document.getElementById('btn-toggle-ani');
      if (btnAni.classList.contains('active') && this.parsedData) {
        const heat = enabled ? this.heatData : null;
        this.sceneManager.toggleANIExpansion(true, this.parsedData, heat);
      }
    });

    // Toggle ANI Expansion
    const btnAni = document.getElementById('btn-toggle-ani');
    btnAni.addEventListener('click', () => {
      btnAni.classList.toggle('active');
      const enabled = btnAni.classList.contains('active');
      if (this.parsedData) {
        const heat = document.getElementById('btn-toggle-heat').classList.contains('active') ? this.heatData : null;
        this.sceneManager.toggleANIExpansion(enabled, this.parsedData, heat);
      }
    });

    // Toggle Tour
    const btnTour = document.getElementById('btn-toggle-tour');
    btnTour.addEventListener('click', () => {
      if (this.sceneManager._tour?.active) {
        this.sceneManager.stopTour();
      } else {
        this.sceneManager.startTour();
      }
    });

    // Reset Camera
    const btnReset = document.getElementById('btn-reset-camera');
    btnReset.addEventListener('click', () => {
      this.sceneManager.resetCamera();
    });

    // Screenshot with branding
    const btnScreenshot = document.getElementById('btn-screenshot');
    btnScreenshot.addEventListener('click', () => {
      this._takeScreenshot();
    });

    // Fullscreen
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this._toggleFullscreen());
    }

    // Global keyboard shortcuts
    this._setupKeyboardShortcuts();
  }

  _takeScreenshot() {
    const dataUrl = this.sceneManager.screenshot();

    // Add branding watermark
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Watermark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(canvas.width - 220, canvas.height - 36, 220, 36);

      // Watermark text
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText('◆ FLUX3D', canvas.width - 12, canvas.height - 16);

      // Timestamp
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      const now = new Date().toLocaleString();
      ctx.fillText(now, canvas.width - 12, canvas.height - 4);

      // Download
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `flux3d-${Date.now()}.png`;
      link.click();
    };
    img.src = dataUrl;
  }

  _toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  _setupKeyboardShortcuts() {
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const shortcutsOverlay = document.getElementById('shortcuts-overlay');
    const shortcutsClose = document.getElementById('shortcuts-close');

    if (shortcutsClose) {
      shortcutsClose.addEventListener('click', () => {
        shortcutsOverlay.classList.add('hidden');
      });
    }

    // Click backdrop to close overlays
    searchOverlay?.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.add('hidden');
        searchInput.value = '';
        searchResults.innerHTML = '';
      }
    });
    shortcutsOverlay?.addEventListener('click', (e) => {
      if (e.target === shortcutsOverlay) {
        shortcutsOverlay.classList.add('hidden');
      }
    });

    // Search input handler
    searchInput?.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      searchResults.innerHTML = '';
      if (!query || !this.parsedData) return;

      const matches = this.parsedData.modules.filter(m =>
        m.moduleName.toLowerCase().includes(query) ||
        m.moduleType.toLowerCase().includes(query)
      ).slice(0, 10);

      matches.forEach(mod => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
          <span class="search-result-type">${mod.moduleType}</span>
          <span class="search-result-name">${mod.moduleName}</span>
        `;
        item.addEventListener('click', () => {
          searchOverlay.classList.add('hidden');
          searchInput.value = '';
          searchResults.innerHTML = '';

          // Navigate to module
          const obj = this.sceneManager.modules3D[mod.moduleId];
          if (obj) {
            if (this.sceneManager.controlMode === 'thirdPerson' && this.sceneManager.avatar) {
              this.sceneManager.avatar.navigateTo(obj.position.x, obj.position.z);
            }
            this.sceneManager._highlightModule(mod.moduleId);
            if (this.sceneManager.onModuleClick) {
              this.sceneManager.onModuleClick(mod.moduleId);
            }
          }
        });
        searchResults.appendChild(item);
      });
    });

    window.addEventListener('keydown', (e) => {
      // Ctrl+F — Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchOverlay.classList.remove('hidden');
        setTimeout(() => searchInput?.focus(), 50);
        return;
      }

      // Escape — close overlays
      if (e.key === 'Escape') {
        searchOverlay?.classList.add('hidden');
        shortcutsOverlay?.classList.add('hidden');
        if (searchInput) { searchInput.value = ''; searchResults.innerHTML = ''; }
        return;
      }

      // ? — Keyboard shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        // Only if no input is focused
        if (document.activeElement?.tagName !== 'INPUT') {
          shortcutsOverlay?.classList.toggle('hidden');
        }
        return;
      }

      // F11 — Fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        this._toggleFullscreen();
        return;
      }

      // T — Auto-tour through call flow
      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
        if (document.activeElement?.tagName !== 'INPUT') {
          if (this.sceneManager._tour?.active) {
            this.sceneManager.stopTour();
          } else {
            this.sceneManager.startTour();
          }
        }
        return;
      }
    });
  }

  _detectDeadEnds() {
    if (!this.parsedData) return;
    const { modules, edges } = this.parsedData;
    const outgoing = new Set(edges.map(e => e.from));

    modules.forEach(mod => {
      if (!outgoing.has(mod.moduleId) && mod.moduleType !== 'hangup') {
        console.warn(`⚠️ Dead-end detected: ${mod.moduleName} (${mod.moduleType})`);
      }
    });
  }

  _setupDropZone() {
    const dropZone = document.getElementById('drop-zone');
    const body = document.body;

    let dragCounter = 0;

    body.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dragCounter++;
      dropZone.classList.remove('hidden');
    });

    body.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dropZone.classList.add('hidden');
        dragCounter = 0;
      }
    });

    body.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    body.addEventListener('drop', (e) => {
      e.preventDefault();
      dragCounter = 0;
      dropZone.classList.add('hidden');

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (file.name.endsWith('.five9ivr') || file.name.endsWith('.xml')) {
          this._processIVRFile(ev.target.result, file.name);
        } else if (file.name.endsWith('.csv')) {
          this._processCSVFile(ev.target.result, file.name);
        } else {
          alert('Unsupported file type. Please drop a .five9ivr or .csv file.');
        }
      };
      reader.readAsText(file);
    });
  }

  _showOnboarding() {
    // Only show once per browser
    if (localStorage.getItem('flux3d-onboarded')) return;

    const toast = document.getElementById('onboarding-toast');
    if (!toast) return;

    toast.classList.remove('hidden');
    localStorage.setItem('flux3d-onboarded', '1');

    // Dismiss button
    const dismissBtn = document.getElementById('toast-dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => toast.classList.add('hidden'));
    }

    // Auto-dismiss after 6s
    setTimeout(() => toast.classList.add('hidden'), 6000);
  }
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
  new Flux3D();
});

