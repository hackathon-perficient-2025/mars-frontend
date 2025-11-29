import { useState, useEffect, useCallback } from "react";
import type { RoverStatus } from "@/types/rover.types";
import { MOCK_ROVER_STATUS } from "@/mocks/rover.mock";

export const useRover = () => {
  const [rover, setRover] = useState<RoverStatus>(MOCK_ROVER_STATUS);
  const [isConnecting, setIsConnecting] = useState(true);

  const updateRoverData = useCallback(() => {
    setRover((prev) => {
      // Simulate random fluctuations
      const speedChange = Math.random() > 0.7 ? (Math.random() - 0.5) * 0.5 : 0;
      const newSpeed = Math.max(0, Math.min(5, prev.speed + speedChange));

      const tempChange = (Math.random() - 0.5) * 0.2;
      const batteryDrain = prev.speed > 0 ? 0.01 : 0.001;

      return {
        ...prev,
        speed: Number(newSpeed.toFixed(2)),
        temperature: Number((prev.temperature + tempChange).toFixed(1)),
        batteryLevel: Math.max(
          0,
          Number((prev.batteryLevel - batteryDrain).toFixed(2))
        ),
        lastCommunication: new Date(),
        // Simulate wheel wear slightly if moving
        wheels:
          prev.speed > 0 && Math.random() > 0.95
            ? {
                ...prev.wheels,
                [Object.keys(prev.wheels)[Math.floor(Math.random() * 6)]]:
                  Math.max(
                    0,
                    Object.values(prev.wheels)[Math.floor(Math.random() * 6)] -
                      0.1
                  ),
              }
            : prev.wheels,
      };
    });
  }, []);

  useEffect(() => {
    // Simulate initial connection delay
    const timeout = setTimeout(() => {
      setIsConnecting(false);
    }, 1000);

    // Start real-time updates
    const interval = setInterval(updateRoverData, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [updateRoverData]);

  return {
    rover,
    isConnecting,
  };
};
