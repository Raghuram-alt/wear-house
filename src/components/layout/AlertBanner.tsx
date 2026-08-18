import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { useUIStore } from '../../store/useUIStore';

export function AlertBanner() {
  const { conflicts } = useWarehouseStore();
  const { setActiveTab } = useUIStore();

  if (conflicts.length === 0) return null;

  const topConflict = conflicts[0];

  return (
    <div className="bg-gradient-to-r from-rose-950/80 via-slate-950 to-rose-950/80 border-b border-rose-500/30 px-6 py-2 flex items-center justify-between text-xs font-mono">
      <div className="flex items-center space-x-3 text-rose-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
        <span className="font-bold">CRITICAL CONFLICT DETECTED:</span>
        <span className="text-slate-200">
          Urgent Order <strong className="text-cyan-400">#{topConflict.targetOrderNumber}</strong> ({topConflict.targetCustomer}) requires {topConflict.qtyRequested}x {topConflict.productName} ({topConflict.sku}) but available stock is {topConflict.qtyAvailable}.
        </span>
      </div>

      <button
        onClick={() => setActiveTab('allocation')}
        className="flex items-center space-x-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 ml-4"
      >
        <span>Open Decision Studio</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
