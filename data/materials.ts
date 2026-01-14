import { MaterialPreset } from '../types';

export const MATERIAL_PRESETS: Record<string, MaterialPreset> = {
  wood: {
    name: 'Wood',
    density: 0.0006,
    friction: 0.6,
    restitution: 0.3,
    frictionAir: 0.01,
    color: '#b45309'
  },
  metal: {
    name: 'Metal',
    density: 0.0078,
    friction: 0.4,
    restitution: 0.1,
    frictionAir: 0.005,
    color: '#64748b'
  },
  rubber: {
    name: 'Rubber',
    density: 0.0011,
    friction: 0.8,
    restitution: 0.9,
    frictionAir: 0.01,
    color: '#1f2937'
  },
  glass: {
    name: 'Glass',
    density: 0.0025,
    friction: 0.4,
    restitution: 0.5,
    frictionAir: 0.005,
    color: '#93c5fd'
  },
  ice: {
    name: 'Ice',
    density: 0.0009,
    friction: 0.05,
    restitution: 0.2,
    frictionAir: 0.002,
    color: '#a5f3fc'
  },
  rock: {
    name: 'Rock',
    density: 0.0027,
    friction: 0.7,
    restitution: 0.2,
    frictionAir: 0.005,
    color: '#78716c'
  },
  plastic: {
    name: 'Plastic',
    density: 0.001,
    friction: 0.5,
    restitution: 0.4,
    frictionAir: 0.01,
    color: '#f472b6'
  },
  cork: {
    name: 'Cork',
    density: 0.00024,
    friction: 0.6,
    restitution: 0.5,
    frictionAir: 0.02,
    color: '#d6d3d1'
  },
  foam: {
    name: 'Foam',
    density: 0.00003,
    friction: 0.8,
    restitution: 0.1,
    frictionAir: 0.08,
    color: '#fef3c7'
  },
  concrete: {
    name: 'Concrete',
    density: 0.0024,
    friction: 0.9,
    restitution: 0.1,
    frictionAir: 0.002,
    color: '#9ca3af'
  }
};

export function getMaterialByName(name: string): MaterialPreset | undefined {
  return MATERIAL_PRESETS[name.toLowerCase()];
}

export function applyMaterial(material: MaterialPreset) {
  return {
    density: material.density,
    friction: material.friction,
    restitution: material.restitution,
    frictionAir: material.frictionAir,
    render: { fillStyle: material.color }
  };
}
