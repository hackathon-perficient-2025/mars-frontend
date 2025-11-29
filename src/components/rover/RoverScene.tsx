import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
} from "@react-three/drei";
import { RoverModel } from "./RoverModel";
import { RealRoverModel } from "./RealRoverModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Battery,
  Thermometer,
  Activity,
  Wifi,
  Navigation,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

import type { RoverStatus } from "@/types/rover.types";

interface RoverSceneProps {
  mode?: "standard" | "real";
  rover?: RoverStatus;
  isConnecting?: boolean;
}

export const RoverScene = ({
  mode = "standard",
  rover,
  isConnecting = false,
}: RoverSceneProps) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // Show loading state if rover data is not available
  if (!rover) {
    return (
      <Card className="col-span-full overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Rover Status
          </CardTitle>
          <Badge variant="outline" className="animate-pulse">
            LOADING...
          </Badge>
        </CardHeader>
        <CardContent className="p-0 relative">
          <div className="h-[500px] w-full relative flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Activity className="h-12 w-12 animate-spin mx-auto mb-4" />
              <p>Loading rover data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Rover Status: {rover.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge
            variant={rover.status === "active" ? "default" : "destructive"}
            className="animate-pulse"
          >
            {isConnecting ? "CONNECTING..." : rover.status.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="font-mono">
            {new Date(rover.lastCommunication).toLocaleTimeString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="h-[500px] w-full relative">
          {/* 3D Scene */}
          <Canvas camera={{ position: [4, 3, 4], fov: 45 }}>
            <Suspense fallback={null}>
              <Environment preset="city" />
              <ambientLight intensity={0.5} />
              <spotLight
                position={[10, 10, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1}
                castShadow
              />

              {mode === "standard" ? (
                <RoverModel status={rover} onPartClick={setSelectedPart} />
              ) : (
                <ErrorBoundary
                  fallback={
                    <Html center>
                      <div className="bg-destructive/90 text-destructive-foreground p-4 rounded-lg shadow-lg max-w-sm text-center backdrop-blur-sm border border-destructive/50">
                        <h3 className="font-bold text-lg">Model Load Error</h3>
                        <p className="text-sm mt-2">
                          Could not load /models/rover.glb
                        </p>
                      </div>
                    </Html>
                  }
                >
                  <RealRoverModel onPartClick={setSelectedPart} />
                </ErrorBoundary>
              )}

              <ContactShadows
                position={[0, 0, 0]}
                opacity={0.4}
                scale={10}
                blur={2.5}
                far={4}
              />
              <OrbitControls
                enablePan={false}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2}
                minDistance={3}
                maxDistance={10}
              />
            </Suspense>
          </Canvas>

          {/* Overlay Stats */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 w-64">
            <div className="bg-background/80 backdrop-blur-md p-3 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Battery className="h-4 w-4" /> Battery
                </span>
                <span
                  className={cn(
                    "font-mono font-bold",
                    rover.batteryLevel < 20 ? "text-red-500" : "text-green-500"
                  )}
                >
                  {rover.batteryLevel}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    rover.batteryLevel < 20 ? "bg-red-500" : "bg-green-500"
                  )}
                  style={{ width: `${rover.batteryLevel}%` }}
                />
              </div>
            </div>

            <div className="bg-background/80 backdrop-blur-md p-3 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Speed
                </span>
                <span className="font-mono font-bold">{rover.speed} km/h</span>
              </div>
            </div>

            <div className="bg-background/80 backdrop-blur-md p-3 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Thermometer className="h-4 w-4" /> Temp
                </span>
                <span className="font-mono font-bold">
                  {rover.temperature}°C
                </span>
              </div>
            </div>

            <div className="bg-background/80 backdrop-blur-md p-3 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wifi className="h-4 w-4" /> Signal
                </span>
                <span className="font-mono font-bold text-green-500">
                  STRONG
                </span>
              </div>
            </div>
          </div>

          {/* Interaction Info */}
          {selectedPart && (
            <div className="absolute bottom-4 right-4 max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300">
              <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4" />
                  <h3 className="font-bold">{selectedPart}</h3>
                </div>
                <p className="text-sm opacity-90">
                  System nominal. Operating within normal parameters.
                  {selectedPart.includes("Wheel") &&
                    ` Pressure: ${rover.wheels.fl}%`}
                  {selectedPart.includes("Battery") && ` Output: Stable`}
                </p>
                <button
                  className="mt-3 text-xs underline opacity-70 hover:opacity-100"
                  onClick={() => setSelectedPart(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
            Click on rover parts to inspect
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple Error Boundary for the 3D model part
import React from "react";
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
