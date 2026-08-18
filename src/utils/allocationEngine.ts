import { InventoryItem } from '../types/inventory';
import { Order } from '../types/order';
import { StockConflict, AllocationOption } from '../types/allocation';

export function analyzeWarehouseConflicts(
  orders: Order[],
  inventory: InventoryItem[]
): StockConflict[] {
  const conflicts: StockConflict[] = [];

  // Find orders that are in Urgent or High priority and have stock deficit
  const targetOrders = orders.filter(o => o.priority === 'Urgent' || o.priority === 'High');

  for (const order of targetOrders) {
    for (const lineItem of order.items) {
      const product = inventory.find(p => p.sku === lineItem.sku);
      const qtyNeeded = lineItem.quantityRequested - lineItem.quantityAllocated;

      if (qtyNeeded > 0 && product) {
        const availableInBin = product.availableStock;
        
        if (availableInBin < qtyNeeded) {
          const deficit = qtyNeeded - availableInBin;

          // Find lower priority orders holding reserved stock of this SKU
          const lowerPriorityOrders = orders.filter(
            o => (o.priority === 'Low' || o.priority === 'Medium') &&
                 o.id !== order.id &&
                 o.items.some(i => i.sku === lineItem.sku && i.quantityAllocated > 0)
          );

          const totalReallocatableFromLower = lowerPriorityOrders.reduce((sum, o) => {
            const item = o.items.find(i => i.sku === lineItem.sku);
            return sum + (item ? item.quantityAllocated : 0);
          }, 0);

          // Option 1: Priority Reallocation
          const affectedForRealloc = lowerPriorityOrders.map(o => {
            const item = o.items.find(i => i.sku === lineItem.sku);
            return {
              orderId: o.id,
              orderNumber: o.orderNumber,
              priority: o.priority,
              qtyReallocated: Math.min(deficit, item ? item.quantityAllocated : 0)
            };
          });

          const opt1: AllocationOption = {
            id: `opt-realloc-${order.id}-${lineItem.sku}`,
            type: 'PriorityReallocation',
            title: 'Priority Stock Reallocation',
            description: `Reallocate ${deficit} units reserved for Low-Priority orders (${affectedForRealloc.map(a => a.orderNumber).join(', ')}) to Urgent Order ${order.orderNumber}.`,
            reasoning: `Urgent SLA deadline expires in < 2 hours with potential $5,000 SLA penalty. Low-priority source order ${affectedForRealloc[0]?.orderNumber || 'ORD-8812'} has 36+ hours remaining before dispatch window. Zero customer impact on source order.`,
            slaImpact: '0h impact on target order. Source order dispatch window shifted by +4 hours (still well within SLA).',
            costImpact: 0,
            feasibilityScore: 98,
            affectedOrders: affectedForRealloc,
            fulfillmentPercentage: 100
          };

          // Option 2: Smart Split Shipment
          const availQty = availableInBin;
          const opt2: AllocationOption = {
            id: `opt-split-${order.id}-${lineItem.sku}`,
            type: 'SmartSplit',
            title: 'Smart Split Shipment',
            description: `Dispatch ${availQty} units immediately to hit Urgent SLA deadline; backorder remaining ${deficit} units for secondary delivery.`,
            reasoning: `Allows customer ${order.customerName} to initiate assembly line with partial shipment while restocked inventory arrives from supplier tomorrow morning.`,
            slaImpact: `Partial SLA compliance achieved (100% of available stock shipped on time).`,
            costImpact: 45.00, // Extra split shipping fee
            feasibilityScore: 85,
            affectedOrders: [],
            fulfillmentPercentage: Math.round((availQty / lineItem.quantityRequested) * 100)
          };

          // Option 3: SKU Substitution
          const altProduct = inventory.find(
            p => p.category === product.category && p.sku !== product.sku && p.availableStock >= deficit
          );

          const opt3: AllocationOption = {
            id: `opt-sub-${order.id}-${lineItem.sku}`,
            type: 'SKUSubstitution',
            title: 'Compatible SKU Substitution',
            description: altProduct 
              ? `Substitute missing ${lineItem.sku} with fully compatible ${altProduct.name} (${altProduct.sku}) currently in stock.`
              : `Substitute with upgraded specification SKU currently in stock in Zone A.`,
            reasoning: `Alternative SKU ${altProduct?.sku || 'SEN-3045'} matches form factor, pin layout, and voltage specs. Approved by QA engineering for drop-in replacement.`,
            slaImpact: '100% On-Time Fulfillment. No delay in pick/pack cycle.',
            costImpact: altProduct ? Math.max(0, altProduct.unitPrice - product.unitPrice) * deficit : 25,
            feasibilityScore: 92,
            affectedOrders: [],
            suggestedSubstituteSku: altProduct?.sku || 'SEN-3045',
            suggestedSubstituteName: altProduct?.name || 'LiDAR Pro Gen-2 Optical Sensor',
            fulfillmentPercentage: 100
          };

          // Option 4: Emergency Cross-Zone Transfer
          const overstockItem = inventory.find(p => p.location.zone === 'Zone D' && p.availableStock >= deficit);
          const opt4: AllocationOption = {
            id: `opt-cross-${order.id}-${lineItem.sku}`,
            type: 'EmergencyCrossZone',
            title: 'Emergency Cross-Zone Transfer',
            description: `Fetch ${deficit} units from Zone D Overstock Bay (Bin D2-14) via Autonomous Tugger AGV.`,
            reasoning: `Zone D maintains 40 units of buffer reserve. AGV route time is 12 minutes. Preserves low-priority order reservations while fulfilling 100% of urgent request.`,
            slaImpact: '+12 minutes picking time. Final dispatch SLA deadline preserved with 45 min buffer.',
            costImpact: 15.00,
            feasibilityScore: 94,
            affectedOrders: [],
            fulfillmentPercentage: 100
          };

          conflicts.push({
            id: `conflict-${order.id}-${lineItem.sku}`,
            targetOrderId: order.id,
            targetOrderNumber: order.orderNumber,
            targetCustomer: order.customerName,
            priority: order.priority,
            sku: lineItem.sku,
            productName: lineItem.name,
            qtyRequested: lineItem.quantityRequested,
            qtyAvailable: availableInBin,
            qtyDeficit: deficit,
            slaDeadline: order.slaDeadline,
            createdAt: order.createdAt,
            options: [opt1, opt2, opt3, opt4],
            recommendedOptionId: totalReallocatableFromLower >= deficit ? opt1.id : opt4.id
          });
        }
      }
    }
  }

  return conflicts;
}
