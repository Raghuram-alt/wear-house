import { Order } from '../types/order';

const NOW = new Date('2026-08-18T11:21:00Z');
const addHours = (h: number) => new Date(NOW.getTime() + h * 3600 * 1000).toISOString();
const subHours = (h: number) => new Date(NOW.getTime() - h * 3600 * 1000).toISOString();

export const MOCK_ORDERS: Order[] = [
  // Urgent Orders (Critical SLA < 2 hours)
  {
    id: 'ord-101',
    orderNumber: 'ORD-9901',
    customerName: 'Tesla Gigafactory Texas',
    destinationCity: 'Austin, TX',
    priority: 'Urgent',
    status: 'Conflict',
    totalAmount: 18450.00,
    totalWeightKg: 42.5,
    slaDeadline: addHours(1.5), // 1.5 hours remaining!
    createdAt: subHours(2),
    shippingCarrier: 'FedEx Express',
    assignedPickerId: 'p-01',
    assignedPickerName: 'Alex Mercer',
    hasConflict: true,
    conflictDetails: 'LiDAR Sensor SEN-3042 has only 1 available unit (15 requested). 14 units required from allocation engine.',
    items: [
      {
        sku: 'SEN-3042',
        name: 'High-Precision Optical LiDAR Sensor 360',
        quantityRequested: 15,
        quantityAllocated: 1, // Deficit!
        quantityPicked: 0,
        unitPrice: 890.00,
        unitWeightKg: 0.8,
        availableFromZone: 'Zone A'
      },
      {
        sku: 'MCU-9901',
        name: 'Industrial Micro-Controller Board Cortex-M7',
        quantityRequested: 10,
        quantityAllocated: 10,
        quantityPicked: 0,
        unitPrice: 185.00,
        unitWeightKg: 0.2,
        availableFromZone: 'Zone A'
      },
      {
        sku: 'PWR-1090',
        name: 'High-Efficiency DC-DC Converter 800W',
        quantityRequested: 20,
        quantityAllocated: 20,
        quantityPicked: 0,
        unitPrice: 165.00,
        unitWeightKg: 1.1,
        availableFromZone: 'Zone B'
      }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-9902',
    customerName: 'St. Jude Robotics Medical Lab',
    destinationCity: 'Memphis, TN',
    priority: 'Urgent',
    status: 'Conflict',
    totalAmount: 31200.00,
    totalWeightKg: 120.0,
    slaDeadline: addHours(0.8), // 48 mins remaining! OVERDUE RISK!
    createdAt: subHours(3),
    shippingCarrier: 'UPS Air',
    assignedPickerId: 'p-02',
    assignedPickerName: 'Elena Rostova',
    hasConflict: true,
    conflictDetails: 'Battery Pack PWR-6020 stock is 0 available (10 requested). Allocated to Low Priority ORD-8812.',
    items: [
      {
        sku: 'PWR-6020',
        name: 'Lithium-Ion Modular Battery Pack 48V 100Ah',
        quantityRequested: 10,
        quantityAllocated: 0, // Deficit!
        quantityPicked: 0,
        unitPrice: 2400.00,
        unitWeightKg: 24.0,
        availableFromZone: 'Zone B'
      },
      {
        sku: 'ROB-8821',
        name: 'Articulated Robotic Arm Joint Actuator v4',
        quantityRequested: 4,
        quantityAllocated: 4,
        quantityPicked: 0,
        unitPrice: 1250.00,
        unitWeightKg: 4.2,
        availableFromZone: 'Zone A'
      }
    ]
  },

  // High Priority Orders
  {
    id: 'ord-103',
    orderNumber: 'ORD-9903',
    customerName: 'Boston Dynamics Assembly',
    destinationCity: 'Waltham, MA',
    priority: 'High',
    status: 'Picking',
    totalAmount: 14200.00,
    totalWeightKg: 35.2,
    slaDeadline: addHours(4.5),
    createdAt: subHours(1.5),
    shippingCarrier: 'DHL Global',
    assignedPickerId: 'p-01',
    assignedPickerName: 'Alex Mercer',
    hasConflict: false,
    items: [
      {
        sku: 'ROB-8821',
        name: 'Articulated Robotic Arm Joint Actuator v4',
        quantityRequested: 8,
        quantityAllocated: 8,
        quantityPicked: 5,
        unitPrice: 1250.00,
        unitWeightKg: 4.2,
        availableFromZone: 'Zone A'
      },
      {
        sku: 'MCU-9901',
        name: 'Industrial Micro-Controller Board Cortex-M7',
        quantityRequested: 15,
        quantityAllocated: 15,
        quantityPicked: 15,
        unitPrice: 185.00,
        unitWeightKg: 0.2,
        availableFromZone: 'Zone A'
      }
    ]
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-9904',
    customerName: 'Pfizer BioPharma Logistics',
    destinationCity: 'Kalamazoo, MI',
    priority: 'High',
    status: 'Packing',
    totalAmount: 24800.00,
    totalWeightKg: 55.0,
    slaDeadline: addHours(3.2),
    createdAt: subHours(4),
    shippingCarrier: 'FedEx Express',
    assignedPickerId: 'p-03',
    assignedPickerName: 'Marcus Vance',
    hasConflict: false,
    items: [
      {
        sku: 'PHA-1005',
        name: 'Cryogenic Sample Container 50L',
        quantityRequested: 5,
        quantityAllocated: 5,
        quantityPicked: 5,
        unitPrice: 2900.00,
        unitWeightKg: 18.0,
        availableFromZone: 'Zone C'
      },
      {
        sku: 'PHA-4401',
        name: 'Temperature Data Logger USB/NFC Pack',
        quantityRequested: 50,
        quantityAllocated: 50,
        quantityPicked: 50,
        unitPrice: 45.00,
        unitWeightKg: 0.05,
        availableFromZone: 'Zone C'
      }
    ]
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-9905',
    customerName: 'Rivian Automotive Plant 2',
    destinationCity: 'Normal, IL',
    priority: 'High',
    status: 'Allocating',
    totalAmount: 19800.00,
    totalWeightKg: 68.0,
    slaDeadline: addHours(5.0),
    createdAt: subHours(1),
    shippingCarrier: 'Autonomous Fleet',
    assignedPickerId: 'p-04',
    assignedPickerName: 'Sarah Lin',
    hasConflict: false,
    items: [
      {
        sku: 'AUT-7714',
        name: 'CAN-Bus Vehicle Network Gateway Controller',
        quantityRequested: 30,
        quantityAllocated: 30,
        quantityPicked: 0,
        unitPrice: 290.00,
        unitWeightKg: 0.6,
        availableFromZone: 'Zone B'
      },
      {
        sku: 'AUT-8819',
        name: 'Brushless Servo Controller Unit 3-Phase',
        quantityRequested: 20,
        quantityAllocated: 20,
        quantityPicked: 0,
        unitPrice: 510.00,
        unitWeightKg: 1.8,
        availableFromZone: 'Zone B'
      }
    ]
  },

  // Medium Priority Orders
  {
    id: 'ord-106',
    orderNumber: 'ORD-8810',
    customerName: 'Siemens Industrial Automation',
    destinationCity: 'Chicago, IL',
    priority: 'Medium',
    status: 'Ready to Ship',
    totalAmount: 8900.00,
    totalWeightKg: 18.5,
    slaDeadline: addHours(12.0),
    createdAt: subHours(6),
    shippingCarrier: 'UPS Air',
    trackingNumber: '1Z999AA101239841',
    hasConflict: false,
    items: [
      {
        sku: 'MCU-4402',
        name: 'Programmable Logic Controller (PLC) Main CPU',
        quantityRequested: 6,
        quantityAllocated: 6,
        quantityPicked: 6,
        unitPrice: 1150.00,
        unitWeightKg: 1.5,
        availableFromZone: 'Zone D'
      },
      {
        sku: 'SEN-5012',
        name: 'Ultrasonic Proximity Rangefinder Array',
        quantityRequested: 20,
        quantityAllocated: 20,
        quantityPicked: 20,
        unitPrice: 75.00,
        unitWeightKg: 0.15,
        availableFromZone: 'Zone A'
      }
    ]
  },
  {
    id: 'ord-107',
    orderNumber: 'ORD-8811',
    customerName: 'Amazon Robotics Fulfillment',
    destinationCity: 'Seattle, WA',
    priority: 'Medium',
    status: 'Dispatched',
    totalAmount: 16500.00,
    totalWeightKg: 52.0,
    slaDeadline: subHours(1.0),
    createdAt: subHours(14),
    shippingCarrier: 'FedEx Express',
    trackingNumber: '781923419012',
    hasConflict: false,
    items: [
      {
        sku: 'ROB-1102',
        name: 'AGV Heavy-Duty Drive Motor 48V',
        quantityRequested: 10,
        quantityAllocated: 10,
        quantityPicked: 10,
        unitPrice: 1450.00,
        unitWeightKg: 8.5,
        availableFromZone: 'Zone A'
      }
    ]
  },

  // Low Priority Orders
  {
    id: 'ord-108',
    orderNumber: 'ORD-8812',
    customerName: 'Global Trade Equipment Distributors',
    destinationCity: 'Dallas, TX',
    priority: 'Low',
    status: 'Pending',
    totalAmount: 38400.00,
    totalWeightKg: 310.0,
    slaDeadline: addHours(36.0),
    createdAt: subHours(5),
    shippingCarrier: 'DHL Global',
    hasConflict: false,
    items: [
      {
        sku: 'SEN-3042',
        name: 'High-Precision Optical LiDAR Sensor 360',
        quantityRequested: 14,
        quantityAllocated: 14,
        quantityPicked: 0,
        unitPrice: 890.00,
        unitWeightKg: 0.8,
        availableFromZone: 'Zone A'
      },
      {
        sku: 'PWR-6020',
        name: 'Lithium-Ion Modular Battery Pack 48V 100Ah',
        quantityRequested: 10,
        quantityAllocated: 10,
        quantityPicked: 0,
        unitPrice: 2400.00,
        unitWeightKg: 24.0,
        availableFromZone: 'Zone B'
      }
    ]
  },
  {
    id: 'ord-109',
    orderNumber: 'ORD-8813',
    customerName: 'Apex Machinery Components',
    destinationCity: 'Phoenix, AZ',
    priority: 'Low',
    status: 'Pending',
    totalAmount: 11200.00,
    totalWeightKg: 95.0,
    slaDeadline: addHours(42.0),
    createdAt: subHours(8),
    shippingCarrier: 'Autonomous Fleet',
    hasConflict: false,
    items: [
      {
        sku: 'HEV-9904',
        name: 'Hydraulic Cylinder Assembly 500mm Stroke',
        quantityRequested: 3,
        quantityAllocated: 3,
        quantityPicked: 0,
        unitPrice: 3200.00,
        unitWeightKg: 45.0,
        availableFromZone: 'Zone D'
      }
    ]
  },
  {
    id: 'ord-110',
    orderNumber: 'ORD-8814',
    customerName: 'EcoPack Solutions Inc',
    destinationCity: 'Atlanta, GA',
    priority: 'Low',
    status: 'Picking',
    totalAmount: 3250.00,
    totalWeightKg: 85.0,
    slaDeadline: addHours(28.0),
    createdAt: subHours(10),
    shippingCarrier: 'FedEx Express',
    assignedPickerId: 'p-04',
    assignedPickerName: 'Sarah Lin',
    hasConflict: false,
    items: [
      {
        sku: 'PKG-2090',
        name: 'Biodegradable Molded Fiber Cushioning 50x50',
        quantityRequested: 200,
        quantityAllocated: 200,
        quantityPicked: 120,
        unitPrice: 4.50,
        unitWeightKg: 0.1,
        availableFromZone: 'Zone C'
      }
    ]
  }
];
