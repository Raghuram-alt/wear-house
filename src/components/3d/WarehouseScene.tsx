import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { useUIStore } from '../../store/useUIStore';

// Moving AGV Robot 3D component
function AGVRobot({ pathPoints, speed = 0.5, color = "#00f0ff" }: { pathPoints: [number, number, number][]; speed?: number; color?: string }) {
  const meshRef = useRef<THREE.Group>(null);
  const [targetIdx, setTargetIdx] = useState(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const currentPos = meshRef.current.position;
    const target = pathPoints[targetIdx];
    const targetVec = new THREE.Vector3(target[0], target[1], target[2]);

    const dist = currentPos.distanceTo(targetVec);
    if (dist < 0.2) {
      setTargetIdx((prev) => (prev + 1) % pathPoints.length);
    } else {
      const dir = targetVec.clone().sub(currentPos).normalize();
      currentPos.add(dir.multiplyScalar(speed * delta * 4));
      meshRef.current.lookAt(targetVec);
    }
  });

  return (
    <group ref={meshRef} position={pathPoints[0]}>
      {/* AGV Chassis */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.4, 1.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Cyan Accent Lines */}
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[1.0, 0.05, 1.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      {/* Status Beacon Top */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
}

// 3D Shelf Rack Row Component
function ShelfRackRow({ position, zoneName, aisleName }: { position: [number, number, number]; zoneName: string; aisleName: string }) {
  const { setActiveTab } = useUIStore();
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActiveTab('inventory')}
    >
      {/* Vertical Metal Beams */}
      {[-1.8, 1.8].map((x, i) =>
        [-3.5, 3.5].map((z, j) => (
          <mesh key={`beam-${i}-${j}`} position={[x, 2.5, z]}>
            <boxGeometry args={[0.15, 5, 0.15]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
        ))
      )}

      {/* Horizontal Shelves */}
      {[0.5, 2.0, 3.5, 5.0].map((y, idx) => (
        <mesh key={`shelf-${idx}`} position={[0, y, 0]}>
          <boxGeometry args={[3.8, 0.1, 7.2]} />
          <meshStandardMaterial color={hovered ? "#00f0ff" : "#1e293b"} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Cargo Pallets / Storage Bins */}
      {[-1, 1].map((xOffset, xi) =>
        [-2.5, -0.8, 0.8, 2.5].map((zOffset, zi) =>
          [0.8, 2.3, 3.8].map((yLevel, yi) => {
            const isAlert = (xi + zi + yi) % 5 === 0;
            const isWarning = (xi + zi + yi) % 7 === 0;
            const binColor = isAlert ? '#f43f5e' : isWarning ? '#f59e0b' : '#0284c7';

            return (
              <mesh key={`bin-${xi}-${zi}-${yi}`} position={[xOffset, yLevel, zOffset]}>
                <boxGeometry args={[1.4, 0.8, 1.4]} />
                <meshStandardMaterial
                  color={binColor}
                  roughness={0.4}
                  metalness={0.2}
                  emissive={binColor}
                  emissiveIntensity={isAlert ? 0.6 : 0.1}
                />
              </mesh>
            );
          })
        )
      )}

      {/* Zone Label Floating Text */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 6.2, 0]}
          fontSize={0.6}
          color={hovered ? "#00f0ff" : "#94a3b8"}
          anchorX="center"
          anchorY="middle"
        >
          {`${zoneName} - ${aisleName}`}
        </Text>
      </Float>
    </group>
  );
}

function WarehouseFloor() {
  return (
    <group>
      {/* Main Concrete Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#080d1a" roughness={0.8} metalness={0.3} />
      </mesh>
      <gridHelper args={[60, 60, "#00f0ff", "#1e293b"]} position={[0, 0.01, 0]} />
    </group>
  );
}

export function WarehouseScene() {
  const { conflicts } = useWarehouseStore();

  const agvPath1: [number, number, number][] = [
    [-18, 0, -15],
    [18, 0, -15],
    [18, 0, 15],
    [-18, 0, 15]
  ];

  const agvPath2: [number, number, number][] = [
    [0, 0, -18],
    [0, 0, 18],
    [-10, 0, 18],
    [-10, 0, -18]
  ];

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-800 bg-[#060913] shadow-cyan-glow">
      {/* Overlay Badge Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/30">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
        </span>
        <div>
          <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">3D Warehouse Digital Twin</h4>
          <p className="text-[11px] text-slate-400">Live AGV Telemetry & Zone Occupancy</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
        <span className="text-rose-400 font-bold">{conflicts.length} Active Conflicts</span>
        <span>•</span>
        <span className="text-cyan-400 font-bold">4 AGVs Operating</span>
      </div>

      <Canvas camera={{ position: [25, 25, 25], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[20, 30, 20]} intensity={1.2} />
        <pointLight position={[-15, 10, -15]} color="#00f0ff" intensity={3} distance={25} />
        <pointLight position={[15, 10, 15]} color="#f43f5e" intensity={2} distance={25} />

        <WarehouseFloor />

        {/* 4 Main Aisle Rack Rows */}
        <ShelfRackRow position={[-12, 0, -8]} zoneName="Zone A" aisleName="Aisle A1-A2" />
        <ShelfRackRow position={[12, 0, -8]} zoneName="Zone B" aisleName="Aisle B1-B2" />
        <ShelfRackRow position={[-12, 0, 8]} zoneName="Zone C" aisleName="Aisle C1-C2" />
        <ShelfRackRow position={[12, 0, 8]} zoneName="Zone D" aisleName="Aisle D1-D2 (Overstock)" />

        {/* Autonomous AGV Robots */}
        <AGVRobot pathPoints={agvPath1} speed={0.8} color="#00f0ff" />
        <AGVRobot pathPoints={agvPath2} speed={0.6} color="#38bdf8" />

        <OrbitControls
          enableZoom={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={10}
          maxDistance={50}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      <div className="absolute bottom-3 left-4 z-10 text-[11px] text-slate-500 font-mono">
        💡 Drag to rotate camera • Scroll to zoom • Click rack to inspect inventory
      </div>
    </div>
  );
}
