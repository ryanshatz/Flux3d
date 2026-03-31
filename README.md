<div align="center">

# ◆ FLUX3D

### An open-source, immersive 3D visualizer for Five9 IVR call flows

Walk through your IVR logic in a navigable 3D environment — complete with a holographic avatar,<br />
animated data cables, real-time analytics, and interactive module inspection.

<br />

[🚀 **Live Demo**](https://ryanshatz.github.io/Flux3D/) &nbsp;·&nbsp; [📖 **Documentation**](#-features) &nbsp;·&nbsp; [⚡ **Quick Start**](#-quick-start) &nbsp;·&nbsp; [🎮 **Controls**](#-controls)

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-0088cc.svg?style=for-the-badge)](LICENSE)
[![Three.js](https://img.shields.io/badge/Three.js-r172-00d4ee.svg?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-a371f7.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-3fb950.svg?style=for-the-badge&logo=github)](https://ryanshatz.github.io/Flux3D/)

</div>

<br />

---

<br />

## 📸 Screenshots

<div align="center">

<img src="docs/screenshots/hero-overview.png" alt="Flux3D — Full 3D Scene Overview" width="100%" />

<sub><b>Full 3D Scene</b> — Navigate an immersive environment with glowing modules, animated data cables, floating particles, and a holographic avatar. The toolbar at the top provides one-click access to all features.</sub>

</div>

<br />

<table>
<tr>
<td width="50%">
<img src="docs/screenshots/inspector-panel.png" alt="Module Inspector Panel" width="100%" />
<br />
<div align="center"><sub><b>Module Inspector</b> — Click any module to reveal its identity, flow data, routing info, and TTS prompts in a glassmorphism side panel.</sub></div>
</td>
<td width="50%">
<img src="docs/screenshots/module-closeup.png" alt="Module Close-up with Ground Rings" width="100%" />
<br />
<div align="center"><sub><b>Module Close-up</b> — Each module has a unique 3D geometry on a glowing platform. Animated pulse rings ripple outward on the ground.</sub></div>
</td>
</tr>
</table>

<br />

---

<br />

## ✨ Features

### 🎮 3rd-Person Avatar Navigation

Control a holographic data-entity that walks around your IVR map at ground level. The avatar features articulated limbs with a detailed walk cycle, a glowing visor, and trail particles.

| Feature | Description |
|---|---|
| **WASD Movement** | Camera-relative controls — W always means "forward from where you're looking" |
| **Smooth Acceleration** | Speed lerps smoothly — no jarring start/stop |
| **Sprint** | Hold `Shift` to move 1.8× faster with subtle camera shake |
| **Zoom** | Scroll wheel adjusts camera distance and angle in real-time |
| **Free Camera** | Press `Tab` to toggle orbit/free-look mode |
| **Click-to-Walk** | Click any module to auto-navigate the avatar there |
| **Double-Click Fly-to** | Double-click any module to instantly teleport nearby |

<br />

### 🏗️ Premium Module Geometries

Every IVR module type has a unique, identifiable 3D shape sitting on a glowing platform base. All modules feature idle floating animation and a breathing emissive glow.

| Module Type | 3D Shape | Color | Visual Effects |
|---|---|---|---|
| 📞 **IncomingCall** | Torus portal + glowing sphere | Cyan | Pulse rings, "START HERE" label |
| 🎯 **SkillTransfer** | Industrial cylinder with flanges | Orange | Heat-glow on high volume |
| 🔀 **Case / IfElse** | Diamond octahedron + spinning wireframe | Yellow | Continuous rotation |
| 📴 **Hangup** | Compact box with X cross | Red | Red emissive warning glow |
| 🔊 **Play** | Speaker cone with wave rings | Purple | Audio wave animation |
| ⚙️ **SetVariable** | Gear torus + center sphere | Steel Blue | Subtle spin |
| 🛡️ **BlockedCaller** | Shield with X cross | Pink | Cluster expansion |
| 🗄️ **CRM / Database** | Stacked disks with connector | Green | Data pulse |

<br />

### 🔌 Animated Cable Routing

Cables use Manhattan routing (orthogonal 90° turns) with smooth CatmullRom curves. Every cable is alive with animation:

- **🔵 Flowing Data Particles** — Glowing particles travel along each cable showing real-time data flow direction
- **⚡ Electric Pulse Waves** — Periodic brightness spikes travel the cable length, simulating data transmission
- **💫 Breathing Glow** — Cable emissive intensity oscillates with a subtle, organic pulse
- **🎨 Color-Coded Types** — Default (blue), Branch (orange), Hangup (red), Success (green), Error (coral)
- **📊 Volume Scaling** — Cable thickness, particle density, and glow intensity scale with call volume data

<br />

### 📊 Analytics & Diagnostics

| Feature | Description |
|---|---|
| **Heat Map Mode** | Toggle to visualize call volume — thicker cables and brighter modules indicate more traffic |
| **Path Tracing** | Click any module to trace the full upstream + downstream path using BFS traversal. Unrelated cables dim to 8% opacity |
| **Dead-End Detection** | Automatically logs unreachable or terminal modules to the console |
| **Live Stats Bar** | Real-time counts of modules, connections, blocked ANIs, and skill transfers |
| **Module Inspector** | Detailed side panel with module identity, flow metadata, TTS text, decision branches, and routing info |
| **ANI Expansion** | Expand blocked caller ANI node clusters around case modules for detailed analysis |
| **Mini-Map** | Top-down 2D overview of the entire IVR graph in the bottom-right corner |

<br />

### 🌌 Immersive Atmosphere

The environment is designed to feel alive and futuristic:

- **Gradient Skybox** — Deep navy → charcoal gradient for cinematic depth
- **Hex Circuit Ground** — Dark hex pattern with cyan circuit traces
- **1,200+ Glow Particles** — Additive-blended dust motes with size variation drifting upward
- **50 Firefly Accents** — Large, bright particles with pulsing glow that drift lazily through the scene
- **Animated Pulse Rings** — 3 concentric rings on the ground ripple outward in phase
- **Bloom Post-Processing** — UnrealBloomPass for that signature emissive glow on all modules
- **Per-Module Floating** — Every module gently bobs on a unique sine wave (desynchronized)
- **Breathing Emissives** — All module glow intensities oscillate subtly, creating a living feel

<br />

### 🔍 Search & Interaction

- **`Ctrl+F` Search** — Real-time module search by name or type with instant results
- **Hover Tooltip** — Module name + type with emoji indicator, follows cursor with smooth fade-in
- **Smooth Hover Effects** — Scale and glow lerp smoothly on hover (no instant snapping)
- **Path Trace on Click** — Click a module to highlight its full call path chain
- **Click Empty Space** — Clear the current selection and path trace
- **📷 Screenshot Export** — Branded PNG snapshots with Flux3D watermark and timestamp

<br />

---

<br />

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/ryanshatz/Flux3D.git

# Navigate to the project
cd Flux3D

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:5173/Flux3D/** in your browser. The sample IVR script loads automatically.

### Loading Your Own IVR Script

1. Click **"Load IVR"** in the toolbar
2. Select any `.five9ivr` XML file exported from Five9 VCC
3. The 3D scene builds automatically with spring-animated module entrances

### Adding Heat Map Data

1. Click **"Heat Map CSV"** in the toolbar
2. Upload a CSV call log with module path and call count columns
3. Cable thickness, particle density, and module glow scale with call volume
4. Toggle the **"Heat Map"** button to switch between normal and heat-mapped views

<br />

---

<br />

## 🎮 Controls

### Keyboard

| Key | Action |
|---|---|
| `W` `A` `S` `D` | Move forward / left / backward / right |
| `↑` `←` `↓` `→` | Alternative movement keys |
| `Shift` | Sprint (1.8× speed, camera shake) |
| `Tab` | Toggle 3rd-person ↔ free camera |
| `Ctrl+F` | Open module search |
| `Escape` | Close overlays and panels |
| `F11` | Toggle fullscreen |
| `?` | Show keyboard shortcuts |

### Mouse

| Action | Effect |
|---|---|
| **Hover** | Smooth scale-up + glow + tooltip with module info |
| **Click Module** | Select → auto-walk → trace path → open inspector |
| **Double-Click Module** | Teleport avatar (3rd person) or fly camera (orbit) |
| **Click Empty Space** | Clear selection and path trace |
| **Scroll Wheel** | Zoom camera in/out |
| **Right-Drag** | Pan camera (free camera mode) |

<br />

---

<br />

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **3D Engine** | [Three.js](https://threejs.org/) r172 | Scene graph, materials, lighting, post-processing |
| **Post-Processing** | UnrealBloomPass | Emissive glow on all modules and cables |
| **Build Tool** | [Vite](https://vitejs.dev/) 6 | Lightning-fast HMR, ES module bundling |
| **UI Framework** | Vanilla CSS | Custom design system with glassmorphism and CSS variables |
| **Labels** | CSS2DRenderer | Always-facing module labels that scale with distance |
| **Particles** | Custom glow sprites | Canvas-generated radial gradient textures with additive blending |
| **Hosting** | GitHub Pages | Static deployment from `gh-pages` branch |

<br />

---

<br />

## 📁 Project Structure

```
Flux3D/
│
├── 📄 index.html                   # Main HTML (toolbar, inspector, search, overlays)
├── ⚙️ vite.config.js                # Vite config (GitHub Pages base path)
├── 📦 package.json                  # Dependencies and scripts
├── 📋 INBOUND OPEN.five9ivr         # Sample IVR script (auto-loaded on startup)
│
├── 📂 src/
│   ├── 🚀 main.js                   # App entry point — file handling, UI wiring
│   │
│   ├── 📂 styles/
│   │   └── 🎨 main.css              # Full design system (1,200+ lines)
│   │                                  # Dark theme, glassmorphism, animations, tooltips
│   │
│   ├── 📂 parser/
│   │   ├── 📖 five9Parser.js        # Five9 XML → module graph + edge list
│   │   └── 🔊 ttsDecoder.js         # TTS prompt text decoder
│   │
│   ├── 📂 data/
│   │   └── 📊 csvParser.js          # Call log CSV → heat map + demo data generator
│   │
│   ├── 📂 scene/
│   │   ├── 🎬 SceneManager.js       # Three.js orchestrator (1,100+ lines)
│   │   │                              # Scene, lights, camera, bloom, interactions,
│   │   │                              # hover system, path tracing, animations
│   │   ├── 🏗️ ModuleFactory.js       # 3D geometry builder (10+ unique module shapes)
│   │   ├── 🔌 CableRenderer.js      # Manhattan cable routing + flow particles + pulses
│   │   ├── 🤖 AvatarController.js   # 3rd-person character + walk cycle + camera follow
│   │   └── ✨ ParticleSystem.js      # Dual-layer atmosphere (dust motes + fireflies)
│   │
│   └── 📂 ui/
│       ├── 🔍 InspectorPanel.js      # Module detail sidebar (glassmorphism panel)
│       └── 🗺️ MiniMap.js             # 2D top-down overview minimap
│
├── 📂 docs/
│   └── 📂 screenshots/              # README screenshots
│
└── 📂 public/                        # Static assets copied to dist/
```

<br />

---

<br />

## 🚀 Deployment

### GitHub Pages (Recommended)

```bash
# Build production bundle
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

The site will be available at `https://<username>.github.io/Flux3D/`

### Any Static Host

```bash
npm run build
# Upload contents of dist/ to Netlify, Vercel, Cloudflare Pages, etc.
```

> **Note:** If deploying to a subdirectory, update `base` in `vite.config.js` to match your path.

<br />

---

<br />

## 🤝 Contributing

Contributions are welcome! Flux3D is fully open-source under the MIT license.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions

- 🎨 Additional module type geometries
- 🔄 Real-time Five9 API integration for live call data
- 📱 Mobile touch controls
- 🎵 Audio feedback and ambient sound
- 🌐 Multi-script comparison view
- 📈 Advanced analytics dashboards

<br />

---

<br />

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br />

---

<div align="center">

<br />

**Built with [Three.js](https://threejs.org/) • Designed for [Five9](https://www.five9.com/) IVR Diagnostics • Open Source**

<br />

Made by [Ryan Shatz](https://github.com/ryanshatz)

</div>
