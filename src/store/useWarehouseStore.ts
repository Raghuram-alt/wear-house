import { create } from 'zustand';
import { InventoryItem } from '../types/inventory';
import { Order, OrderStatus } from '../types/order';
import { StockConflict, AllocationAuditLog, RecommendationType } from '../types/allocation';
import { WarehouseException } from '../types/exception';
import { WarehouseAnalytics } from '../types/analytics';
import { PickerProfile, PickSession } from '../types/picker';

import { MOCK_PRODUCTS } from '../mock/productsData';
import { MOCK_ORDERS } from '../mock/ordersData';
import { MOCK_EXCEPTIONS } from '../mock/exceptionsData';
import { MOCK_ANALYTICS, MOCK_PICKERS } from '../mock/analyticsData';
import { analyzeWarehouseConflicts } from '../utils/allocationEngine';
import { playBeepSound } from '../utils/audio';

interface WarehouseStore {
  inventory: InventoryItem[];
  orders: Order[];
  conflicts: StockConflict[];
  exceptions: WarehouseException[];
  analytics: WarehouseAnalytics;
  pickers: PickerProfile[];
  activePickSession: PickSession | null;
  allocationLogs: AllocationAuditLog[];
  dispatchSuccessModalOrder: Order | null;

  // Actions
  recalculateConflicts: () => void;
  applyAllocationOption: (conflictId: string, optionId: string) => void;
  manualOverrideAllocation: (conflictId: string, note: string) => void;
  startPickSession: (orderId: string) => void;
  scanPickItem: (sku: string) => boolean;
  completePickSession: () => void;
  dispatchOrder: (orderId: string) => void;
  closeDispatchModal: () => void;
  resolveException: (exceptionId: string, actionChosen: string, note: string) => void;
  replenishStock: (sku: string, qty: number) => void;
  addOrder: (newOrder: Partial<Order>) => void;
  quarantineBinItem: (sku: string) => void;
}

