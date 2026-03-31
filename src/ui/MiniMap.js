/**
 * MiniMap — 2D top-down overview showing module positions and player location
 * Renders to a canvas element overlaid in the bottom-right corner
 */
export class MiniMap {
  constructor(container) {
    this.container = container;
    this.modules = [];
    this.playerPos = { x: 0, z: 0 };
    this.visible = true;

    this._createCanvas();
  }

  _createCanvas() {
    const wrapper = document.createElement('div');
    wrapper.className = 'minimap-wrapper';

    const canvas = document.createElement('canvas');
    canvas.className = 'minimap-canvas';
    canvas.width = 180;
    canvas.height = 180;
    wrapper.appendChild(canvas);

    // Title
    const title = document.createElement('div');
    title.className = 'minimap-title';
    title.textContent = 'MAP';
    wrapper.appendChild(title);

    this.container.appendChild(wrapper);
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.wrapper = wrapper;
  }

  setModules(modules3D, moduleData) {
    this.modules = [];
    const positions = [];

    for (const [id, obj] of Object.entries(modules3D)) {
      positions.push({ x: obj.position.x, z: obj.position.z });
      const data = moduleData[id] || {};
      this.modules.push({
        x: obj.position.x,
        z: obj.position.z,
        type: data.moduleType || obj.userData?.moduleType || 'unknown',
        name: data.moduleName || id
      });
    }

    // Compute bounds for mapping
    if (positions.length === 0) return;
    const xs = positions.map(p => p.x);
    const zs = positions.map(p => p.z);
    this.bounds = {
      minX: Math.min(...xs) - 20,
      maxX: Math.max(...xs) + 20,
      minZ: Math.min(...zs) - 20,
      maxZ: Math.max(...zs) + 20,
    };
  }

  updatePlayerPosition(x, z) {
    this.playerPos.x = x;
    this.playerPos.z = z;
  }

  render() {
    if (!this.visible || !this.bounds) return;

    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    const pad = 14;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'rgba(13, 17, 23, 0.9)';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(240, 246, 252, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Map world coords to canvas
    const mapX = (wx) => pad + ((wx - this.bounds.minX) / (this.bounds.maxX - this.bounds.minX)) * (w - pad * 2);
    const mapZ = (wz) => pad + ((wz - this.bounds.minZ) / (this.bounds.maxZ - this.bounds.minZ)) * (h - pad * 2);

    // Draw modules as dots
    const typeColors = {
      incomingCall: '#0088cc',
      skillTransfer: '#cc7700',
      case: '#ccaa00',
      ifElse: '#ccaa00',
      hangup: '#cc2244',
      play: '#8844cc',
      setVariable: '#5577aa',
      blockedCallerList: '#cc4466',
      thirdPartyTransfer: '#cc5588',
      voiceMailTransfer: '#cc5588',
      agentTransfer: '#cc7700',
    };

    this.modules.forEach(mod => {
      const mx = mapX(mod.x);
      const mz = mapZ(mod.z);
      const color = typeColors[mod.type] || '#7788aa';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(mx, mz, 4, 0, Math.PI * 2);
      ctx.fill();

      // White outline
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw player position as pulsing triangle
    const px = mapX(this.playerPos.x);
    const pz = mapZ(this.playerPos.z);
    const pulse = 1 + Math.sin(performance.now() * 0.005) * 0.2;

    ctx.save();
    ctx.translate(px, pz);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = '#0055dd';
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(4, 3);
    ctx.lineTo(-4, 3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  toggle() {
    this.visible = !this.visible;
    this.wrapper.style.display = this.visible ? 'block' : 'none';
  }

  dispose() {
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
  }
}
