import { useState, useCallback, useEffect } from 'react';
import type { Alert } from '@/types';
import { apiClient } from '@/utils/apiClient';
import { endpoints } from '@/utils/endpoints';
import { socket } from '@/utils/socketClient';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<Alert[]>(endpoints.alerts.getUnacknowledged);
      setAlerts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      console.error('Failed to fetch alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await apiClient.patch(endpoints.alerts.acknowledge(alertId), {
        acknowledgedBy: 'Current Operator',
      });

      // Update local state
      setAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          alert.id === alertId
            ? {
              ...alert,
              acknowledged: true,
              acknowledgedBy: 'Current Operator',
              acknowledgedAt: new Date(),
            }
            : alert
        )
      );
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
      throw err;
    }
  }, []);

  const addAlert = useCallback((newAlert: Alert) => {
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
  }, []);

  const clearAcknowledged = useCallback(async () => {
    try {
      await apiClient.delete(endpoints.alerts.clearAcknowledged);
      setAlerts(prevAlerts => prevAlerts.filter(alert => !alert.acknowledged));
    } catch (err) {
      console.error('Failed to clear acknowledged alerts:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAlerts();

    // WebSocket listeners
    const handleAlertsInitial = (data: Alert[]) => {
      console.log('🚨 Received initial alerts via WebSocket');
      setAlerts(data);
    };

    const handleAlertCreated = (alert: Alert) => {
      console.log('🆕 New alert created via WebSocket:', alert);
      setAlerts(prevAlerts => [alert, ...prevAlerts]);
    };

    const handleAlertAcknowledged = (alert: Alert) => {
      console.log('✅ Alert acknowledged via WebSocket:', alert);
      setAlerts(prevAlerts =>
        prevAlerts.map(a => (a.id === alert.id ? alert : a))
      );
    };

    socket.on('alerts:initial', handleAlertsInitial);
    socket.on('alert:created', handleAlertCreated);
    socket.on('alert:acknowledged', handleAlertAcknowledged);

    return () => {
      socket.off('alerts:initial', handleAlertsInitial);
      socket.off('alert:created', handleAlertCreated);
      socket.off('alert:acknowledged', handleAlertAcknowledged);
    };
  }, [fetchAlerts]);

  return {
    alerts,
    isLoading,
    error,
    acknowledgeAlert,
    addAlert,
    clearAcknowledged,
    refreshAlerts: fetchAlerts,
  };
};
