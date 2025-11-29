import { useState, useEffect, useCallback } from 'react';
import type { Resource } from '@/types';
import { apiClient } from '@/utils/apiClient';
import { endpoints } from '@/utils/endpoints';
import { socket } from '@/utils/socketClient';
import { REFRESH_INTERVAL } from '@/utils';

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<Resource[]>(endpoints.resources.getAll);
      setResources(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources');
      console.error('Failed to fetch resources:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshResources = useCallback(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    // Initial fetch
    fetchResources();

    // WebSocket listeners
    const handleResourcesInitial = (data: Resource[]) => {
      console.log('📦 Received initial resources via WebSocket');
      setResources(data);
    };

    const handleResourcesUpdated = (data: Resource[]) => {
      console.log('🔄 Resources updated via WebSocket');
      setResources(data);
    };

    socket.on('resources:initial', handleResourcesInitial);
    socket.on('resources:updated', handleResourcesUpdated);

    // Fallback polling (in case WebSocket fails)
    const interval = setInterval(() => {
      if (!socket.connected) {
        console.log('⚠️ WebSocket disconnected, using REST polling');
        fetchResources();
      }
    }, REFRESH_INTERVAL);

    return () => {
      socket.off('resources:initial', handleResourcesInitial);
      socket.off('resources:updated', handleResourcesUpdated);
      clearInterval(interval);
    };
  }, [fetchResources]);

  return {
    resources,
    isLoading,
    error,
    refreshResources,
  };
};
