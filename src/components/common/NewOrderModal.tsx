import React, { useState } from 'react';
import { X, Plus, ShoppingBag } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useWarehouseStore } from '../../store/useWarehouseStore';
import { OrderPriority } from '../../types/order';

export function NewOrderModal() {
  const { isNewOrderModalOpen, setIsNewOrderModalOpen } = useUIStore();
  const { addOrder, inventory } = useWarehouseStore();

  const [customerName, setCustomerName] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [priority, setPriority] = useState<OrderPriority>('Urgent');
  const [selectedSku, setSelectedSku] = useState(inventory[0]?.sku || '');
  const [quantity, setQuantity] = useState(5);

  if (!isNewOrderModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !destinationCity) return;

    const prod = inventory.find(i => i.sku === selectedSku);

    addOrder({
      customerName,
      destinationCity,
      priority,
      items: [
        {
          sku: selectedSku,
          name: prod?.name || 'Industrial Sensor Component',
          quantityRequested: quantity,
          quantityAllocated: Math.min(quantity, prod?.availableStock || 0),
          quantityPicked: 0,
          unitPrice: prod?.unitPrice || 450,
          unitWeightKg: prod?.unitWeightKg || 1.2,
          availableFromZone: prod?.location.zone || 'Zone A'
        }
      ],
      totalAmount: (prod?.unitPrice || 450) * quantity,
      totalWeightKg: (prod?.unitWeightKg || 1.2) * quantity
    });

    setIsNewOrderModalOpen(false);
    setCustomerName('');
    setDestinationCity('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-mono">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 uppercase">Create New Order Request</h3>
          </div>
          <button onClick={() => setIsNewOrderModalOpen(false)} className="text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Customer / Client Name</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. SpaceX Launch Facility"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Destination City</label>
              <input
                type="text"
                required
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                placeholder="e.g. Cape Canaveral, FL"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as OrderPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500/50"
              >
                <option value="Urgent">🔥 Urgent (&lt; 2h SLA)</option>
                <option value="High">⚡ High (&lt; 6h SLA)</option>
                <option value="Medium">📦 Medium (&lt; 24h SLA)</option>
                <option value="Low">⏱️ Low (&lt; 48h SLA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="text-slate-400 block mb-1">Select SKU Item</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500/50 truncate"
              >
                {inventory.map(item => (
                  <option key={item.sku} value={item.sku}>
                    {item.sku} — {item.name} (Avail: {item.availableStock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Quantity</label>
              <input
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsNewOrderModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg font-bold shadow-cyan-glow"
            >
              Create & Trigger Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
