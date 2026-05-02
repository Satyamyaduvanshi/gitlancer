"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";

// @ts-ignore - Forcing Vercel to bypass missing type definitions
import * as THREE from "three";

// 🧊 Single Monolith Component
function Monolith({ position, scale, speed }: { position: [number, number, number], scale: [number, number, number], speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Slowly rotate each pillar for a dynamic, eerie feel
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.05} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#0f0f0f" // Slightly lighter than pure black so it catches light
          roughness={0.15} // Very glossy
          metalness={1} // Highly metallic to reflect the orange glow
        />
      </mesh>
    </Float>
  );
}

// 🌌 The Main Scene
function Scene() {
  // ⚡ Increased to 35 pillars for a much denser, massive feel
  const monoliths = useMemo(() => {
    return Array.from({ length: 35 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 40, // Wider spread across X
        (Math.random() - 0.5) * 20, // Spread across Y
        (Math.random() - 0.5) * 20 - 15, // Pushed back in Z space
      ] as [number, number, number],
      scale: [
        Math.random() * 2 + 1.5, // Width
        Math.random() * 25 + 15, // Height (Massive vertical pillars)
        Math.random() * 2 + 1.5, // Depth
      ] as [number, number, number],
      speed: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  return (
    <>
      {/* 💡 Upgraded Lighting Engine */}
      <ambientLight intensity={0.8} /> 
      
      {/* Main Persimmon orange glow from below */}
      <pointLight position={[0, -10, 5]} color="#fc4c02" intensity={800} distance={40} />
      
      {/* Secondary Persimmon glow from the right */}
      <pointLight position={[15, 10, -5]} color="#fc4c02" intensity={400} distance={30} />
      
      {/* ⚡ NEW: Soft white rim light from above to illuminate pillar edges */}
      <spotLight position={[-10, 20, -5]} color="#ffffff" intensity={0.6} angle={0.5} penumbra={3} />

      {/* Render all the generated monoliths */}
      {monoliths.map((m, i) => (
        <Monolith key={i} position={m.position} scale={m.scale} speed={m.speed} />
      ))}

      {/* Adds realistic reflections to the dark metal */}
      <Environment preset="city" />
    </>
  );
}

// 🎬 The Canvas Wrapper
export default function Solux3DBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        {/* ⚡ Pure Black Fog to fade distant pillars perfectly into bg-black */}
        <fog attach="fog" args={["#000000", 15, 45]} /> 
        <Scene />
      </Canvas>
    </div>
  );
}