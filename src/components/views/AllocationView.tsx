import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  History, 
  Scale, 
  RefreshCw,
  AlertTriangle,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { StockConflict, AllocationOption } from '../../types/allocation';
import { formatTimeRemaining, formatCurrency } from '../../utils/formatters';

export function AllocationView() {
  const { conflicts, applyAllocationOption, manualOverrideAllocation, allocationLogs, inventory } = useWarehouseStore();
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(conflicts.length > 0 ? conflicts[0].id : null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isManualOverrideOpen, setIsManualOverrideOpen] = useState(false);
  const [manualOverrideNote, setManualOverrideNote] = useState('');

  const activeConflict = conflicts.find(c => c.id === selectedConflictId) || conflicts[0];

  const handleApplyOption = (option: AllocationOption) => {
    if (!activeConflict) return;
    applyAllocationOption(activeConflict.id, option.id);
  };

  const handleManualOverrideSubmit = () => {
    if (!activeConflict || !manualOverrideNote.trim()) return;
    manualOverrideAllocation(activeConflict.id, manualOverrideNote);
    setIsManualOverrideOpen(false);
    setManualOverrideNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-cyan-400" />
            SMART STOCK ALLOCATION ENGINE & CONFLICT RESOLUTION
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Automated Exception → Mathematical Reasoning → Instant Execution & Manual Overrides
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            {conflicts.length} Active Deficit Radars
          </span>
        </div>
      </div>

      {conflicts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col: Stock Conflict Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
              Active Stock Deficit Queue ({conflicts.length})
            </h3>

            {conflicts.map((conflict) => {
              const isSelected = activeConflict?.id === conflict.id;
              const sla = formatTimeRemaining(conflict.slaDeadline);

              return (
                <div
                  key={conflict.id}
                  onClick={() => {
                    setSelectedConflictId(conflict.id);
                    setSelectedOptionId(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer font-mono relative ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-cyan-glow'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                      {conflict.priority} ORDER #{conflict.targetOrderNumber}
                    </span>
                    <span className={`text-[10px] font-bold ${sla.isCritical ? 'text-rose-400' : 'text-slate-400'}`}>
                      SLA: {sla.text}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">{conflict.targetCustomer}</h4>
                  
                  <div className="mt-2 p-2 rounded bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="text-slate-300 font-semibold">{conflict.productName}</div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Requested: <strong className="text-slate-200">{conflict.qtyRequested}</strong></span>
                      <span>Available: <strong className="text-emerald-400">{conflict.qtyAvailable}</strong></span>
                      <span>Deficit: <strong className="text-rose-400 font-bold">-{conflict.qtyDeficit}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Col: Intelligent Decision Studio */}
          <div className="lg:col-span-8 space-y-6">
            {activeConflict && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
                {/* Active Conflict Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">Target Urgent Order</span>
                    <h3 className="text-xl font-bold text-slate-100 font-mono mt-0.5">
                      Order #{activeConflict.targetOrderNumber} — {activeConflict.targetCustomer}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Deficit SKU: <strong className="text-cyan-400">{activeConflict.sku}</strong> ({activeConflict.productName})
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsManualOverrideOpen(true)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 transition-colors"
                    >
                      <Sliders className="h-4 w-4 text-cyan-400" />
                      <span>Manual Override</span>
                    </button>
                  </div>
                </div>

                {/* 4 Decision Recommendation Options Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    Recommended AI Resolution Strategies (Select One to Execute):
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                    {activeConflict.options.map((option) => {
                      const isRecommended = option.id === activeConflict.recommendedOptionId;

                      return (
                        <div
                          key={option.id}
                          className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                            isRecommended
                              ? 'bg-slate-950 border-cyan-500 shadow-cyan-glow relative'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {isRecommended && (
                            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[10px] font-bold shadow-cyan-glow">
                              ★ RECOMMENDED OPTION
                            </span>
                          )}

                          <div>
                            <h5 className="text-sm font-bold text-slate-100 flex items-center justify-between">
                              <span>{option.title}</span>
                              <span className="text-xs text-emerald-400">{option.feasibilityScore}% Match</span>
                            </h5>

                            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                              {option.description}
                            </p>

                            {/* Reasoning Box */}
                            <div className="mt-3 p-2.5 rounded bg-slate-900/90 border border-slate-800/80 text-[11px]">
                              <span className="text-cyan-400 font-bold block mb-1">Reasoning Logic:</span>
                              <p className="text-slate-400 leading-snug">{option.reasoning}</p>
                            </div>

                            <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                              <div>SLA Impact: <span className="text-slate-200">{option.slaImpact}</span></div>
                              <div>Cost Delta: <span className="text-emerald-400">+\${option.costImpact}</span></div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleApplyOption(option)}
                            className={`mt-4 w-full py-2 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                              isRecommended
                                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-glow'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            <span>Accept & Execute Option</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Manual Override Modal / Drawer */}
                {isManualOverrideOpen && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3 font-mono">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Shift Supervisor Manual Allocation Override
                      </h4>
                      <button onClick={() => setIsManualOverrideOpen(false)} className="text-xs text-slate-400">Cancel</button>
                    </div>

                    <p className="text-xs text-slate-300">
                      Specify custom shift authorization reason to force stock allocation on Order #{activeConflict.targetOrderNumber}.
                    </p>

                    <textarea
                      value={manualOverrideNote}
                      onChange={(e) => setManualOverrideNote(e.target.value)}
                      placeholder="Enter supervisor justification notes (e.g. VIP client contract exception granted)..."
                      className="w-full h-20 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                    ></textarea>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleManualOverrideSubmit}
                        className="py-1.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                      >
                        Approve & Apply Manual Override
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/80 rounded-2xl border border-slate-800">
          <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-mono font-bold text-slate-100">Zero Stock Allocation Conflicts</h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            All open orders have sufficient unreserved inventory allocated cleanly.
          </p>
        </div>
      )}

      {/* Historical Audit Trail */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" />
          Allocation Decision Audit Trail Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Order Number</th>
                <th className="p-3">Action Executed</th>
                <th className="p-3">Strategy Type</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Reasoning Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {allocationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3 font-bold text-cyan-400">{log.orderNumber}</td>
                  <td className="p-3 font-semibold">{log.actionTaken}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px]">
                      {log.optionType}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{log.operator}</td>
                  <td className="p-3 text-slate-300 truncate max-w-[280px]">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
