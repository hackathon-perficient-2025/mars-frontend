import { useState, useEffect } from "react";
import { apiClient } from "@/utils/apiClient";
import { endpoints } from "@/utils/endpoints";
import type {
  TrendData,
  Anomaly,
  AggregatedStats,
  TimeRange,
  ResourceType,
} from "@/types";

interface AnalyticsQuery {
  resourceId?: string;
  resourceType?: ResourceType;
  timeRange?: TimeRange;
}

export const useAnalytics = (query: AnalyticsQuery = {}) => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [stats, setStats] = useState<AggregatedStats[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async (customQuery?: AnalyticsQuery) => {
    try {
      const params = new URLSearchParams();
      const finalQuery = { ...query, ...customQuery };

      if (finalQuery.resourceId)
        params.append("resourceId", finalQuery.resourceId);
      if (finalQuery.resourceType)
        params.append("resourceType", finalQuery.resourceType);
      if (finalQuery.timeRange)
        params.append("timeRange", finalQuery.timeRange);

      const response = await apiClient.get<TrendData[]>(
        `${endpoints.analytics.getTrends}?${params.toString()}`
      );

      // Parse dates
      const parsedTrends = response.data.map((trend) => ({
        ...trend,
        data: trend.data.map((d) => ({
          ...d,
          timestamp: new Date(d.timestamp),
        })),
      }));

      setTrends(parsedTrends);
      return parsedTrends;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch trends");
      throw err;
    }
  };

  const fetchStats = async (customQuery?: AnalyticsQuery) => {
    try {
      const params = new URLSearchParams();
      const finalQuery = { ...query, ...customQuery };

      if (finalQuery.resourceId)
        params.append("resourceId", finalQuery.resourceId);
      if (finalQuery.resourceType)
        params.append("resourceType", finalQuery.resourceType);
      if (finalQuery.timeRange)
        params.append("timeRange", finalQuery.timeRange);

      const response = await apiClient.get<AggregatedStats[]>(
        `${endpoints.analytics.getStats}?${params.toString()}`
      );

      // Parse dates
      const parsedStats = response.data.map((stat) => ({
        ...stat,
        peakUsageTimes: stat.peakUsageTimes.map((p) => ({
          ...p,
          timestamp: new Date(p.timestamp),
        })),
      }));

      setStats(parsedStats);
      return parsedStats;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      throw err;
    }
  };

  const fetchAnomalies = async (customQuery?: AnalyticsQuery) => {
    try {
      const params = new URLSearchParams();
      const finalQuery = { ...query, ...customQuery };

      if (finalQuery.resourceId)
        params.append("resourceId", finalQuery.resourceId);
      if (finalQuery.resourceType)
        params.append("resourceType", finalQuery.resourceType);
      if (finalQuery.timeRange)
        params.append("timeRange", finalQuery.timeRange);

      const response = await apiClient.get<Anomaly[]>(
        `${endpoints.analytics.getAnomalies}?${params.toString()}`
      );

      // Parse dates
      const parsedAnomalies = response.data.map((anomaly) => ({
        ...anomaly,
        timestamp: new Date(anomaly.timestamp),
      }));

      setAnomalies(parsedAnomalies);
      return parsedAnomalies;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch anomalies"
      );
      throw err;
    }
  };

  const detectAnomalies = async (customQuery?: AnalyticsQuery) => {
    try {
      const params = new URLSearchParams();
      const finalQuery = { ...query, ...customQuery };

      if (finalQuery.resourceId)
        params.append("resourceId", finalQuery.resourceId);
      if (finalQuery.resourceType)
        params.append("resourceType", finalQuery.resourceType);
      if (finalQuery.timeRange)
        params.append("timeRange", finalQuery.timeRange);

      const response = await apiClient.get<Anomaly[]>(
        `${endpoints.analytics.detectAnomalies}?${params.toString()}`
      );

      // Parse dates
      const parsedAnomalies = response.data.map((anomaly) => ({
        ...anomaly,
        timestamp: new Date(anomaly.timestamp),
      }));

      setAnomalies(parsedAnomalies);
      return parsedAnomalies;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to detect anomalies"
      );
      throw err;
    }
  };

  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchTrends(), fetchStats(), fetchAnomalies()]);
    } catch (err) {
      console.error("Error refreshing analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.resourceId, query.resourceType, query.timeRange]);

  return {
    trends,
    stats,
    anomalies,
    isLoading,
    error,
    refresh,
    fetchTrends,
    fetchStats,
    fetchAnomalies,
    detectAnomalies,
  };
};
