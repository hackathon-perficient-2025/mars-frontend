import { useState, useEffect, useCallback } from 'react';
import type { RoverStatus } from '@/types/rover.types';
import { apiClient } from '@/utils/apiClient';
import { endpoints } from '@/utils/endpoints';
import { socket } from '@/utils/socketClient';

export const useRovers = () => {
    const [rovers, setRovers] = useState<RoverStatus[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRovers = useCallback(async () => {
        setIsConnecting(true);
        setError(null);

        try {
            const response = await apiClient.get<RoverStatus[]>(endpoints.rovers.getAll);
            setRovers(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch rovers');
            console.error('Failed to fetch rovers:', err);
        } finally {
            setIsConnecting(false);
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchRovers();

        // WebSocket listeners
        const handleRoversInitial = (data: RoverStatus[]) => {
            console.log('🚀 Received initial rovers via WebSocket');
            setRovers(data);
        };

        const handleRoversUpdated = (data: RoverStatus[]) => {
            console.log('🔄 Rovers updated via WebSocket');
            setRovers(data);
        };

        socket.on('rovers:initial', handleRoversInitial);
        socket.on('rovers:updated', handleRoversUpdated);

        return () => {
            socket.off('rovers:initial', handleRoversInitial);
            socket.off('rovers:updated', handleRoversUpdated);
        };
    }, [fetchRovers]);

    return {
        rovers,
        isConnecting,
        error,
    };
};
