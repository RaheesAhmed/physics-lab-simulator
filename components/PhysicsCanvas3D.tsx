import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, PerspectiveCamera } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { ToolType, PhysicsObjectDefinition, SceneObject, PhysicsState, VisualizationSettings, GraphDataPoint } from '../types';
import { getExperimentById } from '../data/experiments';
import { getObjectById } from '../data/objects';

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

export interface PhysicsCanvas3DRef {
  deleteSelected: () => void;
  clear: () => void;
  reset: () => void;
  resetSelected: () => void;
  loadExperiment: (experimentId: string) => void;
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
  definitionId: string;
  label: string;
  isStatic: boolean;
}

import { useThree } from '@react-three/fiber';

interface PhysicsObjectProps {
  data: Object3DData;
  isSelected: boolean;
  onClick: () => void;
  onPhysicsUpdate: (pos: THREE.Vector3, vel: THREE.Vector3, mass: number) => void;
  setOrbitEnabled: (enabled: boolean) => void;
}

function PhysicsObject({ data, isSelected, onClick, onPhysicsUpdate, setOrbitEnabled }: PhysicsObjectProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const planeIntersectPoint = useRef(new THREE.Vector3());
  const { camera, raycaster, gl } = useThree();
  
  useFrame(() => {
    if (rigidBodyRef.current) {
      if (isDragging) {
        // Drag logic handled in pointer move, but we can verify position here?
        // Actually, let's keep it simple: if dragging, don't update physics state for UI yet
      } else if (isSelected) {
        const pos = rigidBodyRef.current.translation();
        const vel = rigidBodyRef.current.linvel();
        onPhysicsUpdate(
          new THREE.Vector3(pos.x, pos.y, pos.z),
          new THREE.Vector3(vel.x, vel.y, vel.z),
          data.mass
        );
      }
    }
  });


  
  // Real implementation of drag using event data
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setOrbitEnabled(false);
    onClick();
    
    if (rigidBodyRef.current) {
        rigidBodyRef.current.setBodyType(2, true); // KinematicPositionBased
    }
  };
  
  const handlePointerUp = (e: any) => {
    setIsDragging(false);
    setOrbitEnabled(true);
    if (rigidBodyRef.current) {
        const targetType = data.isStatic ? 1 : 0; // 1 = Fixed, 0 = Dynamic
        rigidBodyRef.current.setBodyType(targetType, true);
        rigidBodyRef.current.wakeUp();
    }
  };
  
  // We need to use useFrame to update position during drag because onPointerMove is only on the mesh surface, 
  // and if we move fast we leave the mesh.
  // Instead, we attach a "global" pointer move listener when dragging? 
  // Or use global raycaster in useFrame?
  
  useFrame((state) => {
    if (isDragging && rigidBodyRef.current) {
        // Raycast against a mathematical plane at the capture depth
        // Let's use a plane passing through the object's center, facing the camera?
        // Or just the XZ plane for "sliding" bodies?
        // User asked to "throw" it.
        
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Ground plane
        // Actually, let's make the plane height dynamic based on where grasp happened?
        // For simplicity: Drag moves object at fixed height Y=5 (floating) or current height.
        
        const target = new THREE.Vector3(); 
        state.raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -rigidBodyRef.current.translation().y), target);
        
        if (target) {
            const nextPos = { x: target.x, y: rigidBodyRef.current.translation().y, z: target.z };
            
            // Calculate velocity for throw
            const currentPos = rigidBodyRef.current.translation();
            // We set next translation, Rapier computes velocity for us if using KinematicPositionBased
            rigidBodyRef.current.setNextKinematicTranslation(nextPos);
        }
    }
  });

  const getMesh = () => {
    const material = (
      <meshStandardMaterial 
        color={data.color} 
        roughness={0.3} 
        metalness={0.2}
        emissive={isSelected ? '#6366f1' : '#000000'}
        emissiveIntensity={isSelected ? 0.4 : 0}
      />
    );
    
    const meshProps = {
        castShadow: true,
        receiveShadow: true,
        // Using built-in pointer events on the mesh
        onPointerDown: handlePointerDown,
        onPointerUp: handlePointerUp,
        // We handle move in useFrame + global raycaster
    };
    
    if (data.shape === 'sphere') {
      return (
        <mesh {...meshProps}>
          <sphereGeometry args={[data.size[0] / 2, 32, 32]} />
          {material}
        </mesh>
      );
    }
    
    if (data.shape === 'cylinder') {
      return (
        <mesh {...meshProps}>
          <cylinderGeometry args={[data.size[0] / 2, data.size[0] / 2, data.size[1], 32]} />
          {material}
        </mesh>
      );
    }
    
    return (
      <mesh {...meshProps}>
        <boxGeometry args={data.size} />
        {material}
      </mesh>
    );
  };
  
  return (
    <RigidBody 
      ref={rigidBodyRef}
      type={data.isStatic ? 'fixed' : 'dynamic'}
      position={data.position}
      restitution={data.restitution}
      friction={data.friction}
      mass={data.mass}
      colliders={data.shape === 'sphere' ? 'ball' : data.shape === 'cylinder' ? 'hull' : 'cuboid'}
      // Need to listen to pointer up globally in case mouse leaves object?
      // React Three Fiber's event system handles capture? 
      // Safest is to attach window listener for up if dragging?
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

interface SceneProps {
  objects: Object3DData[];
  selectedId: string | null;
  onSelectObject: (id: string) => void;
  onDeselectObject: () => void;
  onPhysicsUpdate: (id: string, pos: THREE.Vector3, vel: THREE.Vector3, mass: number) => void;
  gravity: number;
  isPaused: boolean;
  showGrid: boolean;
  orbitEnabled: boolean;
  setOrbitEnabled: (enabled: boolean) => void;
}

function Scene({ objects, selectedId, onSelectObject, onDeselectObject, onPhysicsUpdate, gravity, isPaused, showGrid, orbitEnabled, setOrbitEnabled }: SceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={50} />
      <OrbitControls 
        enabled={orbitEnabled}
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
        
        <mesh onClick={onDeselectObject} visible={false}>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        {objects.map((obj) => (
          <PhysicsObject
            key={obj.id}
            data={obj}
            isSelected={selectedId === obj.id}
            onClick={() => onSelectObject(obj.id)}
            onPhysicsUpdate={(pos, vel, mass) => onPhysicsUpdate(obj.id, pos, vel, mass)}
            setOrbitEnabled={setOrbitEnabled}
          />
        ))}
      </Physics>
      
      <fog attach="fog" args={['#070b14', 30, 80]} />
    </>
  );
}

