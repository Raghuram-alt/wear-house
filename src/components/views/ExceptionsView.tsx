import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  History, 
  ArrowRight, 
  FileSpreadsheet,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { WarehouseException } from '../../types/exception';

export function ExceptionsView() {
  const { exceptions, resolveException, quarantineBinItem } = useWarehouseStore();
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(
    exceptions.length > 0 ? exceptions[0].id : null
  );
  const [resolutionNote, setResolutionNote] = useState('');

  const activeExceptions = exceptions.filter(e => e.status === 'Active' || e.status === 'Under Investigation');
  const resolvedExceptions = exceptions.filter(e => e.status === 'Resolved');
  const currentException = exceptions.find(e => e.id === selectedExceptionId) || exceptions[0];

  const handleResolve = (actionTitle: string) => {
    if (!currentException) return;
    resolveException(currentException.id, actionTitle, resolutionNote || currentException.recommendedResolution.description);
    if (currentException.recommendedResolution.action === 'QuarantineBin') {
      quarantineBinItem(currentException.sku);
    }
    setResolutionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            EXCEPTION MANAGEMENT & RESOLUTION CONSOLE
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Exception → Decision → Resolution Workflow • Damaged & Missing Stock Handling
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs">
            {activeExceptions.length} Unresolved Exceptions
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        {/* Left Column: Active Exception List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Exception Queue ({activeExceptions.length})
          </h3>

          <div className="space-y-3">
            {activeExceptions.map((exc) => {
              const isSelected = currentException?.id === exc.id;

              return (
                <div
                  key={exc.id}
                  onClick={() => setSelectedExceptionId(exc.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-amber-glow'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                      {exc.exceptionCode} • {exc.type}
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(exc.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">{exc.productName}</h4>
                  <div className="text-xs text-cyan-400 mt-1">Location: {exc.location}</div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{exc.notes}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Decision & Resolution Inspector Card */}
        <div className="lg:col-span-7">
          {currentException && currentException.status !== 'Resolved' ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                  Reported by: {currentException.reportedBy}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-2">
                  {currentException.exceptionCode}: {currentException.type}
                </h3>
                <div className="text-xs text-slate-400 mt-1">
                  SKU: <strong className="text-cyan-400">{currentException.sku}</strong> | {currentException.location}
                </div>
              </div>

              {/* Reported Findings */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase">Field Incident Report:</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{currentException.notes}</p>
              </div>

              {/* Decision Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 shadow-cyan-glow space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  Recommended Resolution Strategy:
                </h4>
                <div className="text-sm font-bold text-slate-100">{currentException.recommendedResolution.title}</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentException.recommendedResolution.description}
                </p>

                <div className="pt-2">
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Add operator notes before executing resolution..."
                    className="w-full h-16 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleResolve(currentException.recommendedResolution.title)}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-emerald-glow transition-all"
                  >
                    Execute Resolution Strategy →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/80 rounded-2xl border border-slate-800">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="text-base font-bold text-slate-100">Exception Resolved</h4>
              <p className="text-xs text-slate-400 mt-1">Select an active exception from the queue to view decision workflow.</p>
            </div>
          )}
        </div>
      </div>

      {/* Resolution History Audit Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 font-mono">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <History className="h-4 w-4 text-cyan-400" />
          Resolved Exception Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Exception Code</th>
                <th className="p-3">Type</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Resolution Action Taken</th>
                <th className="p-3">Resolved By</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {resolvedExceptions.map((exc) => (
                <tr key={exc.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-cyan-400">{exc.exceptionCode}</td>
                  <td className="p-3 text-slate-300">{exc.type}</td>
                  <td className="p-3 text-slate-400">{exc.sku}</td>
                  <td className="p-3 font-semibold text-emerald-400">
                    {exc.resolutionHistory?.actionChosen || 'Quarantined & Reallocated'}
                  </td>
                  <td className="p-3 text-slate-400">{exc.resolutionHistory?.resolvedBy || 'Operations Lead'}</td>
                  <td className="p-3 text-slate-500">
                    {exc.resolutionHistory?.resolvedAt ? new Date(exc.resolutionHistory.resolvedAt).toLocaleTimeString() : '08:10 AM'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
