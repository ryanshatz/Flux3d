# Flux3D — Five9 IVR Call-Flow Visualizer

<div align="center">

**Walk through your IVR call flows in an immersive 3D environment**

[🚀 **Try it Now →**](https://ryanshatz.github.io/flux3d/)

</div>

---

## Overview

Flux3D transforms Five9 IVR (Interactive Voice Response) scripts into interactive 3D environments you can explore. Upload any `.five9ivr` XML file and watch your call-flow logic materialize as a navigable 3D world — complete with a walking avatar, directional cables, color-coded modules, and real-time analytics.

Built for contact center engineers, telecom analysts, and anyone who needs to understand complex IVR routing at a glance.

## Features

### 🎮 3rd-Person Avatar Navigation
- **WASD movement** — Camera-relative controls (W always means "forward from where you're looking")
- **Sprint** — Hold `Shift` to move faster
- **Zoom** — Scroll wheel adjusts camera distance
- **Free Camera** — Press `Tab` to toggle orbit/free-look mode
- **Click-to-Walk** — Click any module to auto-navigate to it

### 🏗️ Premium Module Geometries
Every IVR module type has a unique, identifiable 3D shape sitting on a glowing platform base:

| Module Type | 3D Shape | Color |
|---|---|---|
| **IncomingCall** | Torus ring + glowing sphere | Cyan |
| **SkillTransfer / Agent** | Industrial cylinder with flanges | Orange |
| **Case / IfElse** | Diamond octahedron + wireframe | Yellow |
| **Hangup** | Compact box with X cross | Red |
| **Play** | Speaker cone with wave rings | Purple |
| **SetVariable** | Gear torus + center sphere | Steel Blue |
| **BlockedCaller** | Shield with X cross | Pink |
| **CRM / Database** | Stacked disks with connector | Silver |

### 🔌 Directional Cable Routing
- **Manhattan routing** — All cables use orthogonal 90° turns with smooth rounded corners
- **Directional arrow cones** — Spaced along each cable showing flow direction
- **Color-coded connections** — Default (blue), Branch (orange), Hangup (red), Success (green), Error (coral)
- **Heat-map integration** — Cable thickness scales with call volume when heat map data is loaded

### 📊 Analytics & Diagnostics
- **Heat Map Mode** — Toggle to visualize call volume across modules (thicker cables = more traffic)
- **Dead-End Detection** — Automatically detects unreachable or terminal modules
- **Live Stats** — Module count, connection count, blocked ANI count, skill transfer count
- **Module Inspector** — Click any module for detailed properties and connection info

### 🌑 Dark Environment
- Deep navy skybox with gradient horizon
- Hex circuit-board ground with cyan-tinted pattern
- Bloom post-processing for glowing emissive modules
- Glassmorphism UI panels with subtle transparency

### 🔍 Search & Shortcuts
- **`Ctrl+F`** — Search modules by name with real-time filtering
- **`?`** — Toggle keyboard shortcuts overlay
- **ANI Expand** — Expand blocked caller ANI node clusters

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- npm

### Install & Run
```bash
git clone https://github.com/ryanshatz/flux3d.git
cd flux3d
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Load an IVR Script
1. Click **"Load IVR"** in the toolbar
2. Select any `.five9ivr` XML file exported from Five9
3. The 3D scene builds automatically

A sample IVR script (`INBOUND OPEN.five9ivr`) is bundled and loads automatically on startup.

### Optional: Heat Map Data
1. Click **"Heat Map CSV"** in the toolbar
2. Upload a CSV call log with columns for module paths and call counts
3. Cable thickness and module glow intensity scale with call volume

## Controls

| Key | Action |
|---|---|
| `W` / `↑` | Move forward |
| `A` / `←` | Strafe left |
| `S` / `↓` | Move backward |
| `D` / `→` | Strafe right |
| `Shift` | Sprint |
| `Tab` | Toggle free camera / 3rd person |
| `Scroll` | Zoom in/out |
| `Click Module` | Inspect module details + auto-walk |
| `Ctrl+F` | Search modules |
| `?` | Keyboard shortcuts |

## Tech Stack

| Layer | Technology |
|---|---|
| 3D Engine | [Three.js](https://threejs.org/) + EffectComposer (Bloom) |
| Build Tool | [Vite](https://vitejs.dev/) |
| UI | Custom CSS design system (glassmorphism, CSS variables) |
| Parser | Custom XML parser for Five9 IVR schema |
| Labels | CSS2DRenderer for always-facing module labels |

## Project Structure

```
flux3d/
├── index.html              # Main HTML with toolbar, inspector, overlays
├── vite.config.js          # Vite config (GitHub Pages base path)
├── INBOUND OPEN.five9ivr   # Sample IVR script (auto-loaded)
├── src/
│   ├── main.js             # App entry point, file handling, UI wiring
│   ├── styles/
│   │   └── main.css        # Full design system (dark theme, animations)
│   ├── parser/
│   │   └── five9Parser.js  # Five9 XML → module graph
│   ├── data/
│   │   └── csvParser.js    # Call log CSV → heat map data
│   ├── scene/
│   │   ├── SceneManager.js    # Three.js orchestrator (lights, ground, camera)
│   │   ├── ModuleFactory.js   # 3D module geometry builder
│   │   ├── CableRenderer.js   # Orthogonal cable routing + arrows
│   │   ├── AvatarController.js # 3rd-person character + camera follow
│   │   └── ParticleSystem.js  # Ambient floating particles
│   └── ui/
│       ├── InspectorPanel.js  # Module detail sidebar
│       └── MiniMap.js         # 2D top-down overview
└── public/                 # Static assets
```

## Deployment

### GitHub Pages
The project is configured for automatic GitHub Pages deployment:

```bash
npm run build
# Output goes to dist/
# Push to gh-pages branch or configure GitHub Pages to serve from dist/
```

### Manual Deploy
```bash
npm run build
# Upload contents of dist/ to any static host
```

## License

MIT

---

<div align="center">
  <sub>Built with Three.js • Designed for Five9 IVR diagnostics</sub>
</div>
