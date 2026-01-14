# Physics Laboratory Simulation

An interactive 2D physics sandbox built with React, Matter.js, and TypeScript. Experiment with physics concepts like gravity, momentum, collisions, and energy in a visually rich environment.

![Physics Lab](https://img.shields.io/badge/React-19-blue) ![Matter.js](https://img.shields.io/badge/Matter.js-Physics-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- **Drag & Drop Objects** - Place various physics objects like balls, boxes, ramps, and springs
- **Real-time Physics** - Powered by Matter.js for accurate 2D physics simulation
- **Pre-built Experiments** - Newton's Cradle, Projectile Motion, Elastic Collisions, and more
- **Live Data Visualization** - Graphs showing position, velocity, and energy in real-time
- **Visualization Overlays** - Velocity vectors, force vectors, and motion trails
- **Adjustable Parameters** - Control gravity, time scale, friction, and restitution
- **Properties Panel** - View and modify selected object properties

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Controls

| Action | Control |
|--------|---------|
| Select/Drag | Pointer tool (1) + click & drag |
| Create Constraint | Constraint tool (2) |
| Pin/Unpin Object | Pin tool (3) |
| Delete Object | Eraser tool (4) |
| Play/Pause | Space |
| Toggle Graphs | G |
| Clear All | Trash button |
| Reset Positions | Reset button |

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
