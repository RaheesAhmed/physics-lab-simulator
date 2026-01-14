export interface CelestialBodyConfig {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon' | 'dwarf' | 'blackhole';
  radius: number; // In relative units (Earth = 1 usually, but scaled for vis)
  distance: number; // Distance from parent (AU or relative)
  period: number; // Orbital period in Earth years
  rotationPeriod: number; // Rotation period in Earth days
  color: string;
  texture?: string;
  rings?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
  };
  orbitColor?: string;
  description: string;
}

// Simplified data for visualization (distances scaled down for viewability)
// Real scale: Sun radius ~109 Earths. Distance Earth-Sun ~11,700 Earth diameters.
// Lab Scale: Sun = 5 units. Earth = 0.5 units at 20 distance.

export const solarSystemData: CelestialBodyConfig[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'star',
    radius: 8,
    distance: 0,
    period: 0,
    rotationPeriod: 25,
    color: '#fbbf24',
    description: 'The star at the center of our Solar System.'
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'planet',
    radius: 0.8,
    distance: 12,
    period: 0.24,
    rotationPeriod: 58.6,
    color: '#a3a3a3',
    orbitColor: '#525252',
    description: 'The smallest planet in the Solar System and closest to the Sun.'
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'planet',
    radius: 1.8,
    distance: 18,
    period: 0.62,
    rotationPeriod: -243, // Retrograde
    color: '#e2e8f0',
    orbitColor: '#94a3b8',
    description: 'Second planet from the Sun, mostly carbon dioxide atmosphere.'
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'planet',
    radius: 2,
    distance: 26,
    period: 1,
    rotationPeriod: 1,
    color: '#3b82f6',
    orbitColor: '#1e40af',
    description: 'Our home planet, the only known celestial body to support life.'
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'planet',
    radius: 1.2,
    distance: 36,
    period: 1.88,
    rotationPeriod: 1.03,
    color: '#ef4444',
    orbitColor: '#991b1b',
    description: 'The Red Planet, home to the largest volcano in the solar system.'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'planet',
    radius: 5.5,
    distance: 60,
    period: 11.86,
    rotationPeriod: 0.41,
    color: '#d97706',
    orbitColor: '#b45309',
    description: 'The largest planet in the Solar System, a gas giant.'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'planet',
    radius: 4.8,
    distance: 90,
    period: 29.45,
    rotationPeriod: 0.45,
    color: '#fcd34d',
    orbitColor: '#d97706',
    rings: {
      innerRadius: 6,
      outerRadius: 10,
      color: '#fef3c7'
    },
    description: 'Known for its prominent ring system.'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'planet',
    radius: 3.5,
    distance: 130,
    period: 84,
    rotationPeriod: -0.72,
    color: '#22d3ee',
    orbitColor: '#0891b2',
    description: 'An ice giant with a tilted axis of rotation.'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'planet',
    radius: 3.4,
    distance: 170,
    period: 164.8,
    rotationPeriod: 0.67,
    color: '#3b82f6',
    orbitColor: '#1d4ed8',
    description: 'The farthest known planet from the Sun.'
  }
];

export const galaxyData = {
  starCount: 5000,
  spiralArms: 2,
  armThickness: 0.2, // 0 to 1
  coreRadius: 5,
  galaxyRadius: 50,
  colors: ['#ffffff', '#bfdbfe', '#fef3c7', '#fecaca']
};
