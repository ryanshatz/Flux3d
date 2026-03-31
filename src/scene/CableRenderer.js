/**
 * CableRenderer — Draws orthogonal 3D cables between modules
 * Features: Manhattan routing, smooth rounded corners, animated flow particles,
 * electric pulse wave, and directional indicators
 */
import * as THREE from 'three';

export class CableRenderer {
  constructor() {
    // Create shared glow sprite texture for flow particles
    this._flowTexture = this._createFlowTexture();
  }

  _createFlowTexture() {
    const c = document.createElement('canvas');
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  create(fromPos, toPos, options = {}) {
    const { type = 'primary', volume = 0.5, isFriction = false, isSuccess = false, dimMode = false, edgeIndex = 0, totalEdges = 1 } = options;

    const group = new THREE.Group();

    // Build orthogonal path with rounded corners
    const points = this._buildOrthogonalPath(fromPos, toPos, edgeIndex, totalEdges);
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.35);

    // Cable thickness
    const baseRadius = dimMode ? 0.15 : (0.25 + volume * 0.35);

    // Determine color
    let cableColor, emissiveColor;
    if (dimMode) {
      cableColor = new THREE.Color(0x445566);
      emissiveColor = new THREE.Color(0x334455);
    } else if (isFriction) {
      cableColor = new THREE.Color(0xdd2244);
      emissiveColor = new THREE.Color(0xcc1133);
    } else if (isSuccess) {
      cableColor = new THREE.Color(0x00aa55);
      emissiveColor = new THREE.Color(0x009944);
    } else if (type === 'branch') {
      cableColor = new THREE.Color(0xcc8800);
      emissiveColor = new THREE.Color(0xaa6600);
    } else if (type === 'exceptional') {
      cableColor = new THREE.Color(0xdd5533);
      emissiveColor = new THREE.Color(0xbb3311);
    } else {
      cableColor = new THREE.Color(0x2266bb);
      emissiveColor = new THREE.Color(0x114488);
    }

    // Main cable tube — solid and visible
    const tubeGeo = new THREE.TubeGeometry(curve, 64, baseRadius, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: cableColor,
      emissive: emissiveColor,
      emissiveIntensity: dimMode ? 0.2 : (0.5 + volume * 0.4),
      metalness: 0.5,
      roughness: 0.35,
      transparent: true,
      opacity: dimMode ? 0.5 : (0.85 + volume * 0.15)
    });
    tubeMat._baseOpacity = tubeMat.opacity;
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    group.add(tube);

    // Outer glow tube (subtle ambient glow)
    if (!dimMode) {
      const glowGeo = new THREE.TubeGeometry(curve, 32, baseRadius * 2.5, 6, false);
      const glowMat = new THREE.MeshBasicMaterial({
        color: cableColor,
        transparent: true,
        opacity: 0.04 + volume * 0.04
      });
      glowMat._baseOpacity = glowMat.opacity;
      const glow = new THREE.Mesh(glowGeo, glowMat);
      group.add(glow);
    }

    // Animated flow particles along the cable
    if (!dimMode) {
      this._createFlowParticles(group, curve, cableColor, volume);
    }

    // Animated electric pulse wave (bright traveling spot)
    const pulseSpeed = 0.3 + volume * 0.4;
    const baseEmissiveIntensity = dimMode ? 0.2 : (0.5 + volume * 0.4);
    const baseOpacity = tubeMat.opacity;

    // Store update function for animation
    group.userData.startPos = fromPos.clone();
    group.userData.endPos = toPos.clone();
    group.userData.baseEmissive = baseEmissiveIntensity;
    group.userData.update = (elapsed) => {
      // Cable breathing pulse
      const breathe = Math.sin(elapsed * (1.5 + volume * 2)) * 0.12;
      tubeMat.emissiveIntensity = baseEmissiveIntensity + breathe;

      if (isFriction) {
        tubeMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 5) * 0.3;
      }