// Camera helper for Physics Scene
function PhysicsCamera() {
  const { camera } = useThree();
  
  React.useEffect(() => {
    // Reset camera when entering Physics Mode
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
  }, []);
  
  return null;
}

const PhysicsScene3D = forwardRef<PhysicsCanvas3DRef, PhysicsCanvas3DProps>(({
  tool,
  isPaused,
  gravityScale,
  visualization,
  selectedObjectId,
  onObjectSelect,
  onPhysicsUpdate,
  onGraphDataUpdate
}, ref) => {
  const [objects, setObjects] = useState<Object3DData[]>([]);
  const [sceneKey, setSceneKey] = useState(0);
  const objectIdCounter = useRef(0);
  const startTimeRef = useRef(Date.now());
  const selectedIdRef = useRef<string | null>(null);
  const initialPositionsRef = useRef<Map<string, [number, number, number]>>(new Map());
  
  selectedIdRef.current = selectedObjectId;
  
  useImperativeHandle(ref, () => ({
    deleteSelected: () => {
      const selId = selectedIdRef.current;
      if (selId) {
        setObjects(prev => prev.filter(obj => obj.id !== selId));
        initialPositionsRef.current.delete(selId);
        onObjectSelect(null);
        onPhysicsUpdate(null);
      }
    },
    clear: () => {
      setObjects([]);
      initialPositionsRef.current.clear();
      onObjectSelect(null);
      onPhysicsUpdate(null);
      setSceneKey(k => k + 1);
    },
    reset: () => {
      setObjects(prev => prev.map(obj => {
        const initialPos = initialPositionsRef.current.get(obj.id);
        if (initialPos) {
          return { ...obj, position: initialPos };
        }
        return obj;
      }));
      setSceneKey(k => k + 1);
    },
    resetSelected: () => {
      const selId = selectedIdRef.current;
      if (selId) {
        const initialPos = initialPositionsRef.current.get(selId);
        if (initialPos) {
          setObjects(prev => prev.map(obj => 
            obj.id === selId ? { ...obj, position: initialPos } : obj
          ));
          setSceneKey(k => k + 1);
        }
      }
    },
    loadExperiment: (experimentId: string) => {
      const experiment = getExperimentById(experimentId);
      if (!experiment) return;
      
      setObjects([]);
      initialPositionsRef.current.clear();
      onObjectSelect(null);
      onPhysicsUpdate(null);
      
      const newObjects: Object3DData[] = [];
      
      experiment.objects.forEach((objConfig, index) => {
        const definition = getObjectById(objConfig.definitionId);
        if (!definition) return;
        
        const position: [number, number, number] = [
          (objConfig.x - 400) / 50,
          (500 - objConfig.y) / 50 + 2,
          (index - experiment.objects.length / 2) * 1.5
        ];
        
        const newObject: Object3DData = {
          id: `exp_${objectIdCounter.current++}`,
          position: position,
          shape: definition.type === 'circle' ? 'sphere' : 'box',
          size: [
            (definition.width || definition.radius || 50) / 50,
            (definition.height || definition.radius || 50) / 50,
            (definition.width || definition.radius || 50) / 50
          ],
          color: definition.options.render?.fillStyle || '#6366f1',
          mass: Math.max(0.1, (definition.options.density || 0.001) * 500),
          restitution: definition.options.restitution || 0.5,
          friction: definition.options.friction || 0.5,
          definitionId: definition.id,
          label: definition.label,
          isStatic: definition.options.isStatic || false
        };
        
        newObjects.push(newObject);
        initialPositionsRef.current.set(newObject.id, [...newObject.position] as [number, number, number]);
      });
      
      setObjects(newObjects);
      setSceneKey(k => k + 1);
    }
  }), [onObjectSelect, onPhysicsUpdate]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;
      
      const definition = JSON.parse(data) as PhysicsObjectDefinition;
      
      const newObject: Object3DData = {
        id: `obj3d_${objectIdCounter.current++}`,
        position: [
          (Math.random() - 0.5) * 8,
          5 + Math.random() * 3,
          (Math.random() - 0.5) * 8
        ],
        shape: definition.type === 'circle' ? 'sphere' : 'box',
        size: [
          (definition.width || definition.radius || 50) / 50,
          (definition.height || definition.radius || 50) / 50,
          (definition.width || definition.radius || 50) / 50
        ],
        color: definition.options.render?.fillStyle || '#6366f1',
        mass: Math.max(0.1, (definition.options.density || 0.001) * 500),
        restitution: definition.options.restitution || 0.5,
        friction: definition.options.friction || 0.5,
        definitionId: definition.id,
        label: definition.label,
        isStatic: definition.options.isStatic || false
      };
      
      setObjects(prev => [...prev, newObject]);
      initialPositionsRef.current.set(newObject.id, [...newObject.position] as [number, number, number]);
      
      const sceneObj: SceneObject = {
        id: newObject.id,
        definitionId: newObject.definitionId,
        body: null as any,
        initialPosition: { x: newObject.position[0], y: newObject.position[1] },
        initialAngle: 0,
        customData: { label: newObject.label, color: newObject.color },
        createdAt: Date.now()
      };
      onObjectSelect(sceneObj);
      startTimeRef.current = Date.now();
    } catch (err) {
      console.error('Failed to create 3D object:', err);
    }
  }, [onObjectSelect]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);
  
  const handleSelectObject = useCallback((id: string) => {
    if (tool !== ToolType.POINTER) return;
    
    const obj = objects.find(o => o.id === id);
    if (obj) {
      const sceneObj: SceneObject = {
        id: obj.id,
        definitionId: obj.definitionId,
        body: null as any,
        initialPosition: { x: obj.position[0], y: obj.position[1] },
        initialAngle: 0,
        customData: { label: obj.label, color: obj.color },
        createdAt: Date.now()
      };
      onObjectSelect(sceneObj);
      startTimeRef.current = Date.now();
    }
  }, [objects, onObjectSelect, tool]);
  
  const handleDeselectObject = useCallback(() => {
    onObjectSelect(null);
    onPhysicsUpdate(null);
  }, [onObjectSelect, onPhysicsUpdate]);
  
  const handlePhysicsUpdate3D = useCallback((id: string, pos: THREE.Vector3, vel: THREE.Vector3, mass: number) => {
    if (selectedIdRef.current !== id) return;
    
    const speed = vel.length();
    const kineticEnergy = 0.5 * mass * speed * speed;
    const potentialEnergy = mass * gravityScale * 9.81 * Math.max(0, pos.y);
    
    const state: PhysicsState = {
      position: { x: pos.x, y: pos.y },
      velocity: { x: vel.x, y: vel.y },
      acceleration: { x: 0, y: -gravityScale * 9.81 },
      angle: 0,
      angularVelocity: 0,
      force: { x: 0, y: -mass * gravityScale * 9.81 },
      mass: mass,
      speed: speed,
      kineticEnergy: kineticEnergy,
      potentialEnergy: potentialEnergy,
      totalEnergy: kineticEnergy + potentialEnergy,
      momentum: { x: mass * vel.x, y: mass * vel.y }
    };
    
    onPhysicsUpdate(state);
    
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    onGraphDataUpdate({
      time: elapsed,
      positionX: pos.x,
      positionY: pos.y,
      velocityX: vel.x,
      velocityY: vel.y,
      speed: speed,
      kineticEnergy: kineticEnergy,
      potentialEnergy: potentialEnergy,
      totalEnergy: kineticEnergy + potentialEnergy
    });
  }, [gravityScale, onPhysicsUpdate, onGraphDataUpdate]);
  
  const [orbitEnabled, setOrbitEnabled] = useState(true);

  // We attach the drop handler to a full-screen div Overlay inside the canvas? 
  // No, the canvas parent (in App.tsx) should handle Drop if we want it to work easily.
  // BUT: The drop handler needs access to `setObjects` which is HERE.
  // One way: App.tsx handles drop and calls a method on this ref to adding object.
  // Alternatively: We can just wrap this component in a Html div (which is maybe bad inside Canvas)
  // OR: We assume the parent passes the drop event through?
  // Actually, standard HTML events on the canvas DOM element work.
  // We can attach `useThree`'s `gl.domElement` listeners?
  // Let's rely on the Parent (App.tsx) container having `onDrop`.
  // BUT the Logic is here.
  // Solution: Expose "addObject" via Ref, move "handleDrop" logic to App.tsx?
  // OR: Use `useThree` to add event listener to canvas?
  // Let's try simplifying: The user drags onto the "Canvas Container".
  // App.tsx has the container.
  // We can keep `handleDrop` here but expose it? NO.
  // Let's move `handleDrop` logic to a method `addObjectFromDrop` on the Ref.
  
  useImperativeHandle(ref, () => ({
      // ... previous methods ...
      deleteSelected: () => {
        const selId = selectedIdRef.current;
        if (selId) {
          setObjects(prev => prev.filter(obj => obj.id !== selId));
          initialPositionsRef.current.delete(selId);
          onObjectSelect(null);
          onPhysicsUpdate(null);
        }
      },
      clear: () => {
        setObjects([]);
        initialPositionsRef.current.clear();
        onObjectSelect(null);
        onPhysicsUpdate(null);
        setSceneKey(k => k + 1);
      },
      reset: () => {
        setObjects(prev => prev.map(obj => {
          const initialPos = initialPositionsRef.current.get(obj.id);
          if (initialPos) {
            return { ...obj, position: initialPos };
          }
          return obj;
        }));
        setSceneKey(k => k + 1);
      },
      resetSelected: () => {
        const selId = selectedIdRef.current;
        if (selId) {
          const initialPos = initialPositionsRef.current.get(selId);
          if (initialPos) {
            setObjects(prev => prev.map(obj => 
              obj.id === selId ? { ...obj, position: initialPos } : obj
            ));
            setSceneKey(k => k + 1);
          }
        }
      },
      loadExperiment: (experimentId: string) => {
          // ... implementation details ...
         const experiment = getExperimentById(experimentId);
          if (!experiment) return;
          
          setObjects([]);
          initialPositionsRef.current.clear();
          onObjectSelect(null);
          onPhysicsUpdate(null);
          
          const newObjects: Object3DData[] = [];
          
          experiment.objects.forEach((objConfig, index) => {
            const definition = getObjectById(objConfig.definitionId);
            if (!definition) return;
            
            const position: [number, number, number] = [
              (objConfig.x - 400) / 50,
              (500 - objConfig.y) / 50 + 2,
              (index - experiment.objects.length / 2) * 1.5
            ];
            
            const newObject: Object3DData = {
              id: `exp_${objectIdCounter.current++}`,
              position: position,
              shape: definition.type === 'circle' ? 'sphere' : 'box',
              size: [
                (definition.width || definition.radius || 50) / 50,
                (definition.height || definition.radius || 50) / 50,
                (definition.width || definition.radius || 50) / 50
              ],
              color: definition.options.render?.fillStyle || '#6366f1',
              mass: Math.max(0.1, (definition.options.density || 0.001) * 500),
              restitution: definition.options.restitution || 0.5,
              friction: definition.options.friction || 0.5,
              definitionId: definition.id,
              label: definition.label,
              isStatic: definition.options.isStatic || false
            };
            
            newObjects.push(newObject);
            initialPositionsRef.current.set(newObject.id, [...newObject.position] as [number, number, number]);
          });
          
          setObjects(newObjects);
          setSceneKey(k => k + 1);
      },
      
      // New method to handle drops from parent
      addObjectFromDrop: (e: React.DragEvent) => {
          try {
            const data = e.dataTransfer.getData('application/json');
            if (!data) return;
            
            const definition = JSON.parse(data) as PhysicsObjectDefinition;
            
            const newObject: Object3DData = {
                id: `obj3d_${objectIdCounter.current++}`,
                position: [
                (Math.random() - 0.5) * 8,
                5 + Math.random() * 3,
                (Math.random() - 0.5) * 8
                ],
                shape: definition.type === 'circle' ? 'sphere' : 'box',
                size: [
                (definition.width || definition.radius || 50) / 50,
                (definition.height || definition.radius || 50) / 50,
                (definition.width || definition.radius || 50) / 50
                ],
                color: definition.options.render?.fillStyle || '#6366f1',
                mass: Math.max(0.1, (definition.options.density || 0.001) * 500),
                restitution: definition.options.restitution || 0.5,
                friction: definition.options.friction || 0.5,
                definitionId: definition.id,
                label: definition.label,
                isStatic: definition.options.isStatic || false
            };
            
            setObjects(prev => [...prev, newObject]);
            initialPositionsRef.current.set(newObject.id, [...newObject.position] as [number, number, number]);
            
            const sceneObj: SceneObject = {
                id: newObject.id,
                definitionId: newObject.definitionId,
                body: null as any,
                initialPosition: { x: newObject.position[0], y: newObject.position[1] },
                initialAngle: 0,
                customData: { label: newObject.label, color: newObject.color },
                createdAt: Date.now()
            };
            onObjectSelect(sceneObj);
            startTimeRef.current = Date.now();
          } catch (err) {
            console.error('Failed to add object:', err);
          }
      }
  }));

  return (
    <>
      <color attach="background" args={['#070b14']} />
      <PhysicsCamera />
      <Scene
        objects={objects}
        selectedId={selectedObjectId}
        onSelectObject={handleSelectObject}
        onDeselectObject={handleDeselectObject}
        onPhysicsUpdate={handlePhysicsUpdate3D}
        gravity={gravityScale}
        isPaused={isPaused}
        showGrid={visualization.showGrid}
        orbitEnabled={orbitEnabled}
        setOrbitEnabled={setOrbitEnabled}
      />
    </>
  );
});

export default PhysicsScene3D;
