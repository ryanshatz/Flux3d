/**
 * ParticleSystem — Enhanced ambient floating particles for atmosphere
 * Now features glow sprites, size variation, additive blending, and firefly layer
 */
import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this._init();
  }

  _init() {
    // Create soft glow sprite texture via canvas
    this._glowTexture = this._createGlowTexture();

    // Main dust mote layer — 1200 particles with size variation
    this._createDustLayer();

    // Firefly layer — 60 large, bright, sparse particles with slow pulse
    this._createFireflyLayer();
  }

  _createGlowTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.15, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  _createDustLayer() {
    const count = 600;
    const spread = 350;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);

    const palette = [
      new THREE.Color(0x4488cc),
      new THREE.Color(0x7766bb),
      new THREE.Color(0xcc8855),
      new THREE.Color(0x5599dd),
      new THREE.Color(0x55bb99),
      new THREE.Color(0x8899bb),
      new THREE.Color(0x00bbff),
      new THREE.Color(0x9966dd),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * 100 + 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.3 + Math.random() * 0.9;
      speeds[i] = 0.1 + Math.random() * 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      map: this._glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.dustSpeeds = speeds;
    this.scene.add(this.dustParticles);
  }

  _createFireflyLayer() {
    const count = 20;
    const spread = 250;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    const palette = [
      new THREE.Color(0x00eeff),
      new THREE.Color(0xaa77ff),
      new THREE.Color(0xff8844),
      new THREE.Color(0x44ffaa),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * 60 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      map: this._glowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.fireflyParticles = new THREE.Points(geometry, material);
    this.fireflyPhases = phases;
    this.scene.add(this.fireflyParticles);
  }

  update(elapsed, delta) {
    // Update dust motes
    const dustPos = this.dustParticles.geometry.attributes.position.array;
    const dustCount = dustPos.length / 3;
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3 + 1] += this.dustSpeeds[i] * delta * 1.5;
      dustPos[i * 3] += Math.sin(elapsed * 0.15 + i * 0.7) * delta * 0.25;
      dustPos[i * 3 + 2] += Math.cos(elapsed * 0.12 + i * 0.5) * delta * 0.18;
      if (dustPos[i * 3 + 1] > 110) {
        dustPos[i * 3 + 1] = 1;
        dustPos[i * 3] = (Math.random() - 0.5) * 350;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 350;
      }
    }
    this.dustParticles.geometry.attributes.position.needsUpdate = true;

    // Subtle global opacity pulse for dust
    this.dustParticles.material.opacity = 0.18 + Math.sin(elapsed * 0.5) * 0.04;

    // Update fireflies — slow drift + pulsing opacity
    const ffPos = this.fireflyParticles.geometry.attributes.position.array;
    const ffCount = ffPos.length / 3;
    for (let i = 0; i < ffCount; i++) {
      const phase = this.fireflyPhases[i];
      ffPos[i * 3] += Math.sin(elapsed * 0.08 + phase) * delta * 0.6;
      ffPos[i * 3 + 1] += Math.sin(elapsed * 0.12 + phase * 2) * delta * 0.3;
      ffPos[i * 3 + 2] += Math.cos(elapsed * 0.1 + phase) * delta * 0.5;

      // Keep in bounds
      if (Math.abs(ffPos[i * 3]) > 150) ffPos[i * 3] *= 0.95;
      if (ffPos[i * 3 + 1] > 70 || ffPos[i * 3 + 1] < 3) {
        ffPos[i * 3 + 1] = 5 + Math.random() * 55;
      }
      if (Math.abs(ffPos[i * 3 + 2]) > 150) ffPos[i * 3 + 2] *= 0.95;
    }
    this.fireflyParticles.geometry.attributes.position.needsUpdate = true;

    // Firefly pulsing glow
    this.fireflyParticles.material.opacity = 0.15 + Math.sin(elapsed * 0.8) * 0.12;
    this.fireflyParticles.material.size = 1.5 + Math.sin(elapsed * 0.6) * 0.4;
  }
}
