import { PhysicsObjectDefinition } from '../types';

export const PHYSICS_OBJECTS: PhysicsObjectDefinition[] = [
  // ============ BASIC SHAPES ============
  {
    id: 'wooden_box',
    label: 'Wooden Box',
    category: 'basic',
    type: 'rectangle',
    width: 50,
    height: 50,
    options: {
      density: 0.0006,
      friction: 0.6,
      restitution: 0.3,
      frictionAir: 0.01,
      label: 'Wooden Box',
      render: { fillStyle: '#b45309', strokeStyle: '#92400e', lineWidth: 2 }
    },
    customData: { material: 'wood' }
  },
  {
    id: 'metal_box',
    label: 'Metal Box',
    category: 'basic',
    type: 'rectangle',
    width: 50,
    height: 50,
    options: {
      density: 0.0078,
      friction: 0.4,
      restitution: 0.1,
      frictionAir: 0.005,
      label: 'Metal Box',
      render: { fillStyle: '#64748b', strokeStyle: '#475569', lineWidth: 2 }
    },
    customData: { material: 'metal', isConductive: true }
  },
  {
    id: 'rubber_ball',
    label: 'Rubber Ball',
    category: 'basic',
    type: 'circle',
    radius: 20,
    options: {
      density: 0.0011,
      friction: 0.8,
      restitution: 0.9,
      frictionAir: 0.01,
      label: 'Rubber Ball',
      render: { fillStyle: '#1f2937', strokeStyle: '#111827', lineWidth: 2 }
    },
    customData: { material: 'rubber' }
  },
  {
    id: 'glass_marble',
    label: 'Glass Marble',
    category: 'basic',
    type: 'circle',
    radius: 15,
    options: {
      density: 0.0025,
      friction: 0.4,
      restitution: 0.7,
      frictionAir: 0.005,
      label: 'Glass Marble',
      render: { fillStyle: '#93c5fd', strokeStyle: '#60a5fa', lineWidth: 1, opacity: 0.85 }
    },
    customData: { material: 'glass' }
  },
  {
    id: 'basketball',
    label: 'Basketball',
    category: 'basic',
    type: 'circle',
    radius: 30,
    options: {
      density: 0.0008,
      friction: 0.7,
      restitution: 0.85,
      frictionAir: 0.015,
      label: 'Basketball',
      render: { fillStyle: '#f97316', strokeStyle: '#ea580c', lineWidth: 2 }
    },
    customData: { material: 'rubber' }
  },
  {
    id: 'bowling_ball',
    label: 'Bowling Ball',
    category: 'basic',
    type: 'circle',
    radius: 25,
    options: {
      density: 0.012,
      friction: 0.3,
      restitution: 0.05,
      frictionAir: 0.002,
      label: 'Bowling Ball',
      render: { fillStyle: '#0f172a', strokeStyle: '#1e293b', lineWidth: 2 }
    },
    customData: { material: 'plastic' }
  },
  {
    id: 'feather',
    label: 'Feather',
    category: 'basic',
    type: 'rectangle',
    width: 30,
    height: 8,
    options: {
      density: 0.00001,
      friction: 0.3,
      restitution: 0.1,
      frictionAir: 0.15,
      label: 'Feather',
      render: { fillStyle: '#f8fafc', strokeStyle: '#e2e8f0', lineWidth: 1 }
    }
  },
  {
    id: 'paper_sheet',
    label: 'Paper Sheet',
    category: 'basic',
    type: 'rectangle',
    width: 60,
    height: 80,
    options: {
      density: 0.00008,
      friction: 0.5,
      restitution: 0.05,
      frictionAir: 0.12,
      label: 'Paper Sheet',
      render: { fillStyle: '#fafafa', strokeStyle: '#e5e5e5', lineWidth: 1 }
    }
  },

  // ============ MATERIALS & SURFACES ============
  {
    id: 'ice_block',
    label: 'Ice Block',
    category: 'materials',
    type: 'rectangle',
    width: 100,
    height: 30,
    options: {
      isStatic: true,
      friction: 0.02,
      restitution: 0.2,
      label: 'Ice Block',
      render: { fillStyle: '#a5f3fc', strokeStyle: '#67e8f9', lineWidth: 2, opacity: 0.8 }
    },
    customData: { material: 'ice' }
  },
  {
    id: 'sandpaper_platform',
    label: 'Sandpaper',
    category: 'materials',
    type: 'rectangle',
    width: 200,
    height: 20,
    options: {
      isStatic: true,
      friction: 0.95,
      restitution: 0.1,
      label: 'Sandpaper',
      render: { fillStyle: '#ca8a04', strokeStyle: '#a16207', lineWidth: 2 }
    }
  },
  {
    id: 'trampoline',
    label: 'Trampoline',
    category: 'materials',
    type: 'rectangle',
    width: 150,
    height: 20,
    options: {
      isStatic: true,
      friction: 0.3,
      restitution: 1.2,
      label: 'Trampoline',
      render: { fillStyle: '#1e293b', strokeStyle: '#0f172a', lineWidth: 3 }
    }
  },
  {
    id: 'sticky_mat',
    label: 'Sticky Mat',
    category: 'materials',
    type: 'rectangle',
    width: 120,
    height: 15,
    options: {
      isStatic: true,
      friction: 1.5,
      restitution: 0.0,
      label: 'Sticky Mat',
      render: { fillStyle: '#22c55e', strokeStyle: '#16a34a', lineWidth: 2 }
    }
  },
  {
    id: 'oil_slick',
    label: 'Oil Slick',
    category: 'materials',
    type: 'rectangle',
    width: 180,
    height: 10,
    options: {
      isStatic: true,
      friction: 0.01,
      restitution: 0.0,
      label: 'Oil Slick',
      render: { fillStyle: '#1e1b4b', strokeStyle: '#312e81', lineWidth: 1, opacity: 0.7 }
    }
  },

  // ============ RAMPS & STRUCTURES ============
  {
    id: 'ramp_30',
    label: 'Ramp 30°',
    category: 'ramps',
    type: 'polygon',
    sides: 3,
    radius: 60,
    options: {
      isStatic: true,
      friction: 0.5,
      restitution: 0.2,
      label: 'Ramp 30°',
      render: { fillStyle: '#78716c', strokeStyle: '#57534e', lineWidth: 2 }
    }
  },
  {
    id: 'ramp_45',
    label: 'Ramp 45°',
    category: 'ramps',
    type: 'polygon',
    sides: 3,
    radius: 70,
    options: {
      isStatic: true,
      friction: 0.5,
      restitution: 0.2,
      label: 'Ramp 45°',
      render: { fillStyle: '#78716c', strokeStyle: '#57534e', lineWidth: 2 }
    }
  },
  {
    id: 'ramp_60',
    label: 'Ramp 60°',
    category: 'ramps',
    type: 'polygon',
    sides: 3,
    radius: 80,
    options: {
      isStatic: true,
      friction: 0.5,
      restitution: 0.2,
      label: 'Ramp 60°',
      render: { fillStyle: '#78716c', strokeStyle: '#57534e', lineWidth: 2 }
    }
  },
  {
    id: 'metal_ramp',
    label: 'Metal Ramp',
    category: 'ramps',
    type: 'polygon',
    sides: 3,
    radius: 65,
    options: {
      isStatic: true,
      friction: 0.3,
      restitution: 0.1,
      label: 'Metal Ramp',
      render: { fillStyle: '#64748b', strokeStyle: '#475569', lineWidth: 2 }
    },
    customData: { material: 'metal', isConductive: true }
  },
  {
    id: 'platform_small',
    label: 'Platform S',
    category: 'ramps',
    type: 'rectangle',
    width: 100,
    height: 15,
    options: {
      isStatic: true,
      friction: 0.6,
      restitution: 0.2,
      label: 'Platform',
      render: { fillStyle: '#78716c', strokeStyle: '#57534e', lineWidth: 2 }
    }
  },
  {
    id: 'platform_medium',
    label: 'Platform M',
    category: 'ramps',
    type: 'rectangle',
    width: 200,
    height: 15,
    options: {
      isStatic: true,
      friction: 0.6,
      restitution: 0.2,
      label: 'Platform',
      render: { fillStyle: '#78716c', strokeStyle: '#57534e', lineWidth: 2 }
    }
  },
  {
    id: 'platform_large',
    label: 'Platform L',
    category: 'ramps',
    type: 'rectangle',
    width: 300,
    height: 15,
    options: {
      isStatic: true,
      friction: 0.6,
      restitution: 0.2,
      label: 'Platform',
      render: { fillStyle: '#78716c', strokeStyle: '#57534e', lineWidth: 2 }
    }
  },
  {
    id: 'wall_block',
    label: 'Wall Block',
    category: 'ramps',
    type: 'rectangle',
    width: 30,
    height: 100,
    options: {
      isStatic: true,
      friction: 0.6,
      restitution: 0.2,
      label: 'Wall',
      render: { fillStyle: '#334155', strokeStyle: '#1e293b', lineWidth: 2 }
    }
  },
  {
    id: 'domino',
    label: 'Domino',
    category: 'ramps',
    type: 'rectangle',
    width: 10,
    height: 50,
    options: {
      density: 0.002,
      friction: 0.3,
      restitution: 0.4,
      frictionAir: 0.01,
      label: 'Domino',
      render: { fillStyle: '#f1f5f9', strokeStyle: '#e2e8f0', lineWidth: 1 }
    }
  },

  // ============ SPRINGS & CONNECTORS ============
  {
    id: 'spring_anchor',
    label: 'Spring Anchor',
    category: 'springs',
    type: 'circle',
    radius: 12,
    options: {
      isStatic: true,
      label: 'Spring Anchor',
      render: { fillStyle: '#fbbf24', strokeStyle: '#f59e0b', lineWidth: 3 }
    },
    customData: { springStiffness: 0.05, springDamping: 0.1 }
  },
  {
    id: 'spring_weight',
    label: 'Spring Weight',
    category: 'springs',
    type: 'circle',
    radius: 20,
    options: {
      density: 0.005,
      friction: 0.3,
      restitution: 0.3,
      label: 'Spring Weight',
      render: { fillStyle: '#dc2626', strokeStyle: '#b91c1c', lineWidth: 2 }
    }
  },
  {
    id: 'pendulum_bob',
    label: 'Pendulum Bob',
    category: 'springs',
    type: 'circle',
    radius: 20,
    options: {
      density: 0.004,
      friction: 0.1,
      restitution: 0.3,
      frictionAir: 0.002,
      label: 'Pendulum Bob',
      render: { fillStyle: '#7c3aed', strokeStyle: '#6d28d9', lineWidth: 2 }
    }
  },
  {
    id: 'rope_anchor',
    label: 'Rope Anchor',
    category: 'springs',
    type: 'circle',
    radius: 10,
    options: {
      isStatic: true,
      label: 'Rope Anchor',
      render: { fillStyle: '#92400e', strokeStyle: '#78350f', lineWidth: 2 }
    }
  },

  // ============ COMPLEX OBJECTS ============
  {
    id: 'wheel',
    label: 'Wheel',
    category: 'complex',
    type: 'circle',
    radius: 25,
    options: {
      density: 0.002,
      friction: 0.9,
      restitution: 0.2,
      frictionAir: 0.005,
      label: 'Wheel',
      render: { fillStyle: '#1e293b', strokeStyle: '#0f172a', lineWidth: 3 }
    }
  },
  {
    id: 'gear',
    label: 'Gear',
    category: 'complex',
    type: 'polygon',
    sides: 8,
    radius: 25,
    options: {
      density: 0.003,
      friction: 0.8,
      restitution: 0.1,
      label: 'Gear',
      render: { fillStyle: '#64748b', strokeStyle: '#475569', lineWidth: 2 }
    },
    customData: { material: 'metal' }
  },
  {
    id: 'cradle_ball',
    label: "Cradle Ball",
    category: 'complex',
    type: 'circle',
    radius: 18,
    options: {
      density: 0.006,
      friction: 0.01,
      restitution: 0.98,
      frictionAir: 0.0001,
      label: 'Cradle Ball',
      render: { fillStyle: '#a1a1aa', strokeStyle: '#71717a', lineWidth: 2 }
    },
    customData: { material: 'metal' }
  },
  {
    id: 'lever_beam',
    label: 'Lever Beam',
    category: 'complex',
    type: 'rectangle',
    width: 200,
    height: 12,
    options: {
      density: 0.001,
      friction: 0.5,
      restitution: 0.2,
      label: 'Lever Beam',
      render: { fillStyle: '#b45309', strokeStyle: '#92400e', lineWidth: 2 }
    },
    customData: { material: 'wood' }
  },
  {
    id: 'fulcrum',
    label: 'Fulcrum',
    category: 'complex',
    type: 'polygon',
    sides: 3,
    radius: 20,
    options: {
      isStatic: true,
      friction: 0.8,
      label: 'Fulcrum',
      render: { fillStyle: '#78716c', strokeStyle: '#57534e', lineWidth: 2 }
    }
  },

  // ============ FORCE EMITTERS ============
  {
    id: 'fan',
    label: 'Fan',
    category: 'forces',
    type: 'rectangle',
    width: 60,
    height: 40,
    options: {
      isStatic: true,
      isSensor: true,
      label: 'Fan',
      render: { fillStyle: '#3b82f6', strokeStyle: '#2563eb', lineWidth: 2 }
    },
    customData: { emitterType: 'fan', emitterStrength: 0.005, emitterDirection: -90 }
  },
  {
    id: 'magnet',
    label: 'Magnet',
    category: 'forces',
    type: 'rectangle',
    width: 40,
    height: 50,
    options: {
      isStatic: true,
      label: 'Magnet',
      render: { fillStyle: '#dc2626', strokeStyle: '#b91c1c', lineWidth: 2 }
    },
    customData: { emitterType: 'magnet', emitterStrength: 0.0001 }
  },
  {
    id: 'gravity_well',
    label: 'Gravity Well',
    category: 'forces',
    type: 'circle',
    radius: 30,
    options: {
      isStatic: true,
      isSensor: true,
      label: 'Gravity Well',
      render: { fillStyle: '#7c3aed', strokeStyle: '#6d28d9', lineWidth: 3, opacity: 0.6 }
    },
    customData: { emitterType: 'gravity_well', emitterStrength: 0.00005 }
  },
  {
    id: 'rocket_thruster',
    label: 'Rocket',
    category: 'forces',
    type: 'rectangle',
    width: 20,
    height: 40,
    options: {
      density: 0.002,
      friction: 0.4,
      restitution: 0.2,
      label: 'Rocket',
      render: { fillStyle: '#ef4444', strokeStyle: '#dc2626', lineWidth: 2 }
    },
    customData: { emitterType: 'rocket', emitterStrength: 0.015, emitterDirection: -90 }
  },

  // ============ MEASUREMENT TOOLS ============
  {
    id: 'energy_meter',
    label: 'Energy Meter',
    category: 'tools',
    type: 'rectangle',
    width: 80,
    height: 60,
    options: {
      isStatic: true,
      isSensor: true,
      label: 'Energy Meter',
      render: { fillStyle: '#059669', strokeStyle: '#047857', lineWidth: 2, opacity: 0.5 }
    }
  },
  {
    id: 'velocity_sensor',
    label: 'Speed Gate',
    category: 'tools',
    type: 'rectangle',
    width: 10,
    height: 100,
    options: {
      isStatic: true,
      isSensor: true,
      label: 'Speed Gate',
      render: { fillStyle: '#f59e0b', strokeStyle: '#d97706', lineWidth: 2, opacity: 0.5 }
    }
  }
];

export const OBJECT_CATEGORIES: { id: string; label: string; icon: string; color: string }[] = [
  { id: 'basic', label: 'Basic Shapes', icon: 'Box', color: '#f59e0b' },
  { id: 'materials', label: 'Materials & Surfaces', icon: 'Layers', color: '#06b6d4' },
  { id: 'ramps', label: 'Ramps & Structures', icon: 'Triangle', color: '#78716c' },
  { id: 'springs', label: 'Springs & Connectors', icon: 'Link', color: '#fbbf24' },
  { id: 'complex', label: 'Complex Objects', icon: 'Settings', color: '#8b5cf6' },
  { id: 'forces', label: 'Force Emitters', icon: 'Zap', color: '#ef4444' },
  { id: 'tools', label: 'Measurement Tools', icon: 'Ruler', color: '#10b981' }
];

export function getObjectById(id: string): PhysicsObjectDefinition | undefined {
  return PHYSICS_OBJECTS.find(obj => obj.id === id);
}

export function getObjectsByCategory(category: string): PhysicsObjectDefinition[] {
  return PHYSICS_OBJECTS.filter(obj => obj.category === category);
}
