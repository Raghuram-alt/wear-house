export interface PickerProfile {
  id: string;
  name: string;
  avatar: string;
  assignedZone: string;
  status: 'Active Picking' | 'Packing' | 'Idle' | 'On Break' | 'Assisting Exception';
  currentOrderId?: string;
  itemsPickedToday: number;
  accuracyRate: number; // 0-100%
  speedItemsPerHour: number;
}

export interface PickTaskItem {
  sku: string;
  productName: string;
  qtyRequested: number;
  qtyPicked: number;
  location: string; // e.g. "Aisle A1, Shelf S-02, Bin B-05"
  scannedBarcode?: string;
  isCompleted: boolean;
  hasException: boolean;
}

export interface PickSession {
  orderId: string;
  orderNumber: string;
  priority: string;
  pickerId: string;
  pickerName: string;
  startedAt: string;
  items: PickTaskItem[];
  currentStepIndex: number;
  isFinished: boolean;
}
