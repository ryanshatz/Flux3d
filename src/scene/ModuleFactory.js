/**
 * ModuleFactory — Creates premium 3D geometry for each Five9 module type
 * Every module sits on a glowing platform base with refined materials
 */
import * as THREE from 'three';

const MODULE_COLORS = {
  incomingCall: { main: 0x0099dd, emissive: 0x0088cc, accent: 0x00ccff },
  skillTransfer: { main: 0xdd8800, emissive: 0xcc7700, accent: 0xffaa33 },
  case: { main: 0xccaa00, emissive: 0xbb9900, accent: 0xffdd44 },
  hangup: { main: 0xcc2244, emissive: 0xbb1133, accent: 0xff4466 },
  play: { main: 0x8844cc, emissive: 0x7733bb, accent: 0xbb77ff },
  startOnHangup: { main: 0x667788, emissive: 0x556677, accent: 0x8899aa },
  voiceMailTransfer: { main: 0x3399cc, emissive: 0x2288bb, accent: 0x55bbee },
  thirdPartyTransfer: { main: 0xcc5588, emissive: 0xbb4477, accent: 0xee77aa },
  lookupCRMRecord: { main: 0x33aa77, emissive: 0x229966, accent: 0x55cc99 },
  crmUpdate: { main: 0x55bb55, emissive: 0x44aa44, accent: 0x77dd77 },
  agentTransfer: { main: 0xcc8822, emissive: 0xbb7711, accent: 0xeeaa44 },
  ifElse: { main: 0xbbaa33, emissive: 0xaa9922, accent: 0xddcc55 },
  setVariable: { main: 0x5577aa, emissive: 0x446699, accent: 0x7799cc },
  menu: { main: 0xaa55aa, emissive: 0x994499, accent: 0xcc77cc },
  input: { main: 0x6699aa, emissive: 0x558899, accent: 0x88bbcc },
  blockedCallerList: { main: 0xcc4466, emissive: 0xbb3355, accent: 0xee6688 }
};

export class ModuleFactory {
  create(mod, heatData) {
    const group = new THREE.Group();
    group.userData = {
      moduleId: mod.moduleId,
      moduleType: mod.moduleType
    };

    const colors = MODULE_COLORS[mod.moduleType] || MODULE_COLORS.startOnHangup;

    const isFriction = heatData?.frictionModules?.includes(mod.moduleId);
    const isSuccess = heatData?.successModules?.includes(mod.moduleId);

    let mainColor = colors.main;
    let emissiveColor = colors.emissive;
    let accentColor = colors.accent;
    if (isFriction) {
      mainColor = 0xdd1133; emissiveColor = 0xcc0022; accentColor = 0xff3355;
    } else if (isSuccess) {
      mainColor = 0x00cc66; emissiveColor = 0x00bb55; accentColor = 0x33ee88;
    }

    // Add platform base for every module
    this._createPlatform(group, mainColor, emissiveColor);

    switch (mod.moduleType) {
      case 'incomingCall':
        this._createPortal(group, mainColor, emissiveColor, accentColor);
        break;
      case 'skillTransfer':
      case 'agentTransfer':
        this._createTransferNode(group, mainColor, emissiveColor, accentColor, isFriction);
        break;
      case 'case':
      case 'ifElse':
        this._createDecisionNode(group, mainColor, emissiveColor, accentColor);
        break;
      case 'hangup':
        this._createTerminal(group, mainColor, emissiveColor, accentColor);
        break;
      case 'play':
        this._createSpeaker(group, mainColor, emissiveColor, accentColor);
        break;
      case 'startOnHangup':
        this._createMiniPortal(group, mainColor, emissiveColor);
        break;
      case 'voiceMailTransfer':
      case 'thirdPartyTransfer':
        this._createExternalNode(group, mainColor, emissiveColor, accentColor);
        break;
      case 'lookupCRMRecord':
      case 'crmUpdate':
        this._createDatabase(group, mainColor, emissiveColor, accentColor);
        break;
      case 'setVariable':
        this._createGear(group, mainColor, emissiveColor, accentColor);
        break;
      case 'blockedCallerList':
        this._createShield(group, mainColor, emissiveColor, accentColor);
        break;
      default:
        this._createDefault(group, mainColor, emissiveColor, accentColor);
    }

    return group;
  }

