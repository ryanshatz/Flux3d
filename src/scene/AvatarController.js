/**
 * AvatarController — 3rd person character with detailed walk animation
 * A holographic data-entity that walks around the IVR map at ground level
 */
import * as THREE from 'three';

export class AvatarController {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Movement state
    this.position = new THREE.Vector3(0, 0, 80);
    this.velocity = new THREE.Vector3();
    this.rotation = 0; // Face toward -Z (into the scene)
    this.moveSpeed = 40;
    this.rotSpeed = 2.2;
    this.isMoving = false;

    // Camera follow
    this.cameraOffset = new THREE.Vector3(0, 14, 28);
    this.cameraLookAhead = 8;
    this.cameraSmoothness = 4;
    this.bobEnabled = true;

    // Camera bob
    this.bobTime = 0;
    this.bobFrequency = 7;
    this.bobAmplitudeY = 0.35;
    this.bobAmplitudeX = 0.12;

    // Idle
    this.idleBobFreq = 1.2;
    this.idleBobAmp = 0.08;

    // Keys
    this.keys = { forward: false, backward: false, left: false, right: false, sprint: false };

    // Build
    this.avatarGroup = new THREE.Group();
    this._buildAvatar();
    this.avatarGroup.position.copy(this.position);
    scene.add(this.avatarGroup);

    this.walkTime = 0;
    this._bindControls();

