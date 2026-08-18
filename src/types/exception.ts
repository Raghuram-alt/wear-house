export type ExceptionType = 
  | 'Damaged Item'
  | 'Missing Stock in Bin'
  | 'Mislabeled Barcode'
  | 'Bay Obstruction'
  | 'Weight Discrepancy';

export type ExceptionStatus = 'Active' | 'Under Investigation' | 'Resolved' | 'Quarantined';

export interface WarehouseException {
  id: string;
  exceptionCode: string;
  type: ExceptionType;
  orderNumber?: string;
  sku: string;
  productName: string;
  location: string;
  reportedBy: string;
  timestamp: string;
  severity: 'High' | 'Medium' | 'Low';
  status: ExceptionStatus;
  notes: string;
  recommendedResolution: {
    title: string;
    action: 'QuarantineBin' | 'WriteOffStock' | 'SplitShipment' | 'ReroutePicker' | 'DirectSwap';
    description: string;
  };
  resolutionHistory?: {
    resolvedAt: string;
    resolvedBy: string;
    actionChosen: string;
    outcomeNote: string;
  };
}
