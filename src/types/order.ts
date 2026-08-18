export type OrderPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type OrderStatus = 
  | 'Pending'
  | 'Allocating'
  | 'Picking'
  | 'Packing'
  | 'Ready to Ship'
  | 'Dispatched'
  | 'Conflict'
  | 'On Hold';

export interface OrderItem {
  sku: string;
  name: string;
  quantityRequested: number;
  quantityAllocated: number;
  quantityPicked: number;
  unitPrice: number;
  unitWeightKg: number;
  availableFromZone: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  destinationCity: string;
  priority: OrderPriority;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  totalWeightKg: number;
  slaDeadline: string; // ISO String
  createdAt: string;  // ISO String
  assignedPickerId?: string;
  assignedPickerName?: string;
  shippingCarrier: 'FedEx Express' | 'DHL Global' | 'UPS Air' | 'Autonomous Fleet';
  hasConflict: boolean;
  conflictDetails?: string;
  trackingNumber?: string;
}