    // Initialize camera position IMMEDIATELY (no lerp snap)
    const initOffset = this.cameraOffset.clone().applyAxisAngle(
      new THREE.Vector3(0, 1, 0), this.rotation
    );
    this.camera.position.copy(this.position.clone().add(initOffset));
    this._currentLookTarget = this.position.clone().add(
      new THREE.Vector3(-Math.sin(this.rotation), 3, -Math.cos(this.rotation))
        .multiplyScalar(this.cameraLookAhead)
    );
    this._currentLookTarget.y = this.position.y + 4;
    this.camera.lookAt(this._currentLookTarget);
  }

  _buildAvatar() {
    // === Detailed Holographic Data-Entity ===
    // Mesh wrapper rotated π so the visor (face at +Z) points -Z in model space
    // This ensures the camera (at +Z offset) sees the avatar's back
    this._meshWrapper = new THREE.Group();
    this._meshWrapper.rotation.y = Math.PI;
    this.avatarGroup.add(this._meshWrapper);
    
    // --- TORSO (two-part) ---
    const torsoGeo = new THREE.CylinderGeometry(0.9, 0.7, 2.2, 8);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ee, emissive: 0x0099bb, emissiveIntensity: 0.5,
      metalness: 0.85, roughness: 0.15, transparent: true, opacity: 0.75
    });
    this.torso = new THREE.Mesh(torsoGeo, torsoMat);
    this.torso.position.y = 4.5;
    this._meshWrapper.add(this.torso);

    // Upper torso / shoulders
    const shoulderGeo = new THREE.CylinderGeometry(1.1, 0.9, 0.8, 8);
    const shoulderMat = torsoMat.clone();
    shoulderMat.emissiveIntensity = 0.6;
    this.shoulders = new THREE.Mesh(shoulderGeo, shoulderMat);
    this.shoulders.position.y = 5.9;
    this._meshWrapper.add(this.shoulders);

    // Torso wireframe overlay
    const torsoWireGeo = new THREE.CylinderGeometry(1.0, 0.8, 2.4, 8);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.15
    });
    const torsoWire = new THREE.Mesh(torsoWireGeo, wireMat);
    torsoWire.position.y = 4.5;
    this._meshWrapper.add(torsoWire);

    // --- HEAD ---
    const headGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc, emissive: 0x00ddbb, emissiveIntensity: 0.7,
      metalness: 0.7, roughness: 0.15, transparent: true, opacity: 0.85
    });
    this.head = new THREE.Mesh(headGeo, headMat);
    this.head.position.y = 7.2;
    this._meshWrapper.add(this.head);

    // Visor
    const visorGeo = new THREE.BoxGeometry(1.6, 0.22, 0.45);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x00e5ff, emissiveIntensity: 2.5,
      transparent: true, opacity: 0.9
    });
    this.visor = new THREE.Mesh(visorGeo, visorMat);
    this.visor.position.set(0, 7.2, 0.6);
    this._meshWrapper.add(this.visor);

    // Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 4);
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff, emissive: 0x00e5ff, emissiveIntensity: 1
    });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(0, 8.2, 0);
    this._meshWrapper.add(antenna);

    // Antenna tip (glowing orb)
    const tipGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 2
    });
    this.antennaTip = new THREE.Mesh(tipGeo, tipMat);
    this.antennaTip.position.set(0, 8.7, 0);
    this._meshWrapper.add(this.antennaTip);

    // --- ARMS (with upper + lower segments) ---
    const upperArmGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.4, 6);
    const armMat = new THREE.MeshStandardMaterial({
      color: 0x00bbdd, emissive: 0x0088aa, emissiveIntensity: 0.4,
      transparent: true, opacity: 0.65
    });

    // Left shoulder pivot
    this.leftArmPivot = new THREE.Group();
    this.leftArmPivot.position.set(-1.2, 5.8, 0);
    this._meshWrapper.add(this.leftArmPivot);

    this.leftUpperArm = new THREE.Mesh(upperArmGeo, armMat);
    this.leftUpperArm.position.y = -0.7;
    this.leftArmPivot.add(this.leftUpperArm);

    // Left forearm pivot (attached to upper arm)
    const forearmGeo = new THREE.CylinderGeometry(0.14, 0.1, 1.2, 6);
    this.leftForearmPivot = new THREE.Group();
    this.leftForearmPivot.position.y = -1.4;
    this.leftArmPivot.add(this.leftForearmPivot);

    this.leftForearm = new THREE.Mesh(forearmGeo, armMat.clone());
    this.leftForearm.position.y = -0.6;
    this.leftForearmPivot.add(this.leftForearm);

    // Left hand
    const handGeo = new THREE.SphereGeometry(0.14, 6, 6);
    const handMat = new THREE.MeshStandardMaterial({
      color: 0x00ddff, emissive: 0x00bbdd, emissiveIntensity: 0.5
    });
    this.leftHand = new THREE.Mesh(handGeo, handMat);
    this.leftHand.position.y = -1.2;
    this.leftForearmPivot.add(this.leftHand);

    // Right shoulder pivot
    this.rightArmPivot = new THREE.Group();
    this.rightArmPivot.position.set(1.2, 5.8, 0);
    this._meshWrapper.add(this.rightArmPivot);

    this.rightUpperArm = new THREE.Mesh(upperArmGeo, armMat.clone());
    this.rightUpperArm.position.y = -0.7;
    this.rightArmPivot.add(this.rightUpperArm);

    this.rightForearmPivot = new THREE.Group();
    this.rightForearmPivot.position.y = -1.4;
    this.rightArmPivot.add(this.rightForearmPivot);

    this.rightForearm = new THREE.Mesh(forearmGeo, armMat.clone());
    this.rightForearm.position.y = -0.6;
    this.rightForearmPivot.add(this.rightForearm);

    this.rightHand = new THREE.Mesh(handGeo, handMat.clone());
    this.rightHand.position.y = -1.2;
    this.rightForearmPivot.add(this.rightHand);

    // --- LEGS (with upper + lower segments) ---
    const upperLegGeo = new THREE.CylinderGeometry(0.24, 0.2, 1.5, 6);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x0099cc, emissive: 0x006688, emissiveIntensity: 0.35,
      transparent: true, opacity: 0.65
    });

    // Left hip pivot
    this.leftLegPivot = new THREE.Group();
    this.leftLegPivot.position.set(-0.35, 3.3, 0);
    this._meshWrapper.add(this.leftLegPivot);

    this.leftUpperLeg = new THREE.Mesh(upperLegGeo, legMat);
    this.leftUpperLeg.position.y = -0.75;
    this.leftLegPivot.add(this.leftUpperLeg);

    // Left knee pivot
    const lowerLegGeo = new THREE.CylinderGeometry(0.18, 0.12, 1.5, 6);
    this.leftKneePivot = new THREE.Group();
    this.leftKneePivot.position.y = -1.5;
    this.leftLegPivot.add(this.leftKneePivot);

    this.leftLowerLeg = new THREE.Mesh(lowerLegGeo, legMat.clone());
    this.leftLowerLeg.position.y = -0.75;
    this.leftKneePivot.add(this.leftLowerLeg);

    // Left foot
    const footGeo = new THREE.BoxGeometry(0.22, 0.12, 0.5);
    const footMat = new THREE.MeshStandardMaterial({
      color: 0x0088bb, emissive: 0x006699, emissiveIntensity: 0.3
    });
    this.leftFoot = new THREE.Mesh(footGeo, footMat);
    this.leftFoot.position.set(0, -1.55, 0.1);
    this.leftKneePivot.add(this.leftFoot);

    // Right hip pivot
    this.rightLegPivot = new THREE.Group();
    this.rightLegPivot.position.set(0.35, 3.3, 0);
    this._meshWrapper.add(this.rightLegPivot);

    this.rightUpperLeg = new THREE.Mesh(upperLegGeo, legMat.clone());
    this.rightUpperLeg.position.y = -0.75;
    this.rightLegPivot.add(this.rightUpperLeg);

    this.rightKneePivot = new THREE.Group();
    this.rightKneePivot.position.y = -1.5;
    this.rightLegPivot.add(this.rightKneePivot);

    this.rightLowerLeg = new THREE.Mesh(lowerLegGeo, legMat.clone());
    this.rightLowerLeg.position.y = -0.75;
    this.rightKneePivot.add(this.rightLowerLeg);

    this.rightFoot = new THREE.Mesh(footGeo, footMat.clone());
    this.rightFoot.position.set(0, -1.55, 0.1);
    this.rightKneePivot.add(this.rightFoot);

    // --- GROUND EFFECTS ---
    const discGeo = new THREE.CircleGeometry(2, 24);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff, transparent: true, opacity: 0.06, side: THREE.DoubleSide
    });
    this.groundDisc = new THREE.Mesh(discGeo, discMat);
    this.groundDisc.rotation.x = -Math.PI / 2;
    this.groundDisc.position.y = 0.05;
    this._meshWrapper.add(this.groundDisc);

    // Avatar glow light
    this.avatarLight = new THREE.PointLight(0x00d4ee, 1.5, 25);
    this.avatarLight.position.y = 5;
    this._meshWrapper.add(this.avatarLight);

    // Trail particles
    this._buildTrailParticles();
  }

  _buildTrailParticles() {
    const count = 20;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = Math.random() * 7;
      positions[i * 3 + 2] = 0;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x00e5ff, size: 0.5, transparent: true, opacity: 0.25,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    this.trailParticles = new THREE.Points(geo, mat);
    this.avatarGroup.add(this.trailParticles);
    this._trailData = { positions, count };
  }

  _bindControls() {
    this._onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') { this.keys.forward = true; e.preventDefault(); }
      if (k === 's' || k === 'arrowdown') { this.keys.backward = true; e.preventDefault(); }
      if (k === 'a' || k === 'arrowleft') { this.keys.left = true; e.preventDefault(); }
      if (k === 'd' || k === 'arrowright') { this.keys.right = true; e.preventDefault(); }
      if (k === 'shift') this.keys.sprint = true;
    };
    this._onKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.keys.forward = false;
      if (k === 's' || k === 'arrowdown') this.keys.backward = false;
      if (k === 'a' || k === 'arrowleft') this.keys.left = false;
      if (k === 'd' || k === 'arrowright') this.keys.right = false;
      if (k === 'shift') this.keys.sprint = false;
    };
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  enable() {
    this.avatarGroup.visible = true;
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  disable() {
    // Release all keys
    this.keys = { forward: false, backward: false, left: false, right: false, sprint: false };
  }

  update(delta, elapsed) {
    const speed = this.keys.sprint ? this.moveSpeed * 1.8 : this.moveSpeed;

    // Build movement direction from WASD — camera-relative
    const moveDir = new THREE.Vector3(0, 0, 0);

    // Auto-navigation toward clicked target
    if (this._navTarget) {
      const toTarget = new THREE.Vector3(this._navTarget.x - this.position.x, 0, this._navTarget.z - this.position.z);
      const dist = toTarget.length();
      if (dist < 3) {
        this._navTarget = null; // Arrived
      } else {
        toTarget.normalize();
        moveDir.copy(toTarget);
      }
    }

    // Camera-relative directions: W = forward from camera, A/D = strafe
    if (this.keys.forward || this.keys.backward || this.keys.left || this.keys.right) {
      this._navTarget = null;
      const camForward = new THREE.Vector3();
      this.camera.getWorldDirection(camForward);
      camForward.y = 0;
      camForward.normalize();

      const camRight = new THREE.Vector3();
      camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

      if (this.keys.forward) moveDir.add(camForward);
      if (this.keys.backward) moveDir.sub(camForward);
      if (this.keys.left) moveDir.sub(camRight);
      if (this.keys.right) moveDir.add(camRight);
    }

    this.isMoving = moveDir.lengthSq() > 0;

    if (this.isMoving) {
      moveDir.normalize();
      this.velocity.copy(moveDir).multiplyScalar(speed * delta);
      this.position.add(this.velocity);

      // Face movement direction — negate both args because Three.js model faces -Z at rotation=0
      const targetRotation = Math.atan2(-moveDir.x, -moveDir.z);
      // Smooth the rotation using short-way lerp
      let diff = targetRotation - this.rotation;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.rotation += diff * Math.min(10 * delta, 1);
    } else {
      this.velocity.set(0, 0, 0);
    }

    this.position.y = 0;
    this.avatarGroup.position.copy(this.position);
    this.avatarGroup.rotation.y = this.rotation;

    if (this.isMoving) {
      this.walkTime += delta * (this.keys.sprint ? 14 : 10);
      this._animateWalk(this.walkTime);
    } else {
      this.walkTime = 0;
      this._animateIdle(elapsed);
    }

    this._updateTrail(delta, elapsed);
    this._updateCamera(delta, elapsed);
  }

  _animateWalk(t) {
    const legSwing = Math.sin(t) * 0.55;
    const kneeFlick = Math.max(0, Math.sin(t + 0.5)) * 0.5;

    // Left leg: hip + knee
    this.leftLegPivot.rotation.x = legSwing;
    this.leftKneePivot.rotation.x = kneeFlick;

    // Right leg: opposite
    this.rightLegPivot.rotation.x = -legSwing;
    this.rightKneePivot.rotation.x = Math.max(0, Math.sin(-t + 0.5)) * 0.5;

    // Arms: opposite to legs, with elbow bend
    this.leftArmPivot.rotation.x = -legSwing * 0.6;
    this.leftForearmPivot.rotation.x = -Math.max(0, Math.sin(-t + 0.3)) * 0.4;

    this.rightArmPivot.rotation.x = legSwing * 0.6;
    this.rightForearmPivot.rotation.x = -Math.max(0, Math.sin(t + 0.3)) * 0.4;

    // Body bounce
    const bounce = Math.abs(Math.sin(t * 2)) * 0.15;
    this.torso.position.y = 4.5 + bounce;
    this.shoulders.position.y = 5.9 + bounce;
    this.head.position.y = 7.2 + bounce * 0.8;
    this.visor.position.y = 7.2 + bounce * 0.8;

    // Subtle body sway
    this.torso.rotation.z = Math.sin(t * 0.5) * 0.03;
    this.head.rotation.z = Math.sin(t * 0.5) * 0.04;
    this.head.rotation.y = 0;

    // Visor glow pulse
    this.visor.material.emissiveIntensity = 2.5 + Math.sin(t * 3) * 0.5;

    // Antenna tip flash
    this.antennaTip.material.emissiveIntensity = 1.5 + Math.sin(t * 5) * 1;
  }

  _animateIdle(elapsed) {
    const breathe = Math.sin(elapsed * this.idleBobFreq) * this.idleBobAmp;

    this.torso.position.y = 4.5 + breathe;
    this.shoulders.position.y = 5.9 + breathe * 0.9;
    this.head.position.y = 7.2 + breathe * 0.7;
    this.visor.position.y = 7.2 + breathe * 0.7;

    // Smoothly return limbs to rest
    this.leftLegPivot.rotation.x *= 0.92;
    this.rightLegPivot.rotation.x *= 0.92;
    this.leftKneePivot.rotation.x *= 0.92;
    this.rightKneePivot.rotation.x *= 0.92;
    this.leftArmPivot.rotation.x *= 0.92;
    this.rightArmPivot.rotation.x *= 0.92;
    this.leftForearmPivot.rotation.x *= 0.92;
    this.rightForearmPivot.rotation.x *= 0.92;

    // Gentle look-around
    this.head.rotation.y = Math.sin(elapsed * 0.3) * 0.08;
    this.head.rotation.z = 0;
    this.torso.rotation.z = 0;

    this.visor.material.emissiveIntensity = 1.8 + Math.sin(elapsed * 2) * 0.4;
    this.antennaTip.material.emissiveIntensity = 1 + Math.sin(elapsed * 1.5) * 0.5;
    this.groundDisc.material.opacity = 0.04 + Math.sin(elapsed * 2) * 0.025;
  }

  _updateTrail(delta, elapsed) {
    if (!this._trailData) return;
    const { positions, count } = this._trailData;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += delta * (0.8 + Math.random() * 0.5);
      positions[i * 3] += Math.sin(elapsed + i) * delta * 0.3;
      positions[i * 3 + 2] += Math.cos(elapsed + i) * delta * 0.2;
      if (positions[i * 3 + 1] > 10) {
        positions[i * 3] = (Math.random() - 0.5) * 1.5;
        positions[i * 3 + 1] = Math.random();
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      }
    }
    this.trailParticles.geometry.attributes.position.needsUpdate = true;
    this.trailParticles.material.opacity = this.isMoving ? 0.4 : 0.12;
  }

  _updateCamera(delta, elapsed) {
    const offsetRotated = this.cameraOffset.clone().applyAxisAngle(
      new THREE.Vector3(0, 1, 0), this.rotation
    );
    const desiredCamPos = this.position.clone().add(offsetRotated);

    let bobOffset = new THREE.Vector3(0, 0, 0);
    if (this.isMoving && this.bobEnabled) {
      this.bobTime += delta * this.bobFrequency * (this.keys.sprint ? 1.3 : 1);
      bobOffset.y = Math.sin(this.bobTime) * this.bobAmplitudeY;
      bobOffset.x = Math.sin(this.bobTime * 0.5) * this.bobAmplitudeX;
    } else {
      bobOffset.y = Math.sin(elapsed * this.idleBobFreq) * this.idleBobAmp * 0.3;
      this.bobTime = 0;
    }

    const smoothing = this.cameraSmoothness * delta;
    this.camera.position.lerp(desiredCamPos.add(bobOffset), Math.min(smoothing, 1));

    // Smooth look-target (lerp instead of snap)
    const desiredLookTarget = this.position.clone().add(
      new THREE.Vector3(-Math.sin(this.rotation), 3, -Math.cos(this.rotation))
        .multiplyScalar(this.cameraLookAhead)
    );
    desiredLookTarget.y = this.position.y + 4;

    if (!this._currentLookTarget) {
      this._currentLookTarget = desiredLookTarget.clone();
    }
    this._currentLookTarget.lerp(desiredLookTarget, Math.min(smoothing * 1.2, 1));
    this.camera.lookAt(this._currentLookTarget);
  }

  navigateTo(x, z) {
    // Auto-walk toward a target position
    this._navTarget = new THREE.Vector3(x, 0, z);
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.avatarGroup.position.copy(this.position);
  }

  dispose() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this.avatarGroup.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    });
    this.scene.remove(this.avatarGroup);
  }
}
