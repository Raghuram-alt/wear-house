import { OrderPriority } from './order';

export type RecommendationType = 
  | 'PriorityReallocation' // Take stock from lower-priority orders
  | 'SmartSplit'            // Partial fulfill now, ship remainder later
  | 'SKUSubstitution'       // Substitute with compatible in-stock SKU
  | 'EmergencyCrossZone';   // Transfer stock from overstock/Zone D bay

export interface AllocationOption {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  reasoning: string;
  slaImpact: string; // e.g. "0h SLA delay on source order, prevents $5,000 penalty"
  costImpact: number; // e.g. 0, +$15 shipping, +$50 transfer
  feasibilityScore: number; // 0-100%
  affectedOrders: {
    orderId: string;
    orderNumber: string;
    priority: OrderPriority;
    qtyReallocated: number;
  }[];
  suggestedSubstituteSku?: string;
  suggestedSubstituteName?: string;
  fulfillmentPercentage: number;
}

export interface StockConflict {
  id: string;
  targetOrderId: string;
  targetOrderNumber: string;
  targetCustomer: string;
  priority: OrderPriority;
  sku: string;
  productName: string;
  qtyRequested: number;
  qtyAvailable: number;
  qtyDeficit: number;
  slaDeadline: string;
  createdAt: string;
  options: AllocationOption[];
  recommendedOptionId: string;
}

export interface AllocationAuditLog {
  id: string;
  timestamp: string;
  orderNumber: string;
  actionTaken: string;
  optionType: RecommendationType | 'Manual Override';
  operator: string;
  reason: string;
  resultStatus: string;
}
