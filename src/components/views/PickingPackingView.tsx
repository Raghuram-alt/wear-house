import React, { useState } from 'react';
import { 
  Barcode, 
  CheckCircle2, 
  Boxes, 
  Truck, 
  MapPin, 
  QrCode, 
  AlertTriangle, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { DispatchTruck3D } from '../3d/DispatchTruck3D';
import { formatCurrency } from '../../utils/formatters';

export function PickingPackingView() {
  const { 
    orders, 
    activePickSession, 
    scanPickItem, 
    completePickSession, 
    dispatchOrder, 
    dispatchSuccessModalOrder 
  } = useWarehouseStore();

  const [scanInput, setScanInput] = useState('');
  const [selectedBoxSize, setSelectedBoxSize] = useState<'Small Box A' | 'Medium Box B' | 'Heavy Duty Pallet C'>('Medium Box B');

  // Orders currently ready for packing or picking
  const pickingOrders = orders.filter(o => o.status === 'Picking');
  const packingOrders = orders.filter(o => o.status === 'Packing');

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const success = scanPickItem(scanInput.trim());
    setScanInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center gap-2">
            <Barcode className="h-6 w-6 text-cyan-400" />
            ACTIVE PICKING & PACKING STATIONS
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Guided Pick Routes • Barcode Scanning Simulator • Dispatch Celebration
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            {pickingOrders.length} Picking • {packingOrders.length} Packing
          </span>
        </div>
      </div>

      {/* 3D Dispatch Celebration Modal */}
      {dispatchSuccessModalOrder && (
        <DispatchTruck3D order={dispatchSuccessModalOrder} />
      )}

      {/* Active Guided Pick Session Drawer */}
      {activePickSession ? (
        <div className="bg-slate-900/90 border border-cyan-500/50 rounded-2xl p-6 shadow-cyan-glow space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                ACTIVE WAVE: ORDER #{activePickSession.orderNumber}
              </span>
              <h3 className="text-xl font-bold text-slate-100 font-mono mt-1">
                Assigned Picker: {activePickSession.pickerName}
              </h3>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-400">Progress:</span>
              <div className="text-lg font-bold text-emerald-400">
                {activePickSession.items.filter(i => i.isCompleted).length} / {activePickSession.items.length} Items Picked
              </div>
            </div>
          </div>

          {/* Interactive Barcode Simulator Input */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono space-y-3">
            <label className="text-xs text-cyan-400 font-bold flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Simulated Handheld Barcode Scanner Input:
            </label>
            <form onSubmit={handleBarcodeSubmit} className="flex gap-3">
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Type or click SKU to scan (e.g. SEN-3042, ROB-8821)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="py-2 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-cyan-glow transition-all"
              >
                Scan Barcode
              </button>
            </form>
          </div>

          {/* Step-by-Step Pick List Route */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Optimized Aisle Picking Path:</h4>

            <div className="space-y-2">
              {activePickSession.items.map((item, idx) => (
                <div
                  key={item.sku}
                  onClick={() => scanPickItem(item.sku)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-300'
                      : idx === activePickSession.currentStepIndex
                      ? 'bg-slate-950 border-cyan-500 shadow-cyan-glow text-slate-100'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${item.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {item.isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <MapPin className="h-5 w-5 text-cyan-400" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-100">{item.productName}</div>
                      <div className="text-xs text-slate-400">SKU: <strong className="text-cyan-400">{item.sku}</strong> • Bin Location: {item.location}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold block">{item.qtyPicked} / {item.qtyRequested} units</span>
                    <span className="text-[10px] text-slate-500">Tap to Quick Scan</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Pick Session Button */}
          {activePickSession.isFinished && (
            <button
              onClick={completePickSession}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-sm rounded-xl shadow-emerald-glow transition-all flex items-center justify-center space-x-2"
            >
              <PackageCheck className="h-5 w-5" />
              <span>Complete Pick Wave & Move to Packing Station →</span>
            </button>
          )}
        </div>
      ) : (
        /* Pack Station Inspection & Verification */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
          {/* Left Column: Packing Station Checklist */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Boxes className="h-5 w-5 text-cyan-400" />
              Pack Verification Station ({packingOrders.length} Ready)
            </h3>

            {packingOrders.length > 0 ? (
              <div className="space-y-4">
                {packingOrders.map((order) => (
                  <div key={order.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-cyan-400">{order.orderNumber}</span>
                        <h4 className="text-sm font-bold text-slate-100">{order.customerName}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        Picked & Verified
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-400">
                      {order.items.map(item => (
                        <div key={item.sku} className="flex justify-between py-1 border-b border-slate-900">
                          <span>{item.name} ({item.sku})</span>
                          <span className="text-slate-200 font-bold">{item.quantityRequested} units</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <select
                        value={selectedBoxSize}
                        onChange={(e) => setSelectedBoxSize(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none"
                      >
                        <option value="Small Box A">Small Box A (1.2 kg limit)</option>
                        <option value="Medium Box B">Medium Box B (15 kg limit)</option>
                        <option value="Heavy Duty Pallet C">Heavy Duty Pallet C (500 kg limit)</option>
                      </select>

                      <button
                        onClick={() => dispatchOrder(order.id)}
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-emerald-glow transition-all flex items-center justify-center space-x-1.5"
                      >
                        <Truck className="h-4 w-4" />
                        <span>Dispatch Order →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
                No orders currently waiting at Packing Station. Select an order in the Orders Pipeline to start a pick session.
              </div>
            )}
          </div>

          {/* Right Column: Active Orders Pending Pick Wave Start */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Barcode className="h-5 w-5 text-cyan-400" />
              Orders Queue Ready for Pick Wave ({pickingOrders.length})
            </h3>

            {pickingOrders.length > 0 ? (
              <div className="space-y-3">
                {pickingOrders.map((order) => (
                  <div key={order.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{order.orderNumber}</span>
                        <span className="text-xs text-slate-400">({order.customerName})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{order.items.length} SKUs requested</div>
                    </div>

                    <button
                      onClick={() => useWarehouseStore.getState().startPickSession(order.id)}
                      className="py-1.5 px-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-cyan-glow transition-all"
                    >
                      Start Wave →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
                Zero orders in active picking state.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
