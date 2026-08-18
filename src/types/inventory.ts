export type ZoneId = 'Zone A' | 'Zone B' | 'Zone C' | 'Zone D';

export interface Location3D {
  zone: ZoneId;
  aisle: string; // e.g. 'A1', 'B2'
  shelf: string; // e.g. 'S-01', 'S-04'
  bin: string;   // e.g. 'B-12'
  coordinates: [number, number, number]; // [x, y, z] in 3D grid
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Robotics & Automation' | 'Precision Sensors' | 'Micro-Controllers' | 'Cold-Chain Pharma' | 'Auto Components' | 'Eco Packaging' | 'Power Systems';
  location: Location3D;
  totalStock: number;
  reservedStock: number; // Allocated to open orders
  availableStock: number; // totalStock - reservedStock - damagedStock
  damagedStock: number;
  reorderPoint: number;
  unitPrice: number;
  unitWeightKg: number;
  lastRestocked: string;
  status: 'Healthy' | 'Low Stock' | 'Critical Shortage' | 'Quarantined';
  image?: string;
  barcode: string;
}

export interface StockAdjustmentLog {
  id: string;
  timestamp: string;
  sku: string;
  itemTitle: string;
  type: 'Replenish' | 'Reservation' | 'Damaged Quarantine' | 'Reallocation' | 'Cycle Count';
  quantityDelta: number;
  operator: string;
  reason: string;
}
