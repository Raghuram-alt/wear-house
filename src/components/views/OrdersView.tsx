import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Clock, 
  AlertCircle, 
  Truck, 
  CheckCircle2, 
  ChevronRight, 
  PlusCircle,
  Filter,
  UserCheck
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { useUIStore } from '../../store/useUIStore';
import { Order, OrderStatus, OrderPriority } from '../../types/order';
import { formatCurrency, formatTimeRemaining } from '../../utils/formatters';

export function OrdersView() {
  const { orders, startPickSession, dispatchOrder } = useWarehouseStore();
  const { setActiveTab, setIsNewOrderModalOpen, searchQuery } = useUIStore();

  const [selectedPriority, setSelectedPriority] = useState<OrderPriority | 'All'>('All');
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<Order | null>(orders[0]);

  // Status pipeline columns
  const pipelineStages: OrderStatus[] = [
    'Pending',
    'Allocating',
    'Picking',
    'Packing',
    'Ready to Ship',
    'Dispatched'
  ];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.destinationCity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = selectedPriority === 'All' || o.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center gap-2">
            ORDER FULFILLMENT PIPELINE
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Priority-based workflow queue • Real-Time SLA Countdowns
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 px-4 py-2 rounded-xl font-mono text-xs font-bold shadow-cyan-glow transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Create New Order</span>
          </button>
        </div>
      </div>

      {/* Priority Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-bold mr-2">Filter Priority:</span>
          {(['All', 'Urgent', 'High', 'Medium', 'Low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                selectedPriority === p
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-bold shadow-cyan-glow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {p === 'Urgent' ? '🔥 Urgent' : p === 'High' ? '⚡ High' : p === 'Medium' ? '📦 Medium' : p === 'Low' ? '⏱️ Low' : 'All'}
            </button>
          ))}
        </div>

        <div className="text-slate-400">
          Showing <span className="text-cyan-400 font-bold">{filteredOrders.length}</span> Active Orders
        </div>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => {
          const stageOrders = filteredOrders.filter(o => o.status === stage);

          return (
            <div key={stage} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-w-[240px]">
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 font-mono">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{stage}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800">
                  {stageOrders.length}
                </span>
              </div>

              {/* Stage Order Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {stageOrders.map((order) => {
                  const sla = formatTimeRemaining(order.slaDeadline);
                  const isSelected = selectedOrderForDrawer?.id === order.id;

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderForDrawer(order)}
                      className={`bg-slate-950 p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                        order.hasConflict
                          ? 'border-rose-500/60 shadow-rose-glow'
                          : isSelected
                          ? 'border-cyan-500/60 shadow-cyan-glow'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Priority Tag & SLA */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          order.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                            : order.priority === 'High'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {order.priority}
                        </span>

                        <span className={`text-[10px] font-mono font-bold ${
                          sla.isCritical ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          SLA: {sla.text}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-slate-100 font-mono">
                        {order.orderNumber}
                      </div>

                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {order.customerName}
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono mt-2 flex justify-between items-center">
                        <span>{order.items.length} SKUs</span>
                        <span className="text-slate-300 font-bold">{formatCurrency(order.totalAmount)}</span>
                      </div>

                      {/* Conflict Warning */}
                      {order.hasConflict && (
                        <div className="mt-2.5 p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-400 flex items-center justify-between">
                          <span className="truncate">Stock Deficit</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab('allocation');
                            }}
                            className="underline font-bold"
                          >
                            Resolve →
                          </button>
                        </div>
                      )}

                      {/* Quick Action Button */}
                      {stage === 'Allocating' && !order.hasConflict && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startPickSession(order.id);
                            setActiveTab('picking');
                          }}
                          className="mt-3 w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold rounded-lg shadow-cyan-glow transition-all"
                        >
                          Start Picking →
                        </button>
                      )}

                      {stage === 'Ready to Ship' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatchOrder(order.id);
                          }}
                          className="mt-3 w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded-lg shadow-emerald-glow transition-all"
                        >
                          Dispatch Truck →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
