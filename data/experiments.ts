import { ExperimentPreset } from '../types';

export const EXPERIMENTS: ExperimentPreset[] = [
  {
    id: 'inclined_plane',
    name: 'Inclined Plane',
    description: 'Study the motion of a block sliding down a ramp and measure velocity at the bottom.',
    objects: [
      { definitionId: 'ramp_45', x: 400, y: 450, angle: 0 },
      { definitionId: 'wooden_box', x: 340, y: 360, velocity: { x: 0, y: 0 } },
      { definitionId: 'velocity_sensor', x: 520, y: 500 }
    ],
    constraints: [],
    initialSettings: {
      gravity: 1,
      timeScale: 1,
      showVelocityVectors: true
    }
  },
  {
    id: 'pendulum',
    name: 'Pendulum Motion',
    description: 'Observe simple harmonic motion and energy transfer in a pendulum.',
    objects: [
      { definitionId: 'rope_anchor', x: 500, y: 100, isStatic: true },
      { definitionId: 'pendulum_bob', x: 350, y: 250 }
    ],
    constraints: [
      { type: 'rope', objectAIndex: 0, objectBIndex: 1, stiffness: 0.9 }
    ],
    initialSettings: {
      gravity: 1,
      timeScale: 1,
      showMotionTrails: true
    }
  },
  {
    id: 'elastic_collision',
    name: 'Elastic Collision',
    description: 'Two rubber balls collide elastically, demonstrating conservation of momentum.',
    objects: [
      { definitionId: 'rubber_ball', x: 250, y: 400, velocity: { x: 5, y: 0 } },
      { definitionId: 'rubber_ball', x: 550, y: 400, velocity: { x: -3, y: 0 } }
    ],
    constraints: [],
    initialSettings: {
      gravity: 0,
      timeScale: 0.5,
      showVelocityVectors: true
    }
  },
  {
    id: 'inelastic_collision',
    name: 'Inelastic Collision',
    description: 'Heavy objects collide with minimal bounce, showing energy loss.',
    objects: [
      { definitionId: 'bowling_ball', x: 250, y: 400, velocity: { x: 4, y: 0 } },
      { definitionId: 'bowling_ball', x: 550, y: 400, velocity: { x: -2, y: 0 } }
    ],
    constraints: [],
    initialSettings: {
      gravity: 0,
      timeScale: 0.5,
      showVelocityVectors: true
    }
  },
  {
    id: 'newtons_cradle',
    name: "Newton's Cradle",
    description: 'Classic demonstration of momentum and energy transfer.',
    objects: [
      { definitionId: 'rope_anchor', x: 350, y: 150, isStatic: true },
      { definitionId: 'rope_anchor', x: 400, y: 150, isStatic: true },
      { definitionId: 'rope_anchor', x: 450, y: 150, isStatic: true },
      { definitionId: 'rope_anchor', x: 500, y: 150, isStatic: true },
      { definitionId: 'rope_anchor', x: 550, y: 150, isStatic: true },
      { definitionId: 'cradle_ball', x: 280, y: 300 },
      { definitionId: 'cradle_ball', x: 400, y: 350 },
      { definitionId: 'cradle_ball', x: 450, y: 350 },
      { definitionId: 'cradle_ball', x: 500, y: 350 },
      { definitionId: 'cradle_ball', x: 550, y: 350 }
    ],
    constraints: [
      { type: 'rope', objectAIndex: 0, objectBIndex: 5, length: 150, stiffness: 0.95 },
      { type: 'rope', objectAIndex: 1, objectBIndex: 6, length: 150, stiffness: 0.95 },
      { type: 'rope', objectAIndex: 2, objectBIndex: 7, length: 150, stiffness: 0.95 },
      { type: 'rope', objectAIndex: 3, objectBIndex: 8, length: 150, stiffness: 0.95 },
      { type: 'rope', objectAIndex: 4, objectBIndex: 9, length: 150, stiffness: 0.95 }
    ],
    initialSettings: {
      gravity: 1,
      timeScale: 1
    }
  },
  {
    id: 'projectile_motion',
    name: 'Projectile Motion',
    description: 'Launch a ball at an angle and observe the parabolic trajectory.',
    objects: [
      { definitionId: 'platform_small', x: 150, y: 450 },
      { definitionId: 'basketball', x: 150, y: 400, velocity: { x: 8, y: -12 } },
      { definitionId: 'platform_small', x: 650, y: 450 }
    ],
    constraints: [],
    initialSettings: {
      gravity: 1,
      timeScale: 0.5,
      showMotionTrails: true,
      showVelocityVectors: true
    }
  },
  {
    id: 'spring_oscillation',
    name: 'Spring Oscillation',
    description: 'A mass on a spring demonstrates simple harmonic motion.',
    objects: [
      { definitionId: 'spring_anchor', x: 500, y: 100, isStatic: true },
      { definitionId: 'spring_weight', x: 500, y: 300 }
    ],
    constraints: [
      { type: 'spring', objectAIndex: 0, objectBIndex: 1, length: 100, stiffness: 0.02 }
    ],
    initialSettings: {
      gravity: 1,
      timeScale: 1,
      showMotionTrails: true
    }
  },
  {
    id: 'friction_comparison',
    name: 'Friction Comparison',
    description: 'Compare how objects slide on different surfaces: ice, wood, and sandpaper.',
    objects: [
      { definitionId: 'ice_block', x: 200, y: 400 },
      { definitionId: 'platform_medium', x: 450, y: 400 },
      { definitionId: 'sandpaper_platform', x: 700, y: 400 },
      { definitionId: 'wooden_box', x: 200, y: 360 },
      { definitionId: 'wooden_box', x: 450, y: 360 },
      { definitionId: 'wooden_box', x: 700, y: 360 }
    ],
    constraints: [],
    initialSettings: {
      gravity: 1,
      timeScale: 1
    }
  },
  {
    id: 'bouncing_balls',
    name: 'Bouncing Comparison',
    description: 'Compare the bounce of different materials: rubber, glass, and bowling ball.',
    objects: [
      { definitionId: 'rubber_ball', x: 250, y: 100 },
      { definitionId: 'glass_marble', x: 400, y: 100 },
      { definitionId: 'bowling_ball', x: 550, y: 100 },
      { definitionId: 'trampoline', x: 400, y: 500 }
    ],
    constraints: [],
    initialSettings: {
      gravity: 1,
      timeScale: 0.5
    }
  },
  {
    id: 'domino_chain',
    name: 'Domino Chain',
    description: 'Energy transfer through a chain of falling dominoes.',
    objects: [
      { definitionId: 'domino', x: 200, y: 465 },
      { definitionId: 'domino', x: 240, y: 465 },
      { definitionId: 'domino', x: 280, y: 465 },
      { definitionId: 'domino', x: 320, y: 465 },
      { definitionId: 'domino', x: 360, y: 465 },
      { definitionId: 'domino', x: 400, y: 465 },
      { definitionId: 'domino', x: 440, y: 465 },
      { definitionId: 'domino', x: 480, y: 465 },
      { definitionId: 'rubber_ball', x: 160, y: 440, velocity: { x: 3, y: 0 } }
    ],
    constraints: [],
    initialSettings: {
      gravity: 1,
      timeScale: 1
    }
  },
  {
    id: 'lever_mechanism',
    name: 'Lever & Fulcrum',
    description: 'Demonstrate mechanical advantage with a lever.',
    objects: [
      { definitionId: 'fulcrum', x: 400, y: 480 },
      { definitionId: 'lever_beam', x: 400, y: 450 },
      { definitionId: 'bowling_ball', x: 300, y: 420 },
      { definitionId: 'rubber_ball', x: 500, y: 420 }
    ],
    constraints: [
      { type: 'pin', objectAIndex: 0, objectBIndex: 1 }
    ],
    initialSettings: {
      gravity: 1,
      timeScale: 1
    }
  },
  {
    id: 'fan_force',
    name: 'Fan Force Field',
    description: 'A fan creates an upward force field that can levitate light objects.',
    objects: [
      { definitionId: 'fan', x: 400, y: 480 },
      { definitionId: 'feather', x: 400, y: 350 },
      { definitionId: 'paper_sheet', x: 450, y: 300 },
      { definitionId: 'rubber_ball', x: 350, y: 200 }
    ],
    constraints: [],
    initialSettings: {
      gravity: 0.5,
      timeScale: 1,
      showForceVectors: true
    }
  }
];

export function getExperimentById(id: string): ExperimentPreset | undefined {
  return EXPERIMENTS.find(exp => exp.id === id);
}
