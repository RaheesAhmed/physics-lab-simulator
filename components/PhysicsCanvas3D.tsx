import React, { useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, PerspectiveCamera } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ToolType, PhysicsObjectDefinition, SceneObject, PhysicsState, VisualizationSettings, GraphDataPoint } from '../types';

interface PhysicsCanvas3DProps {
  tool: ToolType;
  isPaused: boolean;
  gravityScale: number;
  timeScale: number;
  visualization: VisualizationSettings;
  selectedObjectId: string | null;
  onObjectSelect: (object: SceneObject | null) => void;
  onPhysicsUpdate: (state: PhysicsState | null) => void;
  onGraphDataUpdate: (data: GraphDataPoint) => void;
}

interface Object3DData {
  id: string;
  position: [number, number, number];
  shape: 'box' | 'sphere' | 'cylinder';
  size: [number, number, number];
  color: string;
  mass: number;
  restitution: number;
  friction: number;
}

function PhysicsObject({ 
  data, 
  isSelected, 
  onClick 
}: { 
  data: Object3DData; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  
  const getMesh = () => {
    const material = (
      <meshStandardMaterial 
        color={data.color} 
        roughness={0.3} 
        metalness={0.2}
        emissive={isSelected ? '#6366f1' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    );
    
    if (data.shape === 'sphere') {
      return (
        <mesh onClick={onClick} castShadow receiveShadow>
          <sphereGeometry args={[data.size[0] / 2, 32, 32]} />
          {material}
        </mesh>
      );
    }
    
    if (data.shape === 'cylinder') {
      return (
        <mesh onClick={onClick} castShadow receiveShadow>
          <cylinderGeometry args={[data.size[0] / 2, data.size[0] / 2, data.size[1], 32]} />
          {material}
        </mesh>
      );
    }
    
    return (
      <mesh onClick={onClick} castShadow receiveShadow>
        <boxGeometry args={data.size} />
        {material}
      </mesh>
    );
  };
  
  return (
    <RigidBody 
      ref={rigidBodyRef}
      position={data.position}
      restitution={data.restitution}
      friction={data.friction}
      mass={data.mass}
      colliders={data.shape === 'sphere' ? 'ball' : data.shape === 'cylinder' ? 'hull' : 'cuboid'}
    >
      {getMesh()}
    </RigidBody>
  );
}

function Ground() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[50, 0.5, 50]} position={[0, -0.5, 0]} />
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </RigidBody>
  );
}

function Scene({ 
  objects, 
  selectedId, 
  onSelectObject,
  gravity,
  isPaused,
  showGrid
}: { 
  objects: Object3DData[];
  selectedId: string | null;
  onSelectObject: (id: string) => void;
  gravity: number;
  isPaused: boolean;
  showGrid: boolean;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} />
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
        maxPolarAngle={Math.PI * 0.48}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[20, 30, 10]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />
      
      <Environment preset="city" background={false} />
      
      {showGrid && (
        <Grid 
          args={[100, 100]} 
          position={[0, 0.01, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#334155"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#475569"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
        />
      )}
      
      <Physics 
        gravity={[0, -gravity * 9.81, 0]}
        paused={isPaused}
        timeStep={1/60}
      >
        <Ground />
        
        {objects.map((obj) => (
          <PhysicsObject
            key={obj.id}
            data={obj}
            isSelected={selectedId === obj.id}
            onClick={() => onSelectObject(obj.id)}
          />
        ))}
      </Physics>
      
      <fog attach="fog" args={['#070b14', 30, 80]} />
    </>
  );
}

const PhysicsCanvas3D: React.FC<PhysicsCanvas3DProps> = ({
  tool,
  isPaused,
  gravityScale,
  timeScale,
  visualization,
  selectedObjectId,
  onObjectSelect,
  onPhysicsUpdate,
  onGraphDataUpdate
}) => {
  const [objects, setObjects] = useState<Object3DData[]>([]);
  const objectIdCounter = useRef(0);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = e.dataTransfer.getData('application/json');
      const definition = JSON.parse(data) as PhysicsObjectDefinition;
      
      const newObject: Object3DData = {
        id: `obj_${objectIdCounter.current++}`,
        position: [
          (Math.random() - 0.5) * 10,
          5 + Math.random() * 3,
          (Math.random() - 0.5) * 10
        ],
        shape: definition.type === 'circle' ? 'sphere' : 'box',
        size: [
          (definition.width || definition.radius || 50) / 50,
          (definition.height || definition.radius || 50) / 50,
          (definition.width || definition.radius || 50) / 50
        ],
        color: definition.options.render?.fillStyle || '#6366f1',
        mass: (definition.options.density || 0.001) * 1000,
        restitution: definition.options.restitution || 0.5,
        friction: definition.options.friction || 0.5
      };
      
      setObjects(prev => [...prev, newObject]);
    } catch (err) {
      console.error('Failed to create 3D object:', err);
    }
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);
  
  const handleSelectObject = useCallback((id: string) => {
    const obj = objects.find(o => o.id === id);
    if (obj && tool === ToolType.POINTER) {
      onObjectSelect({
        id: obj.id,
        definitionId: 'custom',
        body: null as any,
        initialPosition: { x: obj.position[0], y: obj.position[1] },
        initialAngle: 0,
        customData: {},
        createdAt: Date.now()
      });
    }
  }, [objects, onObjectSelect, tool]);
  
  return (
    <div 
      className="canvas-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ background: '#070b14' }}
    >
      <Canvas shadows>
        <color attach="background" args={['#070b14']} />
        <Scene
          objects={objects}
          selectedId={selectedObjectId}
          onSelectObject={handleSelectObject}
          gravity={gravityScale}
          isPaused={isPaused}
          showGrid={visualization.showGrid}
        />
      </Canvas>
      
      <div className="canvas-helper">
        <p className="title">3D Physics Lab</p>
        <p className="subtitle">Drag objects • Orbit with mouse • Scroll to zoom</p>
      </div>
    </div>
  );
};

export default PhysicsCanvas3D;
