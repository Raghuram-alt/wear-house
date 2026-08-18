import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Order } from '../../types/order';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { formatCurrency } from '../../utils/formatters';

function AnimatedTruck() {
  const truckRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);

  useFrame((_, delta) => {
    if (truckRef.current) {
      // Subtle idle vibration
      truckRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.05;
    }
  });

  return (
    <group ref={truckRef} position={[0, 0.6, 0]}>
      {/* Truck Body Cabin */}
      <mesh position={[2, 0.8, 0]}>
        <boxGeometry args={[1.5, 1.4, 1.8]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windshield */}
      <mesh position={[2.6, 1.0, 0]}>
        <boxGeometry args={[0.3, 0.7, 1.6]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.5} opacity={0.8} transparent />
      </mesh>

      {/* Cargo Trailer */}
      <mesh position={[-0.8, 1.1, 0]}>
        <boxGeometry args={[4.2, 2.0, 2.0]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Futuristic Electric Glow Strip */}
      <mesh position={[-0.8, 2.15, 0]}>
        <boxGeometry args={[4.0, 0.1, 1.9]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={1.5} />
      </mesh>

      {/* Wheels */}
      {[-2.2, -0.2, 2.0].map((x, i) =>
        [-0.9, 0.9].map((z, j) => (
          <mesh key={`wheel-${i}-${j}`} position={[x, -0.2, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.3, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Parcel Cargo Box Loading Animation */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh position={[0, 2.8, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

export function DispatchTruck3D({ order }: { order: Order }) {
  const { closeDispatchModal } = useWarehouseStore();

  useEffect(() => {
    // Fire celebration confetti cannon!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#38bdf8', '#10b981', '#a855f7']
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 max-w-xl w-full shadow-cyan-glow relative flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            DISPATCH SUCCESSFUL • Carrier: {order.shippingCarrier}
          </span>
          <h2 className="text-2xl font-black text-slate-100 mt-2">Order #{order.orderNumber} On Its Way!</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Destination: {order.destinationCity} • Carrier SLA Met
          </p>
        </div>

        {/* 3D Dispatch Truck Canvas */}
        <div className="w-full h-[220px] bg-[#060913] rounded-xl border border-slate-800 relative overflow-hidden mb-4">
          <Canvas camera={{ position: [6, 4, 6], fov: 40 }}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[0, 5, 0]} color="#00f0ff" intensity={2} />

            {/* Asphalt Ground */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#0b1329" />
            </mesh>
            <gridHelper args={[20, 20, "#00f0ff", "#1e293b"]} position={[0, 0.01, 0]} />

            <AnimatedTruck />

            <OrbitControls enableZoom={false} autoRotate={true} autoRotateSpeed={1.5} />
          </Canvas>

          <div className="absolute bottom-2 left-3 text-[11px] font-mono text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            Tracking #: {order.trackingNumber || 'TRK-98210384'}
          </div>
        </div>

        {/* Manifest Specs */}
        <div className="w-full grid grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono mb-5">
          <div>
            <span className="text-slate-500 block">Total Value</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Weight</span>
            <span className="text-cyan-400 font-bold">{order.totalWeightKg} kg</span>
          </div>
          <div>
            <span className="text-slate-500 block">Items Count</span>
            <span className="text-slate-200 font-bold">{order.items.reduce((s, i) => s + i.quantityRequested, 0)} units</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => alert(`Shipping Manifest PDF generated for Order ${order.orderNumber}`)}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-xl border border-slate-700 transition-colors"
          >
            📄 Print Manifest & Label
          </button>
          <button
            onClick={closeDispatchModal}
            className="flex-1 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-cyan-glow transition-all"
          >
            Done & Next Order →
          </button>
        </div>
      </div>
    </div>
  );
}