      // Electric pulse wave — brief opacity spike traveling along the tube
      const pulseT = (elapsed * pulseSpeed) % 1.0;
      const pulseIntensity = Math.exp(-50 * Math.pow(pulseT - 0.5, 2)) * 0.15;
      tubeMat.opacity = baseOpacity + pulseIntensity;

      // Animate flow particles
      if (group.userData._flowParticles) {
        this._updateFlowParticles(group.userData._flowParticles, curve, elapsed, volume);
      }
    };

    return group;
  }

  /**
   * Create animated particles that travel along the cable path
   */
  _createFlowParticles(group, curve, color, volume) {
    const particleCount = Math.max(3, Math.min(12, Math.floor(curve.getLength() / 8)));
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    // Initialize positions along the curve with random phases
    for (let i = 0; i < particleCount; i++) {
      phases[i] = i / particleCount;
      const point = curve.getPointAt(phases[i]);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: color,
      size: 1.2 + volume * 1.5,
      map: this._flowTexture,
      transparent: true,
      opacity: 0.5 + volume * 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    // Store reference for animation
    group.userData._flowParticles = {
      particles,
      phases,
      particleCount,
      speed: 0.15 + volume * 0.25
    };
  }

  /**
   * Update flow particles — move them along the curve
   */
  _updateFlowParticles(flowData, curve, elapsed, volume) {
    const { particles, phases, particleCount, speed } = flowData;
    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      // Move particle along curve
      const t = (phases[i] + elapsed * speed) % 1.0;
      const point = curve.getPointAt(Math.max(0.001, Math.min(0.999, t)));
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    // Pulse particle size
    particles.material.size = (1.0 + volume * 1.5) + Math.sin(elapsed * 3) * 0.3;
  }

  /**
   * Build an orthogonal path from A to B using Manhattan routing.
   */
  _buildOrthogonalPath(from, to, edgeIndex = 0, totalEdges = 1) {
    const cornerRadius = 4;
    const riseHeight = 12 + edgeIndex * 3;
    const steps = 5;

    const runY = Math.max(from.y, to.y) + riseHeight;

    const spreadRange = Math.max(totalEdges - 1, 0) * 3;
    const lateralOffset = totalEdges > 1 ? (edgeIndex / (totalEdges - 1) - 0.5) * spreadRange : 0;

    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const mainAxis = Math.abs(dx) >= Math.abs(dz) ? 'x' : 'z';

    const points = [];

    points.push(from.clone());

    const riseEnd = new THREE.Vector3(from.x, runY, from.z);
    this._addRoundedCorner(points, from.clone(), riseEnd, cornerRadius, steps);

    let horizStart, horizEnd;
    if (mainAxis === 'x') {
      horizStart = new THREE.Vector3(from.x, runY, from.z + lateralOffset);
      horizEnd = new THREE.Vector3(to.x, runY, to.z + lateralOffset);
    } else {
      horizStart = new THREE.Vector3(from.x + lateralOffset, runY, from.z);
      horizEnd = new THREE.Vector3(to.x + lateralOffset, runY, to.z);
    }

    this._addRoundedCorner(points, riseEnd, horizStart, cornerRadius, steps);
    points.push(horizStart.clone());
    points.push(horizEnd.clone());

    const dropStart = new THREE.Vector3(to.x, runY, to.z);
    this._addRoundedCorner(points, horizEnd, dropStart, cornerRadius, steps);
    this._addRoundedCorner(points, dropStart, to.clone(), cornerRadius, steps);
    points.push(to.clone());

    return points;
  }

  _addRoundedCorner(points, from, to, radius, steps) {
    const dist = from.distanceTo(to);
    const r = Math.min(radius, dist * 0.4);
    
    if (r < 0.5 || dist < 1) {
      points.push(to.clone());
      return;
    }

    points.push(to.clone());
  }
}
