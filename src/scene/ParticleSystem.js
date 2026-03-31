/**
 * ParticleSystem — Ambient floating particles for atmosphere
 * Light-theme optimized: soft pastel dust motes drifting gently
 */
import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this._init();
  }

  _init() {
    const count = 500;
    const spread = 300;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    // Soft palette for light theme
    const palette = [
      new THREE.Color(0x88bbdd),
      new THREE.Color(0xaa88cc),
      new THREE.Color(0xddaa77),
      new THREE.Color(0x77aadd),
      new THREE.Color(0x88ccaa),
      new THREE.Color(0xccccdd),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * 80 + 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      speeds[i] = 0.15 + Math.random() * 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.NormalBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.speeds = speeds;
    this.scene.add(this.particles);
  }

  update(elapsed, delta) {
    const positions = this.particles.geometry.attributes.position.array;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      // Slow upward drift
      positions[i * 3 + 1] += this.speeds[i] * delta * 1.5;

      // Gentle horizontal sway
      positions[i * 3] += Math.sin(elapsed * 0.2 + i * 0.7) * delta * 0.2;
      positions[i * 3 + 2] += Math.cos(elapsed * 0.15 + i * 0.5) * delta * 0.15;

      // Wrap around when too high
      if (positions[i * 3 + 1] > 90) {
        positions[i * 3 + 1] = 2;
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
