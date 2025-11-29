export interface RoverPosition {
  x: number;
  y: number;
  z: number;
  rotation: number;
}

export interface RoverStatus {
  id: string;
  name: string;
  batteryLevel: number; // 0-100
  speed: number; // km/h
  temperature: number; // Celsius
  status: "active" | "idle" | "charging" | "error";
  coordinates: {
    latitude: number;
    longitude: number;
  };
  lastCommunication: Date | string;
  cameraStatus: "online" | "offline";
  drillStatus: "stowed" | "active" | "error";
  wheels: {
    fl: number; // pressure or health 0-100
    fr: number;
    rl: number;
    rr: number;
    ml: number; // middle left
    mr: number; // middle right
  };
}
