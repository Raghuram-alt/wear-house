import { WarehouseAnalytics } from '../types/analytics';
import { PickerProfile } from '../types/picker';

export const MOCK_ANALYTICS: WarehouseAnalytics = {
  fulfillmentRatePct: 94.8,
  activeConflictsCount: 2,
  activeExceptionsCount: 3,
  onTimeDispatchPct: 98.2,
  averagePickTimeMins: 11.4,
  totalOrdersToday: 48,
  dispatchedOrdersToday: 34,
  slaRiskCount: 2,
  savedPenaltiesAmount: 18500,
  hourlyThroughput: [
    { hour: '06:00', pickedUnits: 42, dispatchedOrders: 3, targetUnits: 40 },
    { hour: '07:00', pickedUnits: 65, dispatchedOrders: 5, targetUnits: 60 },
    { hour: '08:00', pickedUnits: 98, dispatchedOrders: 8, targetUnits: 80 },
    { hour: '09:00', pickedUnits: 124, dispatchedOrders: 10, targetUnits: 100 },
    { hour: '10:00', pickedUnits: 142, dispatchedOrders: 12, targetUnits: 110 },
    { hour: '11:00 (Current)', pickedUnits: 118, dispatchedOrders: 9, targetUnits: 110 }
  ],
  zoneMetrics: [
    { zone: 'Zone A (Electronics & Sensors)', activePickers: 3, stockOccupancyPct: 88, exceptionCount: 1, picksPerHour: 165 },
    { zone: 'Zone B (Power Systems & Auto)', activePickers: 2, stockOccupancyPct: 76, exceptionCount: 1, picksPerHour: 110 },
    { zone: 'Zone C (Cold-Chain Pharma)', activePickers: 2, stockOccupancyPct: 62, exceptionCount: 1, picksPerHour: 85 },
    { zone: 'Zone D (Overstock & Heavy Bay)', activePickers: 1, stockOccupancyPct: 91, exceptionCount: 0, picksPerHour: 45 }
  ]
};

export const MOCK_PICKERS: PickerProfile[] = [
  {
    id: 'p-01',
    name: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedZone: 'Zone A',
    status: 'Active Picking',
    currentOrderId: 'ORD-9903',
    itemsPickedToday: 184,
    accuracyRate: 99.4,
    speedItemsPerHour: 145
  },
  {
    id: 'p-02',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    assignedZone: 'Zone B',
    status: 'Active Picking',
    currentOrderId: 'ORD-9902',
    itemsPickedToday: 162,
    accuracyRate: 98.8,
    speedItemsPerHour: 132
  },
  {
    id: 'p-03',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedZone: 'Zone C',
    status: 'Packing',
    currentOrderId: 'ORD-9904',
    itemsPickedToday: 195,
    accuracyRate: 99.8,
    speedItemsPerHour: 158
  },
  {
    id: 'p-04',
    name: 'Sarah Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    assignedZone: 'Zone D',
    status: 'Active Picking',
    currentOrderId: 'ORD-8814',
    itemsPickedToday: 138,
    accuracyRate: 99.1,
    speedItemsPerHour: 120
  }
];
