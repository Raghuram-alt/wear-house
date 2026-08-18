import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Zap, 
  Clock, 
  Activity, 
  Layers,
  Users
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function AnalyticsView() {
  const { analytics, pickers } = useWarehouseStore();

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
            OPERATIONS ANALYTICS & BOTTLENECK INSIGHTS
          </h2>
          <p className="text-xs text-slate-400">
            Real-Time Fulfillment Velocity • Zone Efficiency • Picker Leaderboard
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400">
            Live Telemetry Feed
          </span>
        </div>
      </div>

      {/* Hourly Throughput Bar Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            Hourly Pick & Dispatch Throughput vs Target
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-3 w-3 rounded bg-cyan-500 inline-block"></span> Picked Units
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="h-3 w-3 rounded bg-blue-600 inline-block"></span> Dispatched Orders
            </span>
          </div>
        </div>

        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.hourlyThroughput}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#00f0ff' }}
              />
              <Bar dataKey="pickedUnits" fill="#00f0ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dispatchedOrders" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Occupancy & Efficiency Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            Warehouse Zone Performance Metrics
          </h3>

          <div className="space-y-3">
            {analytics.zoneMetrics.map((z) => (
              <div key={z.zone} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-100">{z.zone}</span>
                  <span className="text-cyan-400 font-bold">{z.picksPerHour} picks/hr</span>
                </div>

                {/* Occupancy Progress Bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full rounded-full transition-all"
                    style={{ width: `${z.stockOccupancyPct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Occupancy: {z.stockOccupancyPct}%</span>
                  <span>Active Pickers: {z.activePickers}</span>
                  <span>Exceptions: <strong className="text-amber-400">{z.exceptionCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Picker Productivity Leaderboard */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4 text-cyan-400" />
            Active Picker Productivity Leaderboard
          </h3>

          <div className="space-y-3">
            {pickers.map((p, idx) => (
              <div key={p.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="font-bold text-cyan-400 text-sm">#{idx + 1}</div>
                  <img src={p.avatar} alt={p.name} className="h-9 w-9 rounded-full object-cover border border-slate-700" />
                  <div>
                    <div className="font-bold text-slate-100 text-xs">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.assignedZone} • Status: {p.status}</div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-bold text-emerald-400">{p.itemsPickedToday} items</div>
                  <div className="text-[10px] text-slate-400">{p.accuracyRate}% Accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
