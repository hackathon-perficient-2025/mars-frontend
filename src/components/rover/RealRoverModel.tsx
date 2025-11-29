import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { AlertCircle } from "lucide-react";
import type { ThreeEvent } from "@react-three/fiber";

interface RealRoverModelProps {
  onPartClick: (part: string) => void;
}

export const RealRoverModel = ({ onPartClick }: RealRoverModelProps) => {
  const modelRef = useRef<THREE.Group>(null);

  let scene: THREE.Group | undefined;
  let hasError = false;

  // status is available if we want to animate based on it later
  try {
    const gltf = useGLTF("/models/rover.glb", true); // true = useDraco
    scene = gltf.scene;
  } catch {
    hasError = true;
  }

  if (hasError || !scene) {
    // Fallback if model load fails
    return (
      <Html center>
        <div className="bg-destructive/90 text-destructive-foreground p-4 rounded-lg shadow-lg max-w-sm text-center backdrop-blur-sm border border-destructive/50">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <h3 className="font-bold text-lg">Model Not Found</h3>
          <p className="text-sm mt-2">
            Please place a 3D model file named <code>rover.glb</code> in the
            <code>public/models/</code> directory.
          </p>
        </div>
      </Html>
    );
  }

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        const target = e.object as THREE.Object3D;
        onPartClick(target.name || "Unknown Part");
      }}
    />
  );
};

// Preload to avoid suspense on first render if possible, but we handle error above
useGLTF.preload("/models/rover.glb");
