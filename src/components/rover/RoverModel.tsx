import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { RoverStatus } from "@/types/rover.types";

interface RoverModelProps {
  status: RoverStatus;
  onPartClick: (part: string) => void;
}

interface WheelProps {
  position: [number, number, number];
  name: string;
  onPartClick: (name: string) => void;
  hoveredPart: string | null;
  setHoveredPart: (part: string | null) => void;
}

const Wheel = ({
  position,
  name,
  onPartClick,
  hoveredPart,
  setHoveredPart,
}: WheelProps) => (
  <mesh
    position={position}
    rotation={[Math.PI / 2, 0, 0]}
    onClick={(e) => {
      e.stopPropagation();
      onPartClick(name);
    }}
    onPointerOver={(e) => {
      e.stopPropagation();
      setHoveredPart(name);
    }}
    onPointerOut={() => setHoveredPart(null)}
  >
    <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
    <meshStandardMaterial
      color={hoveredPart === name ? "#555" : "#333"}
      roughness={0.9}
    />
    {/* Rim */}
    <mesh position={[0, 0.16, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
      <meshStandardMaterial color="#888" metalness={0.8} />
    </mesh>
  </mesh>
);

export const RoverModel = ({ status, onPartClick }: RoverModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Animate rover slightly based on status
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating/suspension animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;

      // If moving, rotate wheels (visual only since we don't have individual wheel refs here easily without more code,
      // but we can rock the body)
      if (status.speed > 0) {
        groupRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 10) * 0.02;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Body */}
      <mesh
        position={[0, 0.8, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("Main Body");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart("Main Body");
        }}
        onPointerOut={() => setHoveredPart(null)}
      >
        <boxGeometry args={[1.8, 0.6, 2.4]} />
        <meshStandardMaterial
          color={hoveredPart === "Main Body" ? "#ff9999" : "#ffffff"}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Camera Mast */}
      <group position={[0, 1.1, 0.8]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
        {/* Head */}
        <mesh
          position={[0, 0.9, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onPartClick("Camera Array");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredPart("Camera Array");
          }}
          onPointerOut={() => setHoveredPart(null)}
        >
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <meshStandardMaterial color="#333" />
          {/* Lenses */}
          <mesh position={[0.15, 0, 0.21]}>
            <circleGeometry args={[0.08]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[-0.15, 0, 0.21]}>
            <circleGeometry args={[0.08]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        </mesh>
      </group>

      {/* Power Source (RTG) - Back */}
      <mesh
        position={[0, 1.0, -1.0]}
        rotation={[Math.PI / 4, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("Power Source");
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredPart("Power Source");
        }}
        onPointerOut={() => setHoveredPart(null)}
      >
        <cylinderGeometry args={[0.25, 0.25, 0.8]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Wheels */}
      {/* Front */}
      <Wheel
        position={[-1.1, 0.4, 1.0]}
        name="Front Left Wheel"
        onPartClick={onPartClick}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
      />
      <Wheel
        position={[1.1, 0.4, 1.0]}
        name="Front Right Wheel"
        onPartClick={onPartClick}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
      />

      {/* Middle */}
      <Wheel
        position={[-1.1, 0.4, 0]}
        name="Middle Left Wheel"
        onPartClick={onPartClick}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
      />
      <Wheel
        position={[1.1, 0.4, 0]}
        name="Middle Right Wheel"
        onPartClick={onPartClick}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
      />

      {/* Rear */}
      <Wheel
        position={[-1.1, 0.4, -1.0]}
        name="Rear Left Wheel"
        onPartClick={onPartClick}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
      />
      <Wheel
        position={[1.1, 0.4, -1.0]}
        name="Rear Right Wheel"
        onPartClick={onPartClick}
        hoveredPart={hoveredPart}
        setHoveredPart={setHoveredPart}
      />

      {/* Status Label Floating above */}
      <Html position={[0, 2.5, 0]} center>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap backdrop-blur-sm border border-white/20">
          {status.name} • {status.status.toUpperCase()}
        </div>
      </Html>
    </group>
  );
};