export const useWarehouseStore = create<WarehouseStore>((set, get) => {
  const initialConflicts = analyzeWarehouseConflicts(MOCK_ORDERS, MOCK_PRODUCTS);

  return {
    inventory: MOCK_PRODUCTS,
    orders: MOCK_ORDERS,
    conflicts: initialConflicts,
    exceptions: MOCK_EXCEPTIONS,
    analytics: MOCK_ANALYTICS,
    pickers: MOCK_PICKERS,
    activePickSession: null,
    allocationLogs: [
      {
        id: 'log-01',
        timestamp: '2026-08-18T10:15:00Z',
        orderNumber: 'ORD-9903',
        actionTaken: 'Priority Stock Reallocation executed',
        optionType: 'PriorityReallocation',
        operator: 'System AI Engine',
        reason: 'Prevented SLA penalty for Boston Dynamics Urgent Order.',
        resultStatus: 'Allocated & Moved to Picking'
      }
    ],
    dispatchSuccessModalOrder: null,

    recalculateConflicts: () => {
      const { orders, inventory } = get();
      const updatedConflicts = analyzeWarehouseConflicts(orders, inventory);
      set({ conflicts: updatedConflicts });
    },

    applyAllocationOption: (conflictId: string, optionId: string) => {
      const { conflicts, orders, inventory, allocationLogs } = get();
      const conflict = conflicts.find(c => c.id === conflictId);
      if (!conflict) return;

      const option = conflict.options.find(o => o.id === optionId);
      if (!option) return;

      playBeepSound('success');

      let updatedOrders = [...orders];
      let updatedInventory = [...inventory];

      const targetOrderIndex = updatedOrders.findIndex(o => o.id === conflict.targetOrderId);
      if (targetOrderIndex === -1) return;

      const targetOrder = { ...updatedOrders[targetOrderIndex] };
      const itemIndex = targetOrder.items.findIndex(i => i.sku === conflict.sku);
      if (itemIndex === -1) return;

      const targetItem = { ...targetOrder.items[itemIndex] };

      if (option.type === 'PriorityReallocation') {
        // Take stock from affected lower-priority orders
        for (const aff of option.affectedOrders) {
          const srcIdx = updatedOrders.findIndex(o => o.id === aff.orderId);
          if (srcIdx !== -1) {
            const srcOrder = { ...updatedOrders[srcIdx] };
            const srcItemIdx = srcOrder.items.findIndex(i => i.sku === conflict.sku);
            if (srcItemIdx !== -1) {
              const srcItem = { ...srcOrder.items[srcItemIdx] };
              srcItem.quantityAllocated = Math.max(0, srcItem.quantityAllocated - aff.qtyReallocated);
              srcOrder.items[srcItemIdx] = srcItem;
              updatedOrders[srcIdx] = srcOrder;
            }
          }
        }

        // Allocate to target order
        targetItem.quantityAllocated = targetItem.quantityRequested;
        targetOrder.items[itemIndex] = targetItem;
        targetOrder.status = 'Picking';
        targetOrder.hasConflict = false;
        targetOrder.conflictDetails = undefined;
        updatedOrders[targetOrderIndex] = targetOrder;
      } else if (option.type === 'SKUSubstitution') {
        // Substitute SKU
        if (option.suggestedSubstituteSku) {
          targetItem.sku = option.suggestedSubstituteSku;
          targetItem.name = option.suggestedSubstituteName || targetItem.name;
          targetItem.quantityAllocated = targetItem.quantityRequested;
          targetOrder.items[itemIndex] = targetItem;
          targetOrder.status = 'Picking';
          targetOrder.hasConflict = false;
          targetOrder.conflictDetails = undefined;
          updatedOrders[targetOrderIndex] = targetOrder;
        }
      } else if (option.type === 'EmergencyCrossZone') {
        // Fetch from Zone D
        targetItem.quantityAllocated = targetItem.quantityRequested;
        targetOrder.items[itemIndex] = targetItem;
        targetOrder.status = 'Picking';
        targetOrder.hasConflict = false;
        targetOrder.conflictDetails = undefined;
        updatedOrders[targetOrderIndex] = targetOrder;

        // Reduce Zone D item stock
        updatedInventory = updatedInventory.map(item => {
          if (item.sku === conflict.sku || item.sku === 'SEN-3042-D' || item.sku === 'PWR-6020-D') {
            return {
              ...item,
              availableStock: Math.max(0, item.availableStock - conflict.qtyDeficit),
              reservedStock: item.reservedStock + conflict.qtyDeficit
            };
          }
          return item;
        });
      } else if (option.type === 'SmartSplit') {
        // Split shipment
        targetItem.quantityAllocated = conflict.qtyAvailable;
        targetOrder.items[itemIndex] = targetItem;
        targetOrder.status = 'Picking';
        targetOrder.hasConflict = false;
        targetOrder.conflictDetails = `Partial shipment approved (${conflict.qtyAvailable}/${targetItem.quantityRequested} units). Remainder backordered.`;
        updatedOrders[targetOrderIndex] = targetOrder;
      }

      // Add to audit log
      const newLog: AllocationAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        orderNumber: targetOrder.orderNumber,
        actionTaken: `${option.title} applied for SKU ${conflict.sku}`,
        optionType: option.type,
        operator: 'Operations Manager',
        reason: option.reasoning,
        resultStatus: 'Conflict Resolved -> Status: Picking'
      };

      // Recalculate remaining conflicts
      const newConflicts = analyzeWarehouseConflicts(updatedOrders, updatedInventory);

      set({
        orders: updatedOrders,
        inventory: updatedInventory,
        conflicts: newConflicts,
        allocationLogs: [newLog, ...allocationLogs]
      });
    },

    manualOverrideAllocation: (conflictId: string, note: string) => {
      const { conflicts, orders, inventory, allocationLogs } = get();
      const conflict = conflicts.find(c => c.id === conflictId);
      if (!conflict) return;

      playBeepSound('alert');

      const updatedOrders = orders.map(o => {
        if (o.id === conflict.targetOrderId) {
          return {
            ...o,
            status: 'Picking' as OrderStatus,
            hasConflict: false,
            conflictDetails: `Manual Manager Override: ${note}`
          };
        }
        return o;
      });

      const newLog: AllocationAuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        orderNumber: conflict.targetOrderNumber,
        actionTaken: 'Manual Override Applied',
        optionType: 'Manual Override',
        operator: 'Shift Supervisor',
        reason: note,
        resultStatus: 'Override Approved -> Force Picked'
      };

      const newConflicts = analyzeWarehouseConflicts(updatedOrders, inventory);

      set({
        orders: updatedOrders,
        conflicts: newConflicts,
        allocationLogs: [newLog, ...allocationLogs]
      });
    },

    startPickSession: (orderId: string) => {
      const { orders, inventory } = get();
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      playBeepSound('scan');

      const pickTasks = order.items.map(item => {
        const prod = inventory.find(p => p.sku === item.sku);
        const loc = prod 
          ? `Zone ${prod.location.zone} | Aisle ${prod.location.aisle} | Shelf ${prod.location.shelf} | Bin ${prod.location.bin}`
          : 'Zone A | Aisle A1 | Bin B-01';
        return {
          sku: item.sku,
          productName: item.name,
          qtyRequested: item.quantityRequested,
          qtyPicked: 0,
          location: loc,
          isCompleted: false,
          hasException: false
        };
      });

      set({
        activePickSession: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          priority: order.priority,
          pickerId: 'p-01',
          pickerName: 'Alex Mercer',
          startedAt: new Date().toISOString(),
          items: pickTasks,
          currentStepIndex: 0,
          isFinished: false
        }
      });
    },

    scanPickItem: (sku: string) => {
      const { activePickSession, inventory } = get();
      if (!activePickSession || activePickSession.isFinished) return false;

      const items = [...activePickSession.items];
      const targetIdx = items.findIndex(i => i.sku === sku && !i.isCompleted);

      if (targetIdx !== -1) {
        playBeepSound('scan');

        const item = { ...items[targetIdx] };
        item.qtyPicked = item.qtyRequested;
        item.isCompleted = true;
        items[targetIdx] = item;

        const nextUncompletedIdx = items.findIndex(i => !i.isCompleted);
        const isAllDone = nextUncompletedIdx === -1;

        set({
          activePickSession: {
            ...activePickSession,
            items,
            currentStepIndex: isAllDone ? items.length - 1 : nextUncompletedIdx,
            isFinished: isAllDone
          }
        });
        return true;
      }

      playBeepSound('alert');
      return false;
    },

    completePickSession: () => {
      const { activePickSession, orders } = get();
      if (!activePickSession) return;

      playBeepSound('success');

      const updatedOrders = orders.map(o => {
        if (o.id === activePickSession.orderId) {
          return {
            ...o,
            status: 'Packing' as OrderStatus
          };
        }
        return o;
      });

      set({
        orders: updatedOrders,
        activePickSession: null
      });
    },

    dispatchOrder: (orderId: string) => {
      const { orders, analytics } = get();
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      playBeepSound('success');

      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Dispatched' as OrderStatus,
            trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`
          };
        }
        return o;
      });

      const updatedAnalytics: WarehouseAnalytics = {
        ...analytics,
        dispatchedOrdersToday: analytics.dispatchedOrdersToday + 1
      };

      set({
        orders: updatedOrders,
        analytics: updatedAnalytics,
        dispatchSuccessModalOrder: order
      });
    },

    closeDispatchModal: () => {
      set({ dispatchSuccessModalOrder: null });
    },

    resolveException: (exceptionId: string, actionChosen: string, note: string) => {
      const { exceptions } = get();
      playBeepSound('success');

      const updatedExceptions = exceptions.map(exc => {
        if (exc.id === exceptionId) {
          return {
            ...exc,
            status: 'Resolved' as const,
            resolutionHistory: {
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Operations Supervisor',
              actionChosen,
              outcomeNote: note
            }
          };
        }
        return exc;
      });

      set({ exceptions: updatedExceptions });
    },

    replenishStock: (sku: string, qty: number) => {
      const { inventory, orders } = get();
      playBeepSound('success');

      const updatedInventory = inventory.map(item => {
        if (item.sku === sku) {
          const newTotal = item.totalStock + qty;
          const newAvail = item.availableStock + qty;
          return {
            ...item,
            totalStock: newTotal,
            availableStock: newAvail,
            status: newAvail > item.reorderPoint ? 'Healthy' as const : 'Low Stock' as const,
            lastRestocked: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      });

      const newConflicts = analyzeWarehouseConflicts(orders, updatedInventory);

      set({
        inventory: updatedInventory,
        conflicts: newConflicts
      });
    },

    addOrder: (newOrderData: Partial<Order>) => {
      const { orders, inventory } = get();
      playBeepSound('success');

      const orderNumber = `ORD-${Math.floor(9000 + Math.random() * 1000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customerName: newOrderData.customerName || 'Global Industrial Client',
        destinationCity: newOrderData.destinationCity || 'New York, NY',
        priority: newOrderData.priority || 'High',
        status: 'Allocating',
        items: newOrderData.items || [],
        totalAmount: newOrderData.totalAmount || 5000,
        totalWeightKg: newOrderData.totalWeightKg || 12,
        slaDeadline: newOrderData.slaDeadline || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        shippingCarrier: newOrderData.shippingCarrier || 'FedEx Express',
        hasConflict: false
      };

      const updatedOrders = [newOrder, ...orders];
      const newConflicts = analyzeWarehouseConflicts(updatedOrders, inventory);

      set({
        orders: updatedOrders,
        conflicts: newConflicts
      });
    },

    quarantineBinItem: (sku: string) => {
      const { inventory } = get();
      playBeepSound('alert');

      const updatedInventory = inventory.map(item => {
        if (item.sku === sku) {
          return {
            ...item,
            damagedStock: item.damagedStock + 1,
            availableStock: Math.max(0, item.availableStock - 1),
            status: 'Quarantined' as const
          };
        }
        return item;
      });

      set({ inventory: updatedInventory });
    }
  };
});
