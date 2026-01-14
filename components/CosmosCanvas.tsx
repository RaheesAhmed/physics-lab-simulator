/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { solarSystemData, galaxyData, CelestialBodyConfig } from '../data/cosmos';

interface CosmosCanvasProps {
  viewMode: 'solar' | 'galaxy';
}

function Planet({ data, timeScale = 1 }: { data: CelestialBodyConfig; timeScale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (orbitRef.current && data.period > 0) {
      // Orbit speed depends on period (Earth year = X seconds)
      const t = clock.getElapsedTime() * timeScale * 0.5;
      const angle = t / data.period;
      orbitRef.current.rotation.y = angle;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 / (Math.abs(data.rotationPeriod) || 1);
    }
  });

  return (
    <group>
      {/* Orbit Path */}
      {data.distance > 0 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.distance - 0.1, data.distance + 0.1, 64]} />
          <meshBasicMaterial color={data.orbitColor || '#333'} side={THREE.DoubleSide} transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Planet Group (Pivot at center, offset by distance) */}
      <group ref={orbitRef}>
        <group position={[data.distance, 0, 0]}>
          {/* Planet Mesh */}
          <mesh ref={meshRef}>
            <sphereGeometry args={[data.radius, 32, 32]} />
            {data.id === 'sun' ? (
              <meshBasicMaterial color={data.color} />
            ) : (
              <meshStandardMaterial color={data.color} roughness={0.7} />
            )}
          </mesh>
          
          {/* Sun Glow */}
          {data.id === 'sun' && (
            <pointLight intensity={2} distance={300} decay={2} color="#fff" />
          )}

          {/* Rings */}
          {data.rings && (
            <mesh rotation={[-Math.PI / 3, 0, 0]}>
              <ringGeometry args={[data.rings.innerRadius, data.rings.outerRadius, 64]} />
              <meshStandardMaterial color={data.rings.color} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          )}

          {/* Label */}
          <Html position={[0, data.radius + 2, 0]} center distanceFactor={15}>
            <div className="text-white text-xs font-mono bg-black/50 px-2 py-1 rounded whitespace-nowrap">
              {data.name}
            </div>
          </Html>
        </group>
      </group>
    </group>
  );
}

function Galaxy() {
  const points = useMemo(() => {
    const temp = [];
    const count = galaxyData.starCount;
    const radius = galaxyData.galaxyRadius;
    const branches = galaxyData.spiralArms;
    
    for (let i = 0; i < count; i++) {
        const r = Math.random() * radius;
        const spinAngle = r * branches;
        const branchAngle = (i % branches) * ((2 * Math.PI) / branches);
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (galaxyData.armThickness * radius);
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (galaxyData.armThickness * radius);
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (galaxyData.armThickness * radius);

        const x = Math.cos(spinAngle + branchAngle) * r + randomX;
        const y = (Math.random() - 0.5) * (galaxyData.coreRadius / 2) + randomY * 0.1; // Flat galaxy
        const z = Math.sin(spinAngle + branchAngle) * r + randomZ;
        
        // Color based on distance from center
        const mixedColor = new THREE.Color(galaxyData.colors[Math.floor(Math.random() * galaxyData.colors.length)]);
        
        temp.push({ pos: new THREE.Vector3(x, y, z), color: mixedColor });
    }
    return temp;
  }, []);

  const particleRef = useRef<THREE.Points>(null);
  
  useFrame(({ clock }) => {
    if (particleRef.current) {
      particleRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(points.length * 3);
    const col = new Float32Array(points.length * 3);
    
    points.forEach((p, i) => {
      pos[i * 3] = p.pos.x;
      pos[i * 3 + 1] = p.pos.y;
      pos[i * 3 + 2] = p.pos.z;
      
      col[i * 3] = p.color.r;
      col[i * 3 + 1] = p.color.g;
      col[i * 3 + 2] = p.color.b;
    });
    return [pos, col];
  }, [points]);

  return (
    <group>
       <points ref={particleRef}>
         <bufferGeometry>
           <bufferAttribute 
             attach="attributes-position" 
             count={points.length} 
             array={positions} 
             itemSize={3} 
           />
           <bufferAttribute 
             attach="attributes-color" 
             count={points.length} 
             array={colors} 
             itemSize={3} 
           />
         </bufferGeometry>
         <pointsMaterial 
           size={0.2} 
           vertexColors 
           transparent 
           opacity={0.8} 
           sizeAttenuation 
           depthWrite={false}
           blending={THREE.AdditiveBlending}
         />
       </points>
       
       {/* Core glow */}
       <pointLight position={[0,0,0]} intensity={2} color="#fbbf24" distance={20} />
       <mesh>
         <sphereGeometry args={[2, 32, 32]} />
         <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} />
       </mesh>
    </group>
  );
}

function CameraController({ viewMode }: { viewMode: 'solar' | 'galaxy' }) {
  const { camera } = useThree();
  
  React.useEffect(() => {
    if (viewMode === 'solar') {
      camera.position.set(0, 50, 100);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 30, 40);
      camera.lookAt(0, 0, 0);
    }
  }, [viewMode, camera]);
  
  return null;
}

export default function CosmosScene({ viewMode }: CosmosCanvasProps) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <CameraController viewMode={viewMode} />
      
      {/* Lights */}
      <ambientLight intensity={0.1} /> 
      
      {/* Environment */}
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Controls */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {/* Content */}
      {viewMode === 'solar' ? (
        <group>
           {solarSystemData.map((data) => (
              <Planet key={data.id} data={data} timeScale={0.5} />
           ))}
        </group>
      ) : (
        <Galaxy />
      )}
      
      {/* UI Overlay defined in common wrapper or HTML here? 
          Since we are inside Canvas, we can use <Html> or just let App handle UI.
          But App has the Canvas now.
          We can leave the UI HTML outside the Canvas in App.tsx?
          Or use <Html fullscreen> for the overlay?
      */}
      <Html position={[0,0,0]} style={{ pointerEvents: 'none', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }} zIndexRange={[100, 0]}>
        <div className="absolute bottom-10 left-10 p-4 bg-black/50 backdrop-blur border border-white/10 rounded-lg text-white max-w-sm pointer-events-auto">
            <h3 className="text-lg font-bold mb-2">
            {viewMode === 'solar' ? 'Solar System Model' : 'Milky Way Galaxy Model'}
            </h3>
            <p className="text-sm text-gray-300">
            {viewMode === 'solar' 
                ? 'A scaled representation of our solar system. Distances and sizes are adjusted for visualization.' 
                : 'A procedural particle system representing a barred spiral galaxy like the Milky Way.'}
            </p>
            <div className="mt-2 text-xs text-blue-400">
            Controls: Left Click to Rotate • Right Click to Pan • Scroll to Zoom
            </div>
        </div>
      </Html>
    </>
  );
}
