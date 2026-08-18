import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Cpu, 
  Barcode, 
  AlertTriangle, 
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useUIStore, ActiveTab } from '../../store/useUIStore';
import { useWarehouseStore } from '../../store/useWarehouseStore';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

export function Sidebar() {
  const { activeTab, setActiveTab } = useUIStore();
  const { conflicts, exceptions } = useWarehouseStore();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: 'Orders Pipeline', icon: ShoppingCart },
    { 
      id: 'allocation', 
      label: 'Allocation Engine', 
      icon: Cpu, 
      badge: conflicts.length, 
      badgeColor: 'bg-rose-500 text-white shadow-rose-glow animate-pulse' 
    },
    { id: 'picking', label: 'Picking & Packing', icon: Barcode },
    { 
      id: 'exceptions', 
      label: 'Exceptions Console', 
      icon: AlertTriangle, 
      badge: exceptions.filter(e => e.status === 'Active').length, 
      badgeColor: 'bg-amber-500 text-slate-950 font-bold' 
    },
    { id: 'analytics', label: 'Analytics Insights', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
          OPERATIONAL CONTROL
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all ${
                isActive
                  ? 'bg-slate-900 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 ? (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="h-3.5 w-3.5 text-cyan-400" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* System Operational Footer */}
      <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2 text-xs font-mono">
        <div className="flex justify-between items-center text-slate-400">
          <span>AI Decision Engine:</span>
          <span className="text-emerald-400 font-bold">Active</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Warehouse Grid:</span>
          <span className="text-cyan-400 font-bold">Zones A-D</span>
        </div>
      </div>
    </aside>
  );
}