  _createPlatform(group, color, emissive) {
    // Circular glowing platform base
    const platGeo = new THREE.CylinderGeometry(5.5, 6, 0.4, 32);
    const platMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(emissive),
      emissiveIntensity: 0.15,
      metalness: 0.3,
      roughness: 0.7,
      transparent: true,
      opacity: 0.4
    });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.position.y = -0.2;
    group.add(plat);

    // Glowing ring around the platform edge
    const ringGeo = new THREE.TorusGeometry(5.7, 0.12, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.35
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0;
    group.add(ring);
  }

  _makeMaterial(color, emissive, emissiveIntensity = 0.35) {
    return new THREE.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity,
      metalness: 0.4,
      roughness: 0.35,
      transparent: true,
      opacity: 0.92
    });
  }

  _createPortal(group, color, emissive, accent) {
    // Outer torus ring
    const torusGeo = new THREE.TorusGeometry(4.5, 0.7, 20, 48);
    const torusMat = this._makeMaterial(color, emissive, 0.5);
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 2;
    torus.position.y = 4;
    torus.userData.isMainMesh = true;
    torus.userData.baseEmissive = 0.5;
    group.add(torus);

    // Inner glowing sphere
    const sphereGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: accent,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.45
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 4;
    group.add(sphere);

    // Vertical pillar from platform to torus
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.5, 3.5, 8);
    const pillarMat = this._makeMaterial(color, emissive, 0.2);
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 1.8;
    group.add(pillar);

    const light = new THREE.PointLight(accent, 1.5, 30);
    light.position.y = 4;
    group.add(light);
  }

  _createTransferNode(group, color, emissive, accent, isFriction) {
    // Main cylinder with industrial rings
    const cylGeo = new THREE.CylinderGeometry(2.5, 2.5, 7, 20);
    const cylMat = this._makeMaterial(color, emissive, isFriction ? 0.7 : 0.35);
    const cyl = new THREE.Mesh(cylGeo, cylMat);
    cyl.position.y = 4;
    cyl.userData.isMainMesh = true;
    cyl.userData.baseEmissive = isFriction ? 0.7 : 0.35;
    group.add(cyl);

    // Industrial ring flanges
    const ringGeo = new THREE.TorusGeometry(3, 0.25, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeff, metalness: 0.8, roughness: 0.15,
      transparent: true, opacity: 0.7
    });
    [1.5, 4, 6.5].forEach(y => {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    });

    // Arrow cap on top
    const capGeo = new THREE.ConeGeometry(2, 2.5, 12);
    const capMat = this._makeMaterial(accent, emissive, 0.6);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 8.5;
    group.add(cap);

    if (isFriction) {
      const light = new THREE.PointLight(0xff1133, 2, 35);
      light.position.y = 4;
      group.add(light);
    }
  }

  _createDecisionNode(group, color, emissive, accent) {
    // Diamond (octahedron rotated 45°)
    const octGeo = new THREE.OctahedronGeometry(4, 1);
    const octMat = this._makeMaterial(color, emissive, 0.4);
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.y = 5;
    oct.userData.isMainMesh = true;
    oct.userData.baseEmissive = 0.4;
    group.add(oct);

    // Wireframe overlay for tech look
    const wireGeo = new THREE.OctahedronGeometry(4.4, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: accent, wireframe: true,
      transparent: true, opacity: 0.2
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.y = 5;
    group.add(wire);

    // Vertical stem
    const stemGeo = new THREE.CylinderGeometry(0.25, 0.4, 2.5, 8);
    const stemMat = this._makeMaterial(color, emissive, 0.2);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 1.5;
    group.add(stem);

    const light = new THREE.PointLight(accent, 1, 25);
    light.position.y = 5;
    group.add(light);
  }

  _createTerminal(group, color, emissive, accent) {
    // Compact rounded box as end-point
    const boxGeo = new THREE.BoxGeometry(5, 3, 5, 2, 2, 2);
    const boxMat = this._makeMaterial(color, emissive, 0.3);
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 2;
    box.userData.isMainMesh = true;
    box.userData.baseEmissive = 0.3;
    group.add(box);

    // X cross on top
    const barGeo = new THREE.BoxGeometry(0.25, 3, 0.25);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: accent,
      emissiveIntensity: 0.8, transparent: true, opacity: 0.7
    });
    const bar1 = new THREE.Mesh(barGeo, barMat);
    bar1.rotation.z = Math.PI / 4;
    bar1.position.y = 4.5;
    group.add(bar1);

    const bar2 = new THREE.Mesh(barGeo, barMat);
    bar2.rotation.z = -Math.PI / 4;
    bar2.position.y = 4.5;
    group.add(bar2);
  }

  _createSpeaker(group, color, emissive, accent) {
    // Speaker cone pointing up
    const coneGeo = new THREE.ConeGeometry(3.5, 5, 20);
    const coneMat = this._makeMaterial(color, emissive, 0.4);
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.rotation.z = Math.PI;
    cone.position.y = 3;
    cone.userData.isMainMesh = true;
    cone.userData.baseEmissive = 0.4;
    group.add(cone);

    // Sound wave rings
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(1.8 + i * 1.2, 2 + i * 1.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: accent, transparent: true,
        opacity: 0.15 - i * 0.04, side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 6 + i * 1.2;
      group.add(ring);
    }
  }

  _createMiniPortal(group, color, emissive) {
    const torusGeo = new THREE.TorusGeometry(2.5, 0.45, 12, 32);
    const torusMat = this._makeMaterial(color, emissive, 0.2);
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 2;
    torus.position.y = 3;
    torus.userData.isMainMesh = true;
    torus.userData.baseEmissive = 0.2;
    group.add(torus);
  }

  _createExternalNode(group, color, emissive, accent) {
    // Sphere with outward arrow for external transfers
    const sphereGeo = new THREE.SphereGeometry(3.5, 24, 24);
    const mat = this._makeMaterial(color, emissive, 0.45);
    const sphere = new THREE.Mesh(sphereGeo, mat);
    sphere.position.y = 4.5;
    sphere.userData.isMainMesh = true;
    sphere.userData.baseEmissive = 0.45;
    group.add(sphere);

    // Arrow cap
    const arrowGeo = new THREE.ConeGeometry(1.2, 3, 8);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: accent,
      emissiveIntensity: 0.8, transparent: true, opacity: 0.7
    });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.position.y = 8.5;
    group.add(arrow);

    const light = new THREE.PointLight(accent, 0.8, 20);
    light.position.y = 4.5;
    group.add(light);
  }

  _createDatabase(group, color, emissive, accent) {
    // Stacked disks for CRM/database
    const diskGeo = new THREE.CylinderGeometry(3.5, 3.5, 1.2, 24);
    const mat = this._makeMaterial(color, emissive, 0.35);
    for (let i = 0; i < 3; i++) {
      const disk = new THREE.Mesh(diskGeo, mat.clone());
      disk.position.y = 1 + i * 1.8;
      if (i === 0) {
        disk.userData.isMainMesh = true;
        disk.userData.baseEmissive = 0.35;
      }
      group.add(disk);
    }

    // Glowing line between disks
    const lineGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.6, 8);
    const lineMat = new THREE.MeshBasicMaterial({
      color: accent, transparent: true, opacity: 0.3
    });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.y = 2.8;
    group.add(line);
  }

  _createGear(group, color, emissive, accent) {
    // Gear-shaped torus for setVariable
    const torusGeo = new THREE.TorusGeometry(3, 0.8, 8, 6);
    const mat = this._makeMaterial(color, emissive, 0.3);
    const torus = new THREE.Mesh(torusGeo, mat);
    torus.rotation.x = Math.PI / 2;
    torus.position.y = 3;
    torus.userData.isMainMesh = true;
    torus.userData.baseEmissive = 0.3;
    group.add(torus);

    const centerGeo = new THREE.SphereGeometry(1.3, 12, 12);
    const centerMat = this._makeMaterial(accent, emissive, 0.5);
    const center = new THREE.Mesh(centerGeo, centerMat);
    center.position.y = 3;
    group.add(center);
  }

  _createShield(group, color, emissive, accent) {
    // Shield shape for blocked caller list
    const boxGeo = new THREE.BoxGeometry(5, 5, 1.5, 2, 2, 1);
    const mat = this._makeMaterial(color, emissive, 0.4);
    const box = new THREE.Mesh(boxGeo, mat);
    box.position.y = 3.5;
    box.userData.isMainMesh = true;
    box.userData.baseEmissive = 0.4;
    group.add(box);

    // Red X cross
    const barGeo = new THREE.BoxGeometry(0.2, 3.5, 0.5);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: accent,
      emissiveIntensity: 0.9, transparent: true, opacity: 0.7
    });
    const bar1 = new THREE.Mesh(barGeo, barMat);
    bar1.rotation.z = Math.PI / 4;
    bar1.position.y = 3.5;
    bar1.position.z = 0.8;
    group.add(bar1);
    const bar2 = new THREE.Mesh(barGeo, barMat);
    bar2.rotation.z = -Math.PI / 4;
    bar2.position.y = 3.5;
    bar2.position.z = 0.8;
    group.add(bar2);
  }

  _createDefault(group, color, emissive, accent) {
    const geo = new THREE.IcosahedronGeometry(3.5, 1);
    const mat = this._makeMaterial(color, emissive, 0.3);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 4;
    mesh.userData.isMainMesh = true;
    mesh.userData.baseEmissive = 0.3;
    group.add(mesh);
  }
}
