import { Body, Constraint } from 'matter-js';

export enum ToolType {
  POINTER = 'POINTER',
  CONSTRAINT = 'CONSTRAINT',
  ERASER = 'ERASER',
  PIN = 'PIN',
  ROTATE = 'ROTATE',
  RESIZE = 'RESIZE'
}

export type ObjectCategory = 
  | 'basic' 
  | 'materials' 
  | 'ramps' 
  | 'springs' 
  | 'complex' 
  | 'forces' 
  | 'tools' 
  | 'fluids';

export type ShapeType = 'rectangle' | 'circle' | 'polygon' | 'trapezoid' | 'compound';

export type ConstraintType = 'pin' | 'hinge' | 'spring' | 'rope' | 'slider' | 'weld';

export interface MaterialPreset {
  name: string;
  density: number;
  friction: number;
  restitution: number;
  frictionAir: number;
  color: string;
}

export interface PhysicsObjectDefinition {
  id: string;
  label: string;
  category: ObjectCategory;
  type: ShapeType;
  width?: number;
  height?: number;
  radius?: number;
  sides?: number;
  vertices?: { x: number; y: number }[];
  options: {
    density?: number;
    friction?: number;
    frictionAir?: number;
    frictionStatic?: number;
    restitution?: number;
    isStatic?: boolean;
    isSensor?: boolean;
    mass?: number;
    label?: string;
    render?: {
      fillStyle?: string;
      strokeStyle?: string;
      lineWidth?: number;
      opacity?: number;
      sprite?: { texture: string; xScale?: number; yScale?: number };
      visible?: boolean;
    };
  };
  customData?: {
    material?: string;
    isMagnetic?: boolean;
    isConductive?: boolean;
    emitterType?: 'fan' | 'magnet' | 'gravity_well' | 'wind' | 'rocket';
    emitterStrength?: number;
    emitterDirection?: number;
    springStiffness?: number;
    springDamping?: number;
  };
}

export interface SceneObject {
  id: string;
  definitionId: string;
  body: Body;
  initialPosition: { x: number; y: number };
  initialAngle: number;
  customData: Record<string, unknown>;
  createdAt: number;
}

export interface SceneConstraint {
  id: string;
  constraint: Constraint;
  type: ConstraintType;
  bodyAId?: string;
  bodyBId?: string;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsState {
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  angle: number;
  angularVelocity: number;
  force: Vector2D;
  mass: number;
  speed: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
  momentum: Vector2D;
}

export interface GraphDataPoint {
  time: number;
  positionX?: number;
  positionY?: number;
  velocityX?: number;
  velocityY?: number;
  speed?: number;
  accelerationX?: number;
  accelerationY?: number;
  kineticEnergy?: number;
  potentialEnergy?: number;
  totalEnergy?: number;
}

export interface MeasurementData {
  type: 'distance' | 'angle' | 'time' | 'velocity' | 'force' | 'energy';
  value: number;
  unit: string;
  label?: string;
}

export interface ExperimentPreset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  objects: Array<{
    definitionId: string;
    x: number;
    y: number;
    angle?: number;
    velocity?: Vector2D;
    isStatic?: boolean;
  }>;
  constraints: Array<{
    type: ConstraintType;
    objectAIndex: number;
    objectBIndex?: number;
    pointA?: Vector2D;
    pointB?: Vector2D;
    length?: number;
    stiffness?: number;
  }>;
  measurements?: Array<{
    type: 'ruler' | 'protractor' | 'energy_display';
    position: Vector2D;
    targetObjectIndex?: number;
  }>;
  initialSettings?: {
    gravity?: number;
    timeScale?: number;
    showVelocityVectors?: boolean;
    showForceVectors?: boolean;
    showMotionTrails?: boolean;
  };
}

export interface VisualizationSettings {
  showGrid: boolean;
  showVelocityVectors: boolean;
  showForceVectors: boolean;
  showEnergyColors: boolean;
  showCollisionPoints: boolean;
  showMeasurements: boolean;
  showConstraints: boolean;
  showMotionTrails: boolean;
  showTrajectoryPrediction: boolean;
}

export interface TimeSettings {
  isPaused: boolean;
  timeScale: number;
  frameByFrame: boolean;
}

export interface CameraSettings {
  zoom: number;
  panX: number;
  panY: number;
  followObjectId: string | null;
}

export interface SceneState {
  objects: SceneObject[];
  constraints: SceneConstraint[];
  selectedObjectId: string | null;
  visualization: VisualizationSettings;
  time: TimeSettings;
  camera: CameraSettings;
  gravity: number;
  graphData: GraphDataPoint[];
}

export interface UndoAction {
  type: 'add_object' | 'remove_object' | 'move_object' | 'modify_property' | 'add_constraint' | 'remove_constraint';
  data: unknown;
  timestamp: number;
}

export interface SavedScene {
  id: string;
  name: string;
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
  sceneData: string;
}
