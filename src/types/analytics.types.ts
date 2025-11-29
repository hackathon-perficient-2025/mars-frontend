import type { ResourceType } from './resource.types';

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
}

export interface ResourceTrend {
  resourceId: string;
  resourceType: ResourceType;
  data: TimeSeriesData[];
  averageConsumption: number;
  projectedDepletion?: Date;
}

export interface AnalyticsSummary {
  totalAlerts: number;
  criticalAlerts: number;
  pendingResupplies: number;
  averageResourceLevel: number;
  resourcesAtRisk: number;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d';

// Real-time Analytics Types from Backend
export interface TrendData {
  resourceId: string;
  resourceType: string;
  timeRange: TimeRange;
  data: Array<{
    timestamp: Date;
    level: number;
    predictedLevel?: number;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
  averageConsumption: number;
}

export interface Anomaly {
  id: string;
  resourceId: string;
  resourceType: string;
  timestamp: Date;
  type: 'spike' | 'drop' | 'leak_detected' | 'unusual_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
}

export interface AggregatedStats {
  resourceId: string;
  resourceType: string;
  timeRange: TimeRange;
  min: number;
  max: number;
  average: number;
  median: number;
  stdDeviation: number;
  totalConsumption: number;
  peakUsageTimes: Array<{
    timestamp: Date;
    level: number;
  }>;
}
