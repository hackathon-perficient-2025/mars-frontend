import type { RoverStatus } from '@/types/rover.types';

export const MOCK_ROVER_STATUS: RoverStatus = {
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
};
