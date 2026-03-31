/**
 * CableRenderer — Draws orthogonal 3D cables between modules
 * Uses Manhattan routing (90° turns) with smooth rounded corners
 * Directional arrows along the cable show flow direction
 */
import * as THREE from 'three';

export class CableRenderer {
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
      const glow = new THREE.Mesh(glowGeo, glowMat);
      group.add(glow);
    }

    // Directional arrows along the cable (replace flow particles)
    if (!dimMode) {
      this._createDirectionArrows(group, curve, cableColor, emissiveColor, baseRadius);
    }

    // Store update function for animation (subtle pulse only)
    group.userData.update = (elapsed) => {
      const pulse = Math.sin(elapsed * (2 + volume * 3)) * 0.1 + 0.6;
      tubeMat.emissiveIntensity = (0.4 + volume * 0.4) * pulse;
      if (isFriction) {
        tubeMat.emissiveIntensity = 0.6 + Math.sin(elapsed * 5) * 0.3;
      }
    };

    return group;
  }

  /**
   * Place arrow cones along the cable at regular intervals pointing in the flow direction
   */
  _createDirectionArrows(group, curve, color, emissive, tubeRadius) {
    const curveLength = curve.getLength();
    // Place arrows every ~15 units, with min 1 and max 8
    const arrowCount = Math.max(1, Math.min(8, Math.floor(curveLength / 15)));
    const arrowSize = tubeRadius * 2.5;

    const arrowGeo = new THREE.ConeGeometry(arrowSize, arrowSize * 3, 6);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: color,
      emissive: emissive,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.3
    });

    for (let i = 0; i < arrowCount; i++) {
      // Distribute arrows evenly along the cable (skip first 10% and last 5%)
      const t = 0.1 + (i / arrowCount) * 0.85;
      const pos = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();

      const arrow = new THREE.Mesh(arrowGeo, arrowMat);
      arrow.position.copy(pos);

      // Orient cone along tangent direction
      const up = new THREE.Vector3(0, 1, 0);
      const quat = new THREE.Quaternion().setFromUnitVectors(up, tangent);
      arrow.quaternion.copy(quat);
      group.add(arrow);
    }
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
