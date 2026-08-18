import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Box, 
  ShieldAlert,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { useUIStore } from '../../store/useUIStore';
import { InventoryItem, ZoneId } from '../../types/inventory';
import { ShelfVisualizer3D } from '../3d/ShelfVisualizer3D';
import { formatCurrency } from '../../utils/formatters';

export function InventoryView() {
  const { inventory, replenishStock } = useWarehouseStore();
  const { searchQuery, openReplenishModal } = useUIStore();

  const [selectedZone, setSelectedZone] = useState<ZoneId | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [active3DAisle, setActive3DAisle] = useState<{ zone: ZoneId; aisle: string }>({ zone: 'Zone A', aisle: 'A1' });
  const [selectedItemForDrawer, setSelectedItemForDrawer] = useState<InventoryItem | null>(inventory[0]);

  // Categories list
  const categories = Array.from(new Set(inventory.map(i => i.category)));

  // Filter inventory logic
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.includes(searchQuery);

    const matchesZone = selectedZone === 'All' || item.location.zone === selectedZone;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLowStock = !showLowStockOnly || item.status === 'Low Stock' || item.status === 'Critical Shortage';

    return matchesSearch && matchesZone && matchesCategory && matchesLowStock;
  });

  const totalSKUs = inventory.length;
  const criticalCount = inventory.filter(i => i.status === 'Critical Shortage').length;
  const lowCount = inventory.filter(i => i.status === 'Low Stock').length;
  const quarantinedCount = inventory.filter(i => i.damagedStock > 0).length;

  return (
    <div className="space-y-6">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 font-mono tracking-tight">
            INVENTORY & STOCK ALLOCATION MATRIX
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {totalSKUs} Tracked SKUs across 4 Storage Zones (A-D)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => openReplenishModal(inventory[0].sku)}
            className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl font-mono text-xs font-bold shadow-cyan-glow transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>+ Manual Stock Replenishment</span>
          </button>
        </div>
      </div>

      {/* Stock Health Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl font-mono">
          <span className="text-[11px] text-slate-400 uppercase">Total Catalog Value</span>
          <div className="text-xl font-bold text-slate-100 mt-1">
            {formatCurrency(inventory.reduce((sum, i) => sum + i.totalStock * i.unitPrice, 0))}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl font-mono">
          <span className="text-[11px] text-slate-400 uppercase">Available Stock</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {inventory.reduce((sum, i) => sum + i.availableStock, 0)} units
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl font-mono">
          <span className="text-[11px] text-slate-400 uppercase">Shortage / Reorder Alerts</span>
          <div className="text-xl font-bold text-amber-400 mt-1">
            {criticalCount + lowCount} SKUs
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl font-mono">
          <span className="text-[11px] text-slate-400 uppercase">Quarantined / Damaged</span>
          <div className="text-xl font-bold text-rose-400 mt-1">
            {quarantinedCount} Bins
          </div>
        </div>
      </div>

      {/* Interactive 3D Shelf Visualizer Section */}
      <ShelfVisualizer3D
        zoneName={active3DAisle.zone}
        aisleName={active3DAisle.aisle}
        items={inventory.filter(i => i.location.zone === active3DAisle.zone)}
        onSelectItem={(item) => setSelectedItemForDrawer(item)}
      />

      {/* Filter Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-slate-400 font-bold flex items-center gap-1 mr-2">
            <Filter className="h-3.5 w-3.5 text-cyan-400" /> Filter Zone:
          </span>
          {(['All', 'Zone A', 'Zone B', 'Zone C', 'Zone D'] as const).map(zone => (
            <button
              key={zone}
              onClick={() => {
                setSelectedZone(zone);
                if (zone !== 'All') {
                  setActive3DAisle({ zone, aisle: zone === 'Zone A' ? 'A1' : zone === 'Zone B' ? 'B1' : zone === 'Zone C' ? 'C1' : 'D1' });
                }
              }}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedZone === zone
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold shadow-cyan-glow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-cyan-500/50"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
            <span>Shortages Only</span>
          </label>
        </div>
      </div>

      {/* Main Stock Data Grid Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">SKU / Product Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">3D Location</th>
                <th className="p-4 text-right">Available</th>
                <th className="p-4 text-right">Reserved</th>
                <th className="p-4 text-right">Damaged</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredInventory.map((item) => {
                const isSelected = selectedItemForDrawer?.sku === item.sku;

                return (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItemForDrawer(item)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        <span className="text-cyan-400 font-mono text-[11px]">{item.sku}</span>
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Barcode: {item.barcode}</div>
                    </td>

                    <td className="p-4 text-slate-400">{item.category}</td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800 text-[11px]">
                        {item.location.zone} | {item.location.aisle} | {item.location.bin}
                      </span>
                    </td>

                    <td className="p-4 text-right font-bold text-emerald-400">
                      {item.availableStock}
                    </td>

                    <td className="p-4 text-right font-bold text-cyan-300">
                      {item.reservedStock}
                    </td>

                    <td className="p-4 text-right font-bold text-rose-400">
                      {item.damagedStock}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Healthy'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'Low Stock'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : item.status === 'Quarantined'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openReplenishModal(item.sku);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-bold rounded-lg text-[11px] transition-all"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
