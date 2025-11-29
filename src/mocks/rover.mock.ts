import type { RoverStatus } from '@/types/rover.types';

export const MOCK_ROVERS: RoverStatus[] = [
    {
        id: 'curiosity-2',
        name: 'Curiosity II',
        batteryLevel: 87,
        speed: 0,
        temperature: -24,
        status: 'active',
        coordinates: {
            latitude: -4.5895,
            longitude: 137.4417,
        },
        lastCommunication: new Date(),
        cameraStatus: 'online',
        drillStatus: 'stowed',
        wheels: {
            fl: 98,
            fr: 97,
            ml: 95,
            mr: 96,
            rl: 94,
            rr: 95,
        },
    },
    {
        id: 'perseverance-b',
        name: 'Perseverance B',
        batteryLevel: 12,
        speed: 0,
        temperature: 85, // Overheating
        status: 'error',
        coordinates: {
            latitude: 18.4447,
            longitude: 77.4508,
        },
        lastCommunication: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        cameraStatus: 'offline',
        drillStatus: 'error',
        wheels: {
            fl: 45, // Damaged
            fr: 88,
            ml: 90,
            mr: 89,
            rl: 92,
            rr: 91,
        },
    }
];

export const MOCK_ROVER_STATUS = MOCK_ROVERS[0];
