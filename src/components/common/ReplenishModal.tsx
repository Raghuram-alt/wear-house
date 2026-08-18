import React, { useState } from 'react';
import { X, RefreshCw, PackagePlus } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function ReplenishModal() {
  const { isReplenishModalOpen, closeReplenishModal, replenishTargetSku } = useUIStore();
  const { inventory, replenishStock } = useWarehouseStore();

  const targetItem = inventory.find(i => i.sku === replenishTargetSku) || inventory[0];
  const [replenishQty, setReplenishQty] = useState(20);

  if (!isReplenishModalOpen || !targetItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    replenishStock(targetItem.sku, replenishQty);
    closeReplenishModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-mono">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <PackagePlus className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase">Stock Replenishment Order</h3>
          </div>
          <button onClick={closeReplenishModal} className="text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="text-cyan-400 font-bold">{targetItem.sku}</div>
          <div className="text-slate-200 font-semibold mt-0.5">{targetItem.name}</div>
          <div className="text-slate-400 mt-1">Location: {targetItem.location.zone} ({targetItem.location.bin})</div>
          <div className="text-emerald-400 mt-1 font-bold">Current Avail: {targetItem.availableStock} units</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Replenish Quantity (Units)</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={replenishQty}
              onChange={(e) => setReplenishQty(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500/50 text-sm font-bold"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeReplenishModal}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-bold shadow-cyan-glow"
            >
              Confirm Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
