# Physics Laboratory Simulation

An interactive physics simulation sandbox built with React, Matter.js (2D), Rapier (3D), and TypeScript. Experiment with physics concepts like gravity, momentum, collisions, and energy in a visually rich environment.

![Physics Lab](https://img.shields.io/badge/React-19-blue) ![Matter.js](https://img.shields.io/badge/Matter.js-2D_Physics-green) ![Rapier](https://img.shields.io/badge/Rapier-3D_Physics-orange) ![Three.js](https://img.shields.io/badge/Three.js-3D_Graphics-black)

## Features

- **Dual Mode Simulation** - Switch seamlessly between 2D and 3D physics engines
- **Drag & Drop Objects** - Place various physics objects like balls, boxes, ramps, and springs
- **Real-time Physics** - Powered by Matter.js (2D) and Rapier (3D) for accurate simulation
- **Pre-built Experiments** - Newton's Cradle, Projectile Motion, Elastic Collisions, and more
- **Live Data Visualization** - Graphs showing position, velocity, and energy in real-time
- **Visualization Overlays** - Velocity vectors, force vectors, and motion trails
- **Adjustable Parameters** - Control gravity, time scale, friction, and restitution
- **Properties Panel** - View and modify selected object properties in both 2D and 3D

## Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Controls

### General
| Action | Control |
|--------|---------|
| Play/Pause | Space |
| Toggle Graphs | G |
| Clear All | Trash button |
| Reset Positions | Reset button |
| Switch 2D/3D | Toggle Switch in Toolbar |

### 2D Mode
| Action | Control |
|--------|---------|
| Select/Drag | Pointer tool (1) + click & drag |
| Create Constraint | Constraint tool (2) |
| Pin/Unpin Object | Pin tool (3) |
| Delete Object | Eraser tool (4) |

### 3D Mode
| Action | Control |
|--------|---------|
| Rotate Camera | Left Click + Drag |
| Pan Camera | Right Click + Drag |
| Zoom | Scroll Wheel |
| **Throw Object** | Click & Drag Object (Pauses Camera) |
| Select Object | Click Object |

## Object Categories

- **Basic Shapes** - Wooden Box, Rubber Ball, Glass Marble, Bowling Ball
- **Ramps & Platforms** - 30°, 45°, 60° ramps, platforms
- **Springs & Connectors** - Springs, ropes, pendulum bobs
- **Special Objects** - Dominoes, trampolines, fans
- **Force Emitters** - Fans, gravity wells

## Pre-built Experiments

1. **Inclined Plane** - Study motion on a ramp
2. **Pendulum Motion** - Observe simple harmonic motion
3. **Elastic Collision** - Momentum conservation demo
4. **Newton's Cradle** - Classic momentum transfer
5. **Projectile Motion** - Parabolic trajectory
6. **Spring Oscillation** - Mass on a spring
7. **Domino Chain** - Energy transfer cascade

## Tech Stack

- **React 19** - UI framework
- **Matter.js** - 2D physics engine
- **Rapier** - 3D physics engine (WASM-based)
- **Three.js / React Three Fiber** - 3D rendering
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Project Structure

```
physics-simulation-lab/
├── components/
│   ├── PhysicsCanvas.tsx   # Main physics simulation
│   ├── Sidebar.tsx         # Object inventory
│   ├── Toolbar.tsx         # Control tools
│   ├── PropertiesPanel.tsx # Object properties
│   ├── GraphsPanel.tsx     # Data visualization
│   └── ExperimentSelector.tsx
├── data/
│   ├── objects.ts          # Physics object definitions
│   ├── materials.ts        # Material presets
│   └── experiments.ts      # Pre-built experiments
├── types.ts                # TypeScript types
├── App.tsx                 # Main app component
└── styles.css              # CSS styling
```

## License

MIT
