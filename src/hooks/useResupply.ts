import { useState, useCallback, useEffect } from 'react';
import type { ResupplyRequest, CreateResupplyRequest } from '@/types';
import { apiClient } from '@/utils/apiClient';
import { endpoints } from '@/utils/endpoints';
import { socket } from '@/utils/socketClient';

export const useResupply = () => {
  const [requests, setRequests] = useState<ResupplyRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ResupplyRequest[]>(endpoints.resupply.getAll);
      setRequests(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
      console.error('Failed to fetch resupply requests:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRequest = useCallback(async (data: CreateResupplyRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ResupplyRequest>(endpoints.resupply.create, data);
      setRequests(prevRequests => [response.data, ...prevRequests]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
      console.error('Failed to create resupply request:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRequestStatus = useCallback(async (requestId: string, status: ResupplyRequest['status']) => {
    try {
      await apiClient.patch(endpoints.resupply.update(requestId), { status });
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status }
            : request
        )
      );
    } catch (err) {
      console.error('Failed to update request status:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchRequests();

    // WebSocket listeners
    const handleResupplyCreated = (request: ResupplyRequest) => {
      console.log('📦 New resupply request created via WebSocket:', request);
      setRequests(prevRequests => [request, ...prevRequests]);
    };

    const handleResupplyUpdated = (request: ResupplyRequest) => {
      console.log('🔄 Resupply request updated via WebSocket:', request);
      setRequests(prevRequests =>
        prevRequests.map(r => (r.id === request.id ? request : r))
      );
    };

    socket.on('resupply:created', handleResupplyCreated);
    socket.on('resupply:updated', handleResupplyUpdated);

    return () => {
      socket.off('resupply:created', handleResupplyCreated);
      socket.off('resupply:updated', handleResupplyUpdated);
    };
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    createRequest,
    updateRequestStatus,
    refreshRequests: fetchRequests,
  };
};
