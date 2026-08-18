import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { InventoryItem } from '../../types/inventory';
import { useUIStore } from '../../store/useUIStore';

interface BinSlotProps {
  position: [number, number, number];
  shelfName: string;
  binName: string;
  item?: InventoryItem;
  onSelect: (item: InventoryItem | null) => void;
}

function BinSlot({ position, shelfName, binName, item, onSelect }: BinSlotProps) {
  const [hovered, setHovered] = useState(false);

  let binColor = '#334155'; // Empty slot
  if (item) {
    if (item.damagedStock > 0 || item.status === 'Quarantined') {
      binColor = '#f43f5e'; // Damaged/Quarantined
    } else if (item.availableStock === 0) {
      binColor = '#ef4444'; // Deficit
    } else if (item.status === 'Low Stock' || item.status === 'Critical Shortage') {
      binColor = '#f59e0b'; // Low
    } else {
      binColor = '#10b981'; // Healthy
    }
  }

  return (
    <group
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(item || null)}
    >
      <mesh>
        <boxGeometry args={[1.5, 0.9, 1.5]} />
        <meshStandardMaterial
          color={hovered ? '#00f0ff' : binColor}
          emissive={hovered ? '#00f0ff' : binColor}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          roughness={0.4}
        />
      </mesh>

      {hovered && item && (
        <Html position={[0, 1.2, 0]} center>
          <div className="bg-slate-900/95 border border-cyan-500/50 p-2.5 rounded-lg text-xs font-mono text-white shadow-cyan-glow whitespace-nowrap pointer-events-none z-30">
            <div className="font-bold text-cyan-400">{item.sku}</div>
            <div className="text-slate-300 text-[11px] truncate max-w-[180px]">{item.name}</div>
            <div className="text-slate-400 mt-1">Avail: <span className="text-emerald-400 font-bold">{item.availableStock}</span> / Res: {item.reservedStock}</div>
          </div>
        </Html>
      )}

      <Text
        position={[0, 0, 0.77]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {binName}
      </Text>
    </group>
  );
}

export function ShelfVisualizer3D({
  zoneName,
  aisleName,
  items,
  onSelectItem
}: {
  zoneName: string;
  aisleName: string;
  items: InventoryItem[];
  onSelectItem: (item: InventoryItem) => void;
}) {
  const { openReplenishModal } = useUIStore();
  const [selectedBinItem, setSelectedBinItem] = useState<InventoryItem | null>(null);

  const handleSelectBin = (item: InventoryItem | null) => {
    setSelectedBinItem(item);
    if (item) {
      onSelectItem(item);
    }
  };

  // Map 12 bin slots across 3 shelves x 4 bins per shelf
  const shelves = ['S-01', 'S-02', 'S-03'];
  const binNumbers = ['B-01', 'B-02', 'B-03', 'B-04'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              3D Shelf & Bin Matrix: {zoneName} ({aisleName})
            </h3>
            <p className="text-xs text-slate-400">Click any bin to view stock allocation & trigger replenishment</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Healthy
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span> Low
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <span className="h-2 w-2 rounded-full bg-rose-400"></span> Deficit
            </span>
          </div>
        </div>

        <div className="w-full h-[320px] rounded-xl bg-[#060913] border border-slate-800 relative overflow-hidden">
          <Canvas camera={{ position: [0, 2.5, 9], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 15, 10]} intensity={1.2} />

            {/* Frame Metal Posts */}
            {[-3.8, 3.8].map((x, i) => (
              <mesh key={`post-${i}`} position={[x, 0.5, 0]}>
                <boxGeometry args={[0.2, 5.5, 0.2]} />
                <meshStandardMaterial color="#475569" metalness={0.8} />
              </mesh>
            ))}

            {/* Shelf Beams */}
            {[-1.2, 0.5, 2.2].map((y, i) => (
              <mesh key={`shelf-beam-${i}`} position={[0, y, 0]}>
                <boxGeometry args={[8, 0.1, 1.8]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>
            ))}

            {/* Bin Slot Grid */}
            {shelves.map((shelfName, yIdx) => {
              const yPos = -0.7 + yIdx * 1.6;
              return binNumbers.map((binName, xIdx) => {
                const xPos = -2.7 + xIdx * 1.8;
                const matchedItem = items.find(
                  it => it.location.shelf === shelfName && it.location.bin === binName
                ) || items[xIdx % items.length];

                return (
                  <BinSlot
                    key={`slot-${yIdx}-${xIdx}`}
                    position={[xPos, yPos, 0]}
                    shelfName={shelfName}
                    binName={`${binName}`}
                    item={matchedItem}
                    onSelect={handleSelectBin}
                  />
                );
              });
            })}

            <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />
          </Canvas>
        </div>
      </div>

      {/* Selected Item Drawer Card */}
      <div className="w-full lg:w-[280px] bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
        {selectedBinItem ? (
          <div>
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {selectedBinItem.sku}
                </span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">{selectedBinItem.name}</h4>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Location:</span>
                <span className="text-cyan-400">{selectedBinItem.location.zone} ({selectedBinItem.location.bin})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Available Stock:</span>
                <span className="text-emerald-400 font-bold">{selectedBinItem.availableStock} units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Reserved (Orders):</span>
                <span className="text-cyan-300 font-bold">{selectedBinItem.reservedStock} units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Damaged / Quarantine:</span>
                <span className="text-rose-400 font-bold">{selectedBinItem.damagedStock} units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Unit Price:</span>
                <span className="text-slate-200">\${selectedBinItem.unitPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => openReplenishModal(selectedBinItem.sku)}
                className="w-full py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-cyan-glow"
              >
                + Replenish Stock
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="p-3 rounded-full bg-slate-900 text-slate-500 mb-2">📦</div>
            <p className="text-xs text-slate-400 font-mono">Click any 3D Bin slot to inspect detailed stock parameters</p>
          </div>
        )}
      </div>
    </div>
  );
}
