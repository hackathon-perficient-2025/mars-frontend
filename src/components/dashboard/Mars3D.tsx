import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { ResourceType } from '@/types';

type Pin = {
  type: ResourceType;
  lat: number; // degrees
  lon: number; // degrees
  color?: string;
};

const defaultPins: Pin[] = [
  { type: 'oxygen', lat: 20, lon: -30, color: '#7dd3fc' },
  { type: 'water', lat: -10, lon: 60, color: '#60a5fa' },
  { type: 'energy_storage', lat: 40, lon: 100, color: '#f97316' },
  { type: 'medical_supplies', lat: -25, lon: -120, color: '#fb7185' },
  { type: 'population', lat: 10, lon: 30, color: '#34d399' },
];

function latLonToCartesian(lat: number, lon: number, radius = 1.02) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z] as [number, number, number];
}

interface FlickeringPinProps {
  pin: Pin;
  onPinClick?: (type: ResourceType) => void;
}

const FlickeringPin: React.FC<FlickeringPinProps> = ({ pin, onPinClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      // Create stronger flickering effect using sine wave with random noise
      const time = state.clock.elapsedTime;
      const baseIntensity = 1.2;
      const flicker = baseIntensity + Math.sin(time * 3) * 0.5 + Math.random() * 0.3;
      materialRef.current.emissiveIntensity = Math.max(0.8, Math.min(2, flicker));
    }
  });

  const pos = latLonToCartesian(pin.lat, pin.lon, 1.03);

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPinClick?.(pin.type);
      }}
    >
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        ref={materialRef}
        color={pin.color ?? '#ff0000'}
        emissive={pin.color ?? '#ff0000'}
        emissiveIntensity={1}
      />
    </mesh>
  );
};

export const Mars3D: React.FC<{ onPinClick?: (type: ResourceType) => void }> = ({ onPinClick }) => {
  const textureUrl = 'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg';
  const texture = new THREE.TextureLoader().load(textureUrl);

  return (
    <div className="w-full h-80">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Sphere args={[1, 64, 64]}>
          <meshStandardMaterial map={texture} />
        </Sphere>

        {/* Render pins with flickering effect */}
        {defaultPins.map((pin) => (
          <FlickeringPin key={pin.type} pin={pin} onPinClick={onPinClick} />
        ))}

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};

export default Mars3D;
