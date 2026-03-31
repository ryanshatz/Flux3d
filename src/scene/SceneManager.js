/**
 * SceneManager — Three.js scene orchestrator for Flux3D
 * Now features 3rd-person avatar controller, animated heat map overlay, and improved visuals
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { ModuleFactory } from './ModuleFactory.js';
import { CableRenderer } from './CableRenderer.js';
import { ParticleSystem } from './ParticleSystem.js';
import { AvatarController } from './AvatarController.js';
import { MiniMap } from '../ui/MiniMap.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.modules3D = {};
    this.moduleData = {};
    this.cables = [];
    this.aniNodes = [];
    this.aniCables = [];
    this.labelsVisible = true;
    this.heatMapActive = true;
    this.aniExpansionEnabled = false;
    this.onModuleClick = null;

    // Mode: 'orbit' or 'thirdPerson'
    this.controlMode = 'thirdPerson';
    this.avatar = null;

    // Heat map transition state
    this._heatTransition = { active: false, progress: 0, direction: 1, duration: 0.6 };

    // Store current parse/heat data for rebuilds
    this._currentParsedData = null;
    this._currentHeatData = null;

    // Smooth hover animation state
    this._hoverTargets = {}; // moduleId -> { scale: target, glow: target }
    this._hoverCurrent = {}; // moduleId -> { scale: current, glow: current }
    this._hoveredModule = null;
    this._selectedModule = null;

    // Tooltip element
    this._tooltip = null;

    // Traced path modules (for path highlighting)
    this._tracedPath = new Set();

    // Ground pulse rings
    this._pulseRings = [];

    this._init();
  }

  _init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1117);

    // Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 5000);
    this.camera.position.set(0, 30, 120);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // CSS2D Renderer for labels
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.left = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.container.appendChild(this.labelRenderer.domElement);

    // OrbitControls (used as fallback / free-look mode, disabled when in 3rd person)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 15;
    this.controls.maxDistance = 1500;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    this.controls.enabled = false; // Disabled — 3rd person is default

    // Post-processing
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
      0.45,
      0.4,
      0.85
    );
    this.composer.addPass(this.bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    // Lighting
    this._setupLights();

    // Grid floor
    this._createGrid();

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.renderer.domElement.addEventListener('click', (e) => this._onMouseClick(e));
    this.renderer.domElement.addEventListener('mousemove', (e) => this._onMouseMove(e));
    this.renderer.domElement.addEventListener('dblclick', (e) => this._onDoubleClick(e));

    // Create tooltip element
    this._tooltip = document.createElement('div');
    this._tooltip.className = 'module-tooltip';
    this._tooltip.style.display = 'none';
    document.body.appendChild(this._tooltip);

    // Tab key to toggle between orbit and 3rd person
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        this.toggleControlMode();
      }
    });

    // Mouse wheel to adjust camera distance in 3rd person
    this.renderer.domElement.addEventListener('wheel', (e) => {
      if (this.controlMode === 'thirdPerson' && this.avatar) {
        const zoomSpeed = 2;
        this.avatar.cameraOffset.z = Math.max(15, Math.min(150, this.avatar.cameraOffset.z + e.deltaY * 0.05 * zoomSpeed));
        this.avatar.cameraOffset.y = Math.max(8, Math.min(80, this.avatar.cameraOffset.y + e.deltaY * 0.02 * zoomSpeed));
      }
    });


    // Resize
    window.addEventListener('resize', () => this._onResize());

    // Module factory
    this.moduleFactory = new ModuleFactory();
    this.cableRenderer = new CableRenderer();
    this.particleSystem = new ParticleSystem(this.scene);
    this.miniMap = new MiniMap(this.container);

    // Clock
    this.clock = new THREE.Clock();

    // Create avatar
    this.avatar = new AvatarController(this.scene, this.camera);

    // Start loop
    this._animate();
  }

  toggleControlMode() {
    if (this.controlMode === 'thirdPerson') {
      // Switch to orbit/freecam
      this.controlMode = 'orbit';
      this.controls.enabled = true;
      this.controls.target.copy(this.avatar.position);
      this.controls.target.y = 5;
      if (this.avatar) {
        this.avatar.disable();
        this.avatar.avatarGroup.visible = true;
      }
    } else {
      // Switch back to 3rd person
      this.controlMode = 'thirdPerson';
      this.controls.enabled = false;
      if (this.avatar) {
        this.avatar.enable();
        this.avatar.avatarGroup.visible = true;
      }
    }
  }

  _setupLights() {
    // Soft ambient — let emissives shine
    const ambient = new THREE.AmbientLight(0x334466, 0.6);
    this.scene.add(ambient);

    // Cool moonlight key light
    const key = new THREE.DirectionalLight(0x8899cc, 1.0);
    key.position.set(50, 120, 50);
    key.castShadow = true;
    this.scene.add(key);

    // Subtle warm fill
    const fill = new THREE.DirectionalLight(0x554433, 0.3);
    fill.position.set(-50, 60, -30);
    this.scene.add(fill);

    // Cyan accent light
    const p1 = new THREE.PointLight(0x0088ff, 1.2, 400);
    p1.position.set(-80, 30, 0);
    this.scene.add(p1);

    // Purple accent light
    const p2 = new THREE.PointLight(0x6644cc, 0.8, 350);
    p2.position.set(80, 50, -40);
    this.scene.add(p2);

    // Hemisphere: dark sky, dark ground
    const hemiLight = new THREE.HemisphereLight(0x223355, 0x111122, 0.5);
    this.scene.add(hemiLight);
  }

  _createGrid() {
    const gridSize = 800;

    // — Gradient Skybox (deep navy → dark charcoal) —
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 2;
    skyCanvas.height = 512;
    const skyCtx = skyCanvas.getContext('2d');
    const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, '#0a0e1a');
    skyGrad.addColorStop(0.3, '#0f1525');
    skyGrad.addColorStop(0.6, '#141a2a');
    skyGrad.addColorStop(1, '#1a1e2e');
    skyCtx.fillStyle = skyGrad;
    skyCtx.fillRect(0, 0, 2, 512);
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    skyTexture.needsUpdate = true;
    this.scene.background = skyTexture;

    // — Subtle grid helper (very dim) —
    const divisions = 50;
    const gridHelper = new THREE.GridHelper(gridSize, divisions, 0x1a2233, 0x151c28);
    gridHelper.position.y = -2;
    gridHelper.material.opacity = 0.5;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);

    // — Dark hex circuit-board ground —
    const groundCanvas = document.createElement('canvas');
    groundCanvas.width = 1024;
    groundCanvas.height = 1024;
    const gCtx = groundCanvas.getContext('2d');

    // Dark base fill
    gCtx.fillStyle = '#111820';
    gCtx.fillRect(0, 0, 1024, 1024);

    // Cyan hex pattern
    gCtx.strokeStyle = 'rgba(0, 136, 204, 0.12)';
    gCtx.lineWidth = 1;
    const hexSize = 30;
    const hexH = hexSize * Math.sqrt(3);
    for (let row = -1; row < 1024 / hexH + 1; row++) {
      for (let col = -1; col < 1024 / (hexSize * 1.5) + 1; col++) {
        const cx = col * hexSize * 1.5;
        const cy = row * hexH + (col % 2 ? hexH / 2 : 0);
        gCtx.beginPath();
        for (let k = 0; k < 6; k++) {
          const angle = Math.PI / 3 * k - Math.PI / 6;
          const hx = cx + hexSize * 0.9 * Math.cos(angle);
          const hy = cy + hexSize * 0.9 * Math.sin(angle);
          k === 0 ? gCtx.moveTo(hx, hy) : gCtx.lineTo(hx, hy);
        }
        gCtx.closePath();
        gCtx.stroke();
      }
    }

    // Subtle dot grid at hex centers
    gCtx.fillStyle = 'rgba(0, 136, 204, 0.08)';
    for (let row = -1; row < 1024 / hexH + 1; row++) {
      for (let col = -1; col < 1024 / (hexSize * 1.5) + 1; col++) {
        const cx = col * hexSize * 1.5;
        const cy = row * hexH + (col % 2 ? hexH / 2 : 0);
        gCtx.beginPath();
        gCtx.arc(cx, cy, 1.5, 0, Math.PI * 2);
        gCtx.fill();
      }
    }

    const groundTexture = new THREE.CanvasTexture(groundCanvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(12, 12);
    groundTexture.needsUpdate = true;

    const groundGeo = new THREE.PlaneGeometry(gridSize, gridSize);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: 0.85,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.1;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // — Horizon fade ring (dark edge) —
    const horizonGeo = new THREE.RingGeometry(gridSize * 0.35, gridSize * 0.55, 64);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x0d1117,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    horizon.rotation.x = -Math.PI / 2;
    horizon.position.y = -1.9;
    this.scene.add(horizon);

    // — Animated pulse rings on the ground —
    this._pulseRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(15 + i * 25, 16 + i * 25, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0088cc,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.85;
      ring.userData.pulsePhase = i * (Math.PI * 2 / 3);
      ring.userData.baseRadius = 15 + i * 25;
      this.scene.add(ring);
      this._pulseRings.push(ring);
    }
  }

  // ═══ Graph Building ═══

  buildGraph(parsedData, heatData) {
    this._clearScene();
    this._currentParsedData = parsedData;
    this._currentHeatData = heatData;

    const { modules, edges, moduleMap } = parsedData;
    this.moduleData = moduleMap;

    const coords = modules.map(m => ({ x: m.locationX, y: m.locationY }));
    const minX = Math.min(...coords.map(c => c.x));
    const maxX = Math.max(...coords.map(c => c.x));
    const minY = Math.min(...coords.map(c => c.y));
    const maxY = Math.max(...coords.map(c => c.y));
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;
    const scale = 140;

    modules.forEach((mod, idx) => {
      const normX = ((mod.locationX - minX) / rangeX - 0.5) * scale;
      const normZ = ((mod.locationY - minY) / rangeY - 0.5) * scale;

      // All modules at ground level — walkable
      let height = 5;
      if (mod.flow === 'onHangup') height = 12; // Slightly raised for on-hangup flow

      const obj = this.moduleFactory.create(mod, heatData);
      obj.position.set(normX, height, normZ);
      obj.userData = {
        moduleId: mod.moduleId,
        moduleType: mod.moduleType,
        baseY: height,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.8 + Math.random() * 0.6,
        floatAmp: 0.06 + Math.random() * 0.06,
        moduleName: mod.moduleName
      };

      // — Drop shadow beneath module —
      this._addDropShadow(obj, normX, normZ);

      // — Entrance animation: start from 0, spring to 0.65 —
      obj.scale.setScalar(0);
      this.scene.add(obj);
      this.modules3D[mod.moduleId] = obj;

      // Initialize hover animation state
      this._hoverTargets[mod.moduleId] = { scale: 0.65, glow: 0 };
      this._hoverCurrent[mod.moduleId] = { scale: 0, glow: 0 };

      const delay = idx * 40;
      const targetScale = 0.65;
      const startTime = performance.now() + delay;
      const duration = 400;

      const animateIn = () => {
        const elapsed = performance.now() - startTime;
        if (elapsed < 0) { requestAnimationFrame(animateIn); return; }
        const t = Math.min(elapsed / duration, 1);
        // Spring easing
        const spring = 1 - Math.pow(1 - t, 3) * Math.cos(t * Math.PI * 1.2);
        const s = targetScale * Math.min(spring, 1);
        obj.scale.setScalar(s);
        this._hoverCurrent[mod.moduleId].scale = s;
        if (t < 1) requestAnimationFrame(animateIn);
      };
      requestAnimationFrame(animateIn);

      this._addLabel(obj, mod);

      // Add "START HERE" marker for IncomingCall modules
      if (mod.moduleType === 'incomingCall') {
        this._addStartHereMarker(obj.position);
      }
    });

    // Count edges per source node for staggering cables
    const edgeCountBySource = {};
    const edgeIndexBySource = {};
    edges.forEach(edge => {
      edgeCountBySource[edge.from] = (edgeCountBySource[edge.from] || 0) + 1;
    });

    // Create cables — visually distinct based on heat data
    edges.forEach(edge => {
      const fromObj = this.modules3D[edge.from];
      const toObj = this.modules3D[edge.to];
      if (fromObj && toObj) {
        const edgeKey = `${edge.from}->${edge.to}`;
        const hasHeat = heatData != null;
        const volume = hasHeat ? (heatData.edgeVolumes?.[edgeKey] || 1000) / (heatData.maxVolume || 10000) : 0.3;
        const isFriction = hasHeat && (heatData.frictionModules?.includes(edge.to) || false);
        const isSuccess = hasHeat && (heatData.successModules?.includes(edge.to) || false);

        // Get edge index for staggering
        const srcId = edge.from;
        const idx = edgeIndexBySource[srcId] || 0;
        edgeIndexBySource[srcId] = idx + 1;
        const totalFromSrc = edgeCountBySource[srcId] || 1;

        const cable = this.cableRenderer.create(
          fromObj.position,
          toObj.position,
          {
            type: edge.type,
            volume: hasHeat ? volume : 0.15,
            isFriction: hasHeat ? isFriction : false,
            isSuccess: hasHeat ? isSuccess : false,
            label: edge.label,
            dimMode: !hasHeat,
            edgeIndex: idx,
            totalEdges: totalFromSrc
          }
        );
        this.scene.add(cable);
        cable.userData.fromId = edge.from;
        cable.userData.toId = edge.to;
        this.cables.push(cable);
      }
    });

    // Position avatar near the first module
    if (this.avatar && modules.length > 0) {
      const firstMod = this.modules3D[modules[0].moduleId];
      if (firstMod) {
        this.avatar.setPosition(firstMod.position.x, 0, firstMod.position.z + 25);
      }
    }

    this._flyToOverview();

    // Update MiniMap with module positions
    if (this.miniMap) {
      this.miniMap.setModules(this.modules3D, this.moduleData);
    }
  }

  _addLabel(obj, mod) {
    const div = document.createElement('div');
    div.className = `module-label ${mod.moduleType === 'incomingCall' ? 'incoming-label' :
      mod.moduleType === 'skillTransfer' ? 'skill-label' :
      mod.moduleType === 'case' || mod.moduleType === 'ifElse' ? 'case-label' :
      mod.moduleType === 'hangup' ? 'hangup-label' :
      mod.moduleType === 'play' ? 'play-label' :
      mod.moduleType === 'thirdPartyTransfer' ? 'transfer-label' :
      mod.moduleType === 'voiceMailTransfer' ? 'transfer-label' :
      mod.moduleType === 'agentTransfer' ? 'skill-label' :
      mod.moduleType === 'lookupCRMRecord' || mod.moduleType === 'crmUpdate' ? 'crm-label' :
      mod.moduleType === 'setVariable' ? 'var-label' : ''}`;
    div.textContent = mod.moduleName;

    const label = new CSS2DObject(div);
    label.position.set(0, 8, 0);
    obj.add(label);
    label.layers.set(0);
  }

  _addDropShadow(obj, x, z) {
    // Create soft circular shadow texture
    if (!this._shadowTexture) {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.12)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.06)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      this._shadowTexture = new THREE.CanvasTexture(c);
      this._shadowTexture.needsUpdate = true;
    }

    const shadowMat = new THREE.SpriteMaterial({
      map: this._shadowTexture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
    });
    const shadow = new THREE.Sprite(shadowMat);
    shadow.scale.set(12, 12, 1);
    shadow.position.set(x, -1.8, z);
    shadow.material.rotation = 0;
    // Flatten the sprite onto the ground by using a plane instead
    const planeGeo = new THREE.PlaneGeometry(12, 12);
    const planeMat = new THREE.MeshBasicMaterial({
      map: this._shadowTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const shadowPlane = new THREE.Mesh(planeGeo, planeMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(x, -1.8, z);
    this.scene.add(shadowPlane);
  }

  _addStartHereMarker(worldPos) {
    const wx = worldPos.x;
    const wy = worldPos.y;
    const wz = worldPos.z;

    // Pulsing ground ring — added directly to scene
    const ringGeo = new THREE.RingGeometry(6, 7.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x0088cc,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(wx, wy - 4, wz);
    this.scene.add(ring);

    // Second ring for depth
    const ring2Geo = new THREE.RingGeometry(8.5, 9.5, 32);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x0088cc,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.set(wx, wy - 4, wz);
    this.scene.add(ring2);

    // Vertical beam
    const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 16, 8);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x0088cc,
      transparent: true,
      opacity: 0.25
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(wx, wy + 4, wz);
    this.scene.add(beam);

    // Billboard Sprite label "▶ START HERE" — uses canvas texture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;

    // Draw rounded rect background
    ctx.fillStyle = 'rgba(0, 136, 204, 0.15)';
    ctx.strokeStyle = 'rgba(0, 136, 204, 0.6)';
    ctx.lineWidth = 4;
    const rx = 20, ry = 20, rw = 472, rh = 88;
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 30);
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.font = 'bold 42px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0077bb';
    ctx.fillText('▶  START HERE', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      sizeAttenuation: true
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(16, 4, 1);
    sprite.position.set(wx, wy + 12, wz);
    this.scene.add(sprite);

    // Store for cleanup
    this._startHereObjects = [ring, ring2, beam, sprite];

    // Animate rings + sprite pulse
    const animate = () => {
      const t = performance.now() * 0.001;
      ring.material.opacity = 0.3 + Math.sin(t * 2) * 0.2;
      ring2.material.opacity = 0.15 + Math.sin(t * 2 + 1) * 0.1;
      ring.scale.setScalar(1 + Math.sin(t * 1.5) * 0.08);
      ring2.scale.setScalar(1 + Math.sin(t * 1.5 + 0.5) * 0.06);
      beam.material.opacity = 0.15 + Math.sin(t * 3) * 0.1;
      sprite.material.opacity = 0.85 + Math.sin(t * 2) * 0.15;
      requestAnimationFrame(animate);
    };
    animate();
  }

  _flyToOverview() {
    const positions = Object.values(this.modules3D).map(o => o.position);
    if (positions.length === 0) return;

    const center = new THREE.Vector3();
    positions.forEach(p => center.add(p));
    center.divideScalar(positions.length);

    if (this.controlMode === 'thirdPerson' && this.avatar) {
      this.avatar.setPosition(center.x, 0, center.z + 50);
    } else {
      const targetPos = new THREE.Vector3(center.x + 80, center.y + 100, center.z + 160);
      const startPos = this.camera.position.clone();
      const startTarget = this.controls.target.clone();
      const duration = 2000;
      const startTime = Date.now();

      const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        this.camera.position.lerpVectors(startPos, targetPos, ease);
        this.controls.target.lerpVectors(startTarget, center, ease);
        this.controls.update();
        if (t < 1) requestAnimationFrame(animateCamera);
      };
      animateCamera();
    }
  }

  _clearScene() {
    // Remove all module 3D objects and their CSS2D label DOM elements
    Object.values(this.modules3D).forEach(obj => {
      obj.traverse(child => {
        // CSS2DObject labels inject real DOM elements — must remove them
        if (child.isCSS2DObject && child.element && child.element.parentNode) {
          child.element.parentNode.removeChild(child.element);
        }
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
      this.scene.remove(obj);
    });
    this.cables.forEach(cable => {
      this.scene.remove(cable);
      cable.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    });
    this.modules3D = {};
    this.cables = [];
    this._clearANIExpansion();

    // Clean up START HERE markers
    if (this._startHereObjects) {
      this._startHereObjects.forEach(obj => {
        if (obj.isCSS2DObject && obj.element && obj.element.parentNode) {
          obj.element.parentNode.removeChild(obj.element);
        }
        this.scene.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      this._startHereObjects = null;
    }
  }

  // ═══ Raycasting ═══

  _onMouseClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshes = [];
    Object.values(this.modules3D).forEach(obj => {
      obj.traverse(child => { if (child.isMesh) meshes.push(child); });
    });

    const intersects = this.raycaster.intersectObjects(meshes, false);
    if (intersects.length > 0) {
      let target = intersects[0].object;
      while (target && !target.userData.moduleId) target = target.parent;
      if (target?.userData.moduleId) {
        this._selectedModule = target.userData.moduleId;
        // Click-to-navigate: walk avatar to clicked module
        if (this.controlMode === 'thirdPerson' && this.avatar) {
          const targetObj = this.modules3D[target.userData.moduleId];
          if (targetObj) {
            this.avatar.navigateTo(targetObj.position.x, targetObj.position.z);
          }
        }
        if (this.onModuleClick) {
          this.onModuleClick(target.userData.moduleId);
        }
        this._highlightModule(target.userData.moduleId);
        // Trace and highlight the full path through this module
        this._tracePath(target.userData.moduleId);
      }
    } else {
      // Click on empty space — clear selection and path
      this._selectedModule = null;
      this._tracedPath.clear();
      this._resetAllCableOpacity();
    }
  }

  _onDoubleClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const meshes = [];
    Object.values(this.modules3D).forEach(obj => {
      obj.traverse(child => { if (child.isMesh) meshes.push(child); });
    });

    const intersects = this.raycaster.intersectObjects(meshes, false);
    if (intersects.length > 0) {
      let target = intersects[0].object;
      while (target && !target.userData.moduleId) target = target.parent;
      if (target?.userData.moduleId) {
        const targetObj = this.modules3D[target.userData.moduleId];
        if (targetObj) {
          if (this.controlMode === 'thirdPerson' && this.avatar) {
            // Teleport avatar near the module
            this.avatar.setPosition(targetObj.position.x, 0, targetObj.position.z + 15);
          } else {
            // Fly camera to the module
            this._flyToModule(targetObj.position);
          }
        }
      }
    }
  }

  _flyToModule(targetPos) {
    const startPos = this.camera.position.clone();
    const endPos = new THREE.Vector3(targetPos.x + 20, targetPos.y + 25, targetPos.z + 35);
    const startTarget = this.controls.target.clone();
    const endTarget = targetPos.clone();
    const duration = 1200;
    const startTime = Date.now();

    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
      this.camera.position.lerpVectors(startPos, endPos, ease);
      this.controls.target.lerpVectors(startTarget, endTarget, ease);
      this.controls.update();
      if (t < 1) requestAnimationFrame(animateCamera);
    };
    animateCamera();
  }

  _tracePath(moduleId) {
    this._tracedPath.clear();
    if (!this._currentParsedData) return;
    const { edges } = this._currentParsedData;

    // Build adjacency maps
    const downstream = {}; // from -> [to]
    const upstream = {};   // to -> [from]
    edges.forEach(e => {
      if (!downstream[e.from]) downstream[e.from] = [];
      downstream[e.from].push(e.to);
      if (!upstream[e.to]) upstream[e.to] = [];
      upstream[e.to].push(e.from);
    });

    // BFS downstream
    const visited = new Set();
    const queue = [moduleId];
    visited.add(moduleId);
    while (queue.length > 0) {
      const current = queue.shift();
      this._tracedPath.add(current);
      (downstream[current] || []).forEach(next => {
        if (!visited.has(next)) { visited.add(next); queue.push(next); }
      });
    }

    // BFS upstream
    const visitedUp = new Set([moduleId]);
    const queueUp = [moduleId];
    while (queueUp.length > 0) {
      const current = queueUp.shift();
      this._tracedPath.add(current);
      (upstream[current] || []).forEach(prev => {
        if (!visitedUp.has(prev)) { visitedUp.add(prev); queueUp.push(prev); }
      });
    }

    // Highlight cables in the traced path
    this.cables.forEach(cable => {
      const inPath = this._tracedPath.has(cable.userData.fromId) && this._tracedPath.has(cable.userData.toId);
      cable.traverse(child => {
        if (child.isMesh && child.material) {
          child.material.opacity = inPath ? 0.9 : 0.08;
        }
        if (child.isPoints && child.material) {
          child.material.opacity = inPath ? 0.8 : 0.02;
        }
      });
    });
  }

  _resetAllCableOpacity() {
    this.cables.forEach(cable => {
      cable.traverse(child => {
        if (child.isMesh && child.material && child.material._baseOpacity !== undefined) {
          child.material.opacity = child.material._baseOpacity;
        } else if (child.isMesh && child.material) {
          child.material.opacity = child.material.opacity; // keep current
        }
      });
    });
  }

  _highlightModule(moduleId) {
    // Reset all modules
    Object.entries(this.modules3D).forEach(([id, obj]) => {
      obj.traverse(child => {
        if (child.isMesh && child.userData.isMainMesh) {
          child.material.emissiveIntensity = child.userData.baseEmissive || 0.3;
        }
      });
    });
    // Highlight selected
    const selected = this.modules3D[moduleId];
    if (selected) {
      selected.traverse(child => {
        if (child.isMesh && child.userData.isMainMesh) {
          child.material.emissiveIntensity = 1.5;
        }
      });
    }

    // Highlight connected cables
    this._highlightConnectedCables(moduleId);
  }

  _highlightConnectedCables(moduleId) {
    this.cables.forEach(cable => {
      const isConnected = cable.userData.fromId === moduleId || cable.userData.toId === moduleId;
      cable.traverse(child => {
        if (child.isMesh && child.material) {
          child.material.opacity = isConnected ? 0.9 : 0.15;
        }
        if (child.isPoints && child.material) {
          child.material.opacity = isConnected ? 0.8 : 0.05;
        }
      });
    });
  }

  _onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = [];
    Object.values(this.modules3D).forEach(obj => {
      obj.traverse(child => { if (child.isMesh) meshes.push(child); });
    });
    const intersects = this.raycaster.intersectObjects(meshes, false);

    // Clear previous hover target (set scale/glow targets back to resting)
    if (this._hoveredModule && this._hoverTargets[this._hoveredModule]) {
      this._hoverTargets[this._hoveredModule].scale = 0.65;
      this._hoverTargets[this._hoveredModule].glow = 0;
      this._hoveredModule = null;
    }

    // Hide tooltip by default
    if (this._tooltip) this._tooltip.style.display = 'none';

    if (intersects.length > 0) {
      let target = intersects[0].object;
      while (target && !target.userData.moduleId) target = target.parent;
      if (target?.userData.moduleId) {
        this._hoveredModule = target.userData.moduleId;

        // Set smooth hover targets
        if (this._hoverTargets[this._hoveredModule]) {
          this._hoverTargets[this._hoveredModule].scale = 0.73;
          this._hoverTargets[this._hoveredModule].glow = 1;
        }

        // Show tooltip
        if (this._tooltip) {
          const mod = this.moduleData[this._hoveredModule];
          const name = target.userData.moduleName || mod?.moduleName || this._hoveredModule;
          const type = target.userData.moduleType || mod?.moduleType || 'unknown';
          const typeLabels = {
            incomingCall: '📞 Incoming Call',
            skillTransfer: '🎯 Skill Transfer',
            case: '🔀 Case/Branch',
            ifElse: '🔀 If/Else',
            hangup: '📴 Hangup',
            play: '🔊 Play Audio',
            startOnHangup: '⚡ On Hangup',
            voiceMailTransfer: '📧 Voicemail',
            thirdPartyTransfer: '📱 3rd Party Transfer',
            lookupCRMRecord: '🗄️ CRM Lookup',
            crmUpdate: '📝 CRM Update',
            agentTransfer: '👤 Agent Transfer',
            setVariable: '⚙️ Set Variable',
            blockedCallerList: '🛡️ Blocked Callers',
          };
          const typeLabel = typeLabels[type] || `📦 ${type}`;
          this._tooltip.innerHTML = `<strong>${name}</strong><span class="tooltip-type">${typeLabel}</span>`;
          this._tooltip.style.display = 'flex';
          this._tooltip.style.left = `${event.clientX + 16}px`;
          this._tooltip.style.top = `${event.clientY - 10}px`;
        }
      }
    }

    this.renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
    this.composer.setSize(w, h);
    this.bloomPass.setSize(w, h);
  }

  // ═══ Animation Loop ═══

  _animate() {
    requestAnimationFrame(() => this._animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Update avatar or orbit controls
    if (this.controlMode === 'thirdPerson' && this.avatar) {
      this.avatar.update(delta, elapsed);
    } else {
      this.controls.update();
    }

    // ── Module Animations ──
    const lerpSpeed = 6 * delta;
    Object.entries(this.modules3D).forEach(([id, obj]) => {
      const ud = obj.userData;

      // Idle float — gentle sine bob unique per module
      if (ud.baseY !== undefined) {
        const floatY = Math.sin(elapsed * ud.floatSpeed + ud.floatOffset) * ud.floatAmp;
        obj.position.y = ud.baseY + floatY;
      }

      // Spin case/ifElse wireframes
      if (ud.moduleType === 'case' || ud.moduleType === 'ifElse') {
        obj.rotation.y += delta * 0.3;
      }

      // Breathing glow on all main meshes
      obj.traverse(child => {
        if (child.isMesh && child.userData.isMainMesh) {
          const baseGlow = child.userData.baseEmissive || 0.3;
          const breathe = Math.sin(elapsed * 1.2 + (ud.floatOffset || 0)) * 0.03;
          child.material.emissiveIntensity = baseGlow + breathe;
        }
        // Spin wireframe overlays
        if (child.isMesh && child.userData.isWireframe) {
          child.rotation.y += delta * 0.15;
        }
      });

      // Smooth hover scale and glow transitions
      const target = this._hoverTargets[id];
      const current = this._hoverCurrent[id];
      if (target && current) {
        current.scale += (target.scale - current.scale) * Math.min(lerpSpeed, 1);
        current.glow += (target.glow - current.glow) * Math.min(lerpSpeed, 1);
        obj.scale.setScalar(current.scale);

        // Apply hover glow boost
        if (current.glow > 0.01) {
          obj.traverse(child => {
            if (child.isMesh && child.userData.isMainMesh) {
              child.material.emissiveIntensity += current.glow * 0.5;
            }
          });
        }
      }
    });

    // ── Animate pulse rings on ground ──
    this._pulseRings.forEach(ring => {
      const phase = ring.userData.pulsePhase;
      const t = (elapsed * 0.4 + phase) % (Math.PI * 2);
      ring.material.opacity = Math.max(0, Math.sin(t) * 0.03);
      const scaleF = 1 + Math.sin(t) * 0.08;
      ring.scale.set(scaleF, scaleF, 1);
    });

    // Animate cables
    this.cables.forEach(cable => {
      if (cable.userData.update) cable.userData.update(elapsed);
    });

    // ANI cables
    this.aniCables.forEach(cable => {
      if (cable.userData.update) cable.userData.update(elapsed);
    });

    // Heat map transition
    this._updateHeatTransition(delta);

    // Particles
    this.particleSystem.update(elapsed, delta);

    // MiniMap update
    if (this.miniMap) {
      const playerPos = this.avatar ? this.avatar.position : this.camera.position;
      this.miniMap.updatePlayerPosition(playerPos.x, playerPos.z);
      this.miniMap.render();
    }

    // Render
    this.composer.render();
    this.labelRenderer.render(this.scene, this.camera);
  }

  // ═══ Heat Map Animated Toggle ═══

  toggleHeatMap(enabled, parsedData, heatData) {
    this.heatMapActive = enabled;

    // Start transition animation
    this._heatTransition.active = true;
    this._heatTransition.direction = enabled ? 1 : -1;

    // Rebuild the graph with/without heat data
    if (parsedData) {
      this.buildGraph(parsedData, enabled ? heatData : null);
    }

    // Animate the overlay
    this._showHeatOverlay(enabled);
  }

  _showHeatOverlay(enabled) {
    // Get or create overlay
    let overlay = document.getElementById('heat-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'heat-overlay';
      overlay.className = 'heat-overlay';
      document.getElementById('app').appendChild(overlay);
    }

    const label = enabled ? 'HEAT MAP: ACTIVE' : 'HEAT MAP: DISABLED';
    const color = enabled ? 'var(--accent-green)' : 'var(--text-muted)';

    overlay.innerHTML = `
      <div class="heat-overlay-inner" style="border-color: ${color};">
        <div class="heat-overlay-icon" style="color: ${color};">${enabled ? '🔥' : '❄️'}</div>
        <div class="heat-overlay-text" style="color: ${color};">${label}</div>
        <div class="heat-overlay-bar" style="background: ${color};"></div>
      </div>
    `;

    // Trigger animation
    overlay.classList.remove('active');
    void overlay.offsetWidth; // force reflow
    overlay.classList.add('active');

    // Remove after animation
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 1800);
  }

  _updateHeatTransition(delta) {
    if (!this._heatTransition.active) return;

    this._heatTransition.progress += delta / this._heatTransition.duration;
    if (this._heatTransition.progress >= 1) {
      this._heatTransition.active = false;
      this._heatTransition.progress = 0;

      // Adjust bloom based on heat state
      if (this.heatMapActive) {
        this.bloomPass.strength = 0.6;
      } else {
        this.bloomPass.strength = 0.4;
      }
    } else {
      // During transition, pulse the bloom
      const t = this._heatTransition.progress;
      const pulse = Math.sin(t * Math.PI);
      this.bloomPass.strength = 0.5 + pulse * 0.4;
    }
  }

  // ═══ Public API ═══

  toggleLabels(visible) {
    this.labelsVisible = visible;
    this.labelRenderer.domElement.style.display = visible ? 'block' : 'none';
  }

  resetCamera() {
    this._flyToOverview();
  }

  screenshot() {
    this.composer.render();
    return this.renderer.domElement.toDataURL('image/png');
  }

  // ═══ ANI Expansion ═══

  toggleANIExpansion(enabled, parsedData, heatData) {
    this.aniExpansionEnabled = enabled;
    this._clearANIExpansion();
    if (enabled && parsedData) {
      this._buildANIExpansion(parsedData, heatData);
    }
  }

  _clearANIExpansion() {
    this.aniNodes.forEach(obj => {
      obj.traverse(child => {
        if (child.isCSS2DObject && child.element && child.element.parentNode) {
          child.element.parentNode.removeChild(child.element);
        }
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
      if (obj.parent) obj.parent.remove(obj);
      else this.scene.remove(obj);
    });
    this.aniCables.forEach(cable => {
      cable.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      if (cable.parent) cable.parent.remove(cable);
      else this.scene.remove(cable);
    });
    this.aniNodes = [];
    this.aniCables = [];
  }

  _buildANIExpansion(parsedData, heatData) {
    const { modules } = parsedData;

    modules.forEach(mod => {
      if (mod.moduleType !== 'case') return;
      const branches = mod.data.branches || [];
      const blockedBranches = branches.filter(b => b.name !== 'No Match');
      if (blockedBranches.length < 2) return;

      const parentObj = this.modules3D[mod.moduleId];
      if (!parentObj) return;

      const parentPos = parentObj.position;
      const count = blockedBranches.length;
      const radius = 30 + count * 1.5;
      const angleStep = (Math.PI * 2) / count;

      // Group branches by destination module for cable routing
      const destGroups = {};
      blockedBranches.forEach(branch => {
        const destId = branch.descendantId || 'unknown';
        if (!destGroups[destId]) destGroups[destId] = [];
        destGroups[destId].push(branch);
      });

      blockedBranches.forEach((branch, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x = parentPos.x + Math.cos(angle) * radius;
        const z = parentPos.z + Math.sin(angle) * radius;
        const y = parentPos.y - 8;

        const nodeGroup = new THREE.Group();

        // Determine routing — does this ANI route to a known module?
        const destModuleObj = branch.descendantId ? this.modules3D[branch.descendantId] : null;
        const routesToKnown = destModuleObj != null;

        // Color: red if routes to hangup, orange if routes to unknown, yellow if routes to another module
        let nodeColor = 0xff3d5a;
        let nodeEmissive = 0xff1133;
        if (routesToKnown) {
          const destData = this.moduleData[branch.descendantId];
          if (destData && destData.moduleType === 'hangup') {
            nodeColor = 0xff3d5a;
            nodeEmissive = 0xff1133;
          } else {
            nodeColor = 0xffd740;
            nodeEmissive = 0xccaa00;
          }
        }

        const sphereGeo = new THREE.SphereGeometry(1.2, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: nodeColor, emissive: nodeEmissive, emissiveIntensity: 0.5,
          metalness: 0.6, roughness: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.userData.isMainMesh = true;
        sphere.userData.baseEmissive = 0.5;
        nodeGroup.add(sphere);

        const ringGeo = new THREE.RingGeometry(1.5, 1.8, 16);
        const ringMat = new THREE.MeshBasicMaterial({
          color: nodeColor, transparent: true, opacity: 0.2, side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        nodeGroup.add(ring);

        nodeGroup.position.set(x, y, z);
        nodeGroup.userData = {
          moduleId: `ani_${mod.moduleId}_${i}`,
          moduleType: 'aniNode',
          aniName: branch.name
        };

        this.scene.add(nodeGroup);
        this.aniNodes.push(nodeGroup);

        // Label
        const div = document.createElement('div');
        div.className = 'module-label hangup-label';
        div.textContent = branch.name;
        div.style.fontSize = '9px';
        const label = new CSS2DObject(div);
        label.position.set(0, 3, 0);
        nodeGroup.add(label);

        // Cable from parent case module to ANI node
        const cableToNode = this.cableRenderer.create(
          parentPos, nodeGroup.position,
          { type: 'branch', volume: 0.05, isFriction: true, isSuccess: false }
        );
        this.scene.add(cableToNode);
        this.aniCables.push(cableToNode);

        // Cable from ANI node to its actual destination module (if it exists in the scene)
        if (destModuleObj) {
          const destCable = this.cableRenderer.create(
            nodeGroup.position, destModuleObj.position,
            {
              type: destModuleObj.userData.moduleType === 'hangup' ? 'exceptional' : 'branch',
              volume: 0.08,
              isFriction: destModuleObj.userData.moduleType === 'hangup',
              isSuccess: destModuleObj.userData.moduleType !== 'hangup'
            }
          );
          this.scene.add(destCable);
          this.aniCables.push(destCable);
        }
      });
    });
  }
}

