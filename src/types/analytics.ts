export interface HourlyThroughput {
  hour: string;
  pickedUnits: number;
  dispatchedOrders: number;
  targetUnits: number;
}

export interface ZoneActivityMetric {
  zone: string;
  activePickers: number;
  stockOccupancyPct: number;
  exceptionCount: number;
  picksPerHour: number;
}

export interface WarehouseAnalytics {
  fulfillmentRatePct: number;
  activeConflictsCount: number;
  activeExceptionsCount: number;
  onTimeDispatchPct: number;
  averagePickTimeMins: number;
  totalOrdersToday: number;
  dispatchedOrdersToday: number;
  slaRiskCount: number;
  savedPenaltiesAmount: number;
  hourlyThroughput: HourlyThroughput[];
  zoneMetrics: ZoneActivityMetric[];
}
