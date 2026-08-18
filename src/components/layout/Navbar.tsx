import React from 'react';
import { 
  Boxes, 
  Search, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  ShieldAlert, 
  Activity,
  Sparkles 
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function Navbar() {
  const { isMuted, toggleMute, setIsNewOrderModalOpen, searchQuery, setSearchQuery } = useUIStore();
  const { conflicts, exceptions } = useWarehouseStore();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Brand Logo & System Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-cyan-glow flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Boxes className="h-5 w-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-100 font-mono">
                  NEXUS<span className="text-cyan-400">LOGIX</span>
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  v3.4 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Smart Warehouse & Allocation Control Room</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-800 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">ENGINE ONLINE</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKU, Order #, Customer, or Zone location..."
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/60 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all font-mono"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Audio Sound FX Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute Sound FX" : "Mute Sound FX"}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-slate-500" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
          </button>

          {/* Quick Alert Badges */}
          {conflicts.length > 0 && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-semibold animate-pulse">
              <ShieldAlert className="h-4 w-4" />
              <span>{conflicts.length} Stock Deficits</span>
            </div>
          )}

          {/* Create Order Trigger */}
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold shadow-cyan-glow transition-all active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">+ Create Order</span>
          </button>
        </div>
      </div>
    </header>
  );
}
