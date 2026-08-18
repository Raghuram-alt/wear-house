import { WarehouseException } from '../types/exception';

export const MOCK_EXCEPTIONS: WarehouseException[] = [
  {
    id: 'exc-01',
    exceptionCode: 'EXC-8801',
    type: 'Damaged Item',
    orderNumber: 'ORD-9904',
    sku: 'PHA-1002',
    productName: 'Biologics Vaccine Thermal Carrier Unit -80C',
    location: 'Zone C - Aisle C1 - Shelf S-01 - Bin B-01',
    reportedBy: 'Marcus Vance (Picker)',
    timestamp: '2026-08-18T10:45:00Z',
    severity: 'High',
    status: 'Active',
    notes: 'Outer vacuum seal compromised on 2 carrier units in bin slot. Temperature sensor triggered alert -42C.',
    recommendedResolution: {
      title: 'Quarantine Slot & Reroute to Secondary Bin',
      action: 'QuarantineBin',
      description: 'Mark Bin B-01 as Quarantined. Trigger inventory adjustment to write off 2 damaged units. Auto-reallocate replacement from Bin B-04.'
    }
  },
  {
    id: 'exc-02',
    exceptionCode: 'EXC-8802',
    type: 'Missing Stock in Bin',
    orderNumber: 'ORD-9901',
    sku: 'SEN-3042',
    productName: 'High-Precision Optical LiDAR Sensor 360',
    location: 'Zone A - Aisle A1 - Shelf S-02 - Bin B-02',
    reportedBy: 'Alex Mercer (Picker)',
    timestamp: '2026-08-18T09:30:00Z',
    severity: 'High',
    status: 'Active',
    notes: 'System inventory recorded 15 units available in Bin B-02, but physical bin count was only 1 unit.',
    recommendedResolution: {
      title: 'Execute Emergency Cross-Zone Transfer from Bay D',
      action: 'DirectSwap',
      description: 'Transfer 14 units from Overstock Bay D (Bin D2-14) to fulfill Urgent Order #ORD-9901 immediately.'
    }
  },
  {
    id: 'exc-03',
    exceptionCode: 'EXC-8803',
    type: 'Mislabeled Barcode',
    sku: 'PWR-6020',
    productName: 'Lithium-Ion Modular Battery Pack 48V 100Ah',
    location: 'Zone B - Aisle B1 - Shelf S-01 - Bin B-01',
    reportedBy: 'Elena Rostova (Picker)',
    timestamp: '2026-08-18T08:15:00Z',
    severity: 'Medium',
    status: 'Under Investigation',
    notes: 'Barcode scanner read code as 6020448192-B instead of standard 6020448192. Labeling vendor error.',
    recommendedResolution: {
      title: 'Override Barcode Scan & Relabel Bin',
      action: 'ReroutePicker',
      description: 'Print updated barcode label at Packing Station B and link to SKU PWR-6020 in ERP system.'
    }
  },
  {
    id: 'exc-04',
    exceptionCode: 'EXC-8804',
    type: 'Bay Obstruction',
    sku: 'HEV-9904',
    productName: 'Hydraulic Cylinder Assembly 500mm Stroke',
    location: 'Zone D - Aisle D1 - Shelf S-01 - Bin B-01',
    reportedBy: 'AGV Robot #04 (Autonomous Telemetry)',
    timestamp: '2026-08-18T07:50:00Z',
    severity: 'Low',
    status: 'Resolved',
    notes: 'AGV navigation path blocked by spilled pallet wrapping material. AGV re-routed around Aisle D1.',
    recommendedResolution: {
      title: 'Clear Obstruction & Reset AGV Navigation Waypoint',
      action: 'ReroutePicker',
      description: 'Facility maintenance cleared pallet wrap at 08:10. Path re-opened.'
    },
    resolutionHistory: {
      resolvedAt: '2026-08-18T08:10:00Z',
      resolvedBy: 'Robotics Control Operator',
      actionChosen: 'Clear Obstruction',
      outcomeNote: 'Path cleared, AGV #04 resumed regular picking queue.'
    }
  }
];
