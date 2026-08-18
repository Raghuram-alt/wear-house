import React from 'react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight, 
  Boxes,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { WarehouseScene } from '../3d/WarehouseScene';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { useUIStore } from '../../store/useUIStore';
import { formatCurrency, formatTimeRemaining } from '../../utils/formatters';

export function DashboardView() {
  const { analytics, conflicts, orders, allocationLogs } = useWarehouseStore();
  const { setActiveTab } = useUIStore();

  const urgentConflicts = conflicts.filter(c => c.priority === 'Urgent');

  return (
    <div className="space-y-6">
      {/* Hero Live KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Live Fulfillment Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Fulfillment SLA Rate</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-slate-100 font-mono">{analytics.fulfillmentRatePct}%</span>
              <span className="text-xs text-emerald-400 font-mono flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +1.2%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">{analytics.dispatchedOrdersToday} of {analytics.totalOrdersToday} orders dispatched today</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 2: Active Stock Conflicts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Stock Conflicts</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-rose-400 font-mono">{conflicts.length}</span>
              <span className="text-xs text-rose-400 font-mono">Deficits Requiring Action</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">{urgentConflicts.length} Urgent SLA deadlines impacted</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* KPI 3: Saved SLA Penalties */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">SLA Penalties Saved</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{formatCurrency(analytics.savedPenaltiesAmount)}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">By AI Decision Engine Reallocations</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Zap className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 4: Pick Throughput */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Picking Velocity</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-slate-100 font-mono">142</span>
              <span className="text-xs text-slate-400 font-mono">items/hr</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Avg cycle time: {analytics.averagePickTimeMins} mins</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* 3D Warehouse Control Room Visualizer */}
      <WarehouseScene />

      {/* Smart Decision Recommendation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Priority Smart Recommendations */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100 font-mono">Smart Decision Engine Recommendations</h3>
            </div>
            <button
              onClick={() => setActiveTab('allocation')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All ({conflicts.length})</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {conflicts.length > 0 ? (
            <div className="space-y-3">
              {conflicts.slice(0, 2).map((conflict) => {
                const recommendedOpt = conflict.options.find(o => o.id === conflict.recommendedOptionId) || conflict.options[0];
                const slaInfo = formatTimeRemaining(conflict.slaDeadline);

                return (
                  <div key={conflict.id} className="bg-slate-950/80 border border-cyan-500/40 rounded-xl p-4 shadow-cyan-glow relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                            {conflict.priority} ORDER #{conflict.targetOrderNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{conflict.targetCustomer}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 mt-1">
                          Deficit: {conflict.qtyDeficit}x {conflict.productName} ({conflict.sku})
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                          slaInfo.isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          SLA: {slaInfo.text}
                        </span>
                      </div>
                    </div>

                    {/* Reasoning Box */}
                    <div className="mt-3 bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs font-mono">
                      <div className="text-cyan-400 font-bold flex items-center gap-1.5 mb-1">
                        <Zap className="h-3.5 w-3.5 text-cyan-400" />
                        <span>AI Recommended Action: {recommendedOpt.title}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{recommendedOpt.reasoning}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-emerald-400">
                        ✓ {recommendedOpt.slaImpact}
                      </span>
                      <button
                        onClick={() => setActiveTab('allocation')}
                        className="py-1.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold rounded-lg shadow-cyan-glow transition-all"
                      >
                        Accept & Resolve →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-mono text-slate-300">All Order Stock Allocations Satisfied</p>
              <p className="text-xs text-slate-500">Zero active deficits across Urgent and High priority orders.</p>
            </div>
          )}
        </div>

        {/* Right Col: Live Decision Audit Trail */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Boxes className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100 font-mono">Live Decision Audit Log</h3>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {allocationLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="text-cyan-400">{log.orderNumber}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-200 font-semibold">{log.actionTaken}</div>
                  <div className="text-[11px] text-slate-400 truncate">{log.reason}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-xl border border-slate-700 transition-colors text-center"
          >
            Open Order Pipeline View →
          </button>
        </div>
      </div>
    </div>
  );
}
