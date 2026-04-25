import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line, Sphere, Text, Float, ContactShadows } from "@react-three/drei";

interface NodeProps {
  position: [number, number, number];
  color: string;
  label: string;
}

function GlowingNode({ position, color, label }: NodeProps) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
      <Sphere args={[0.35, 64, 64]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
      <Text 
        position={[0, -0.8, 0]} 
        fontSize={0.25} 
        color="#ffffff" 
        anchorX="center" 
        anchorY="middle"
      >
        {label}
      </Text>
    </Float>
  );
}

function DataParticle({
  start,
  end,
  color,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() * 0.4) % 1;
      ref.current.position.lerpVectors(start, end, t);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={2} 
        toneMapped={false}
      />
    </mesh>
  );
}

export function SystemArchitecture3D() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
    }
  });

  const nodes = useMemo(() => [
    { pos: new THREE.Vector3(-4, 0, 0), color: "#FF4D00", label: "Client // React" },
    { pos: new THREE.Vector3(0, 2, -1.5), color: "#FFFFFF", label: "Core // API" },
    { pos: new THREE.Vector3(4, 0, 0), color: "#FF4D00", label: "Data // Postgres" },
    { pos: new THREE.Vector3(0, -2, -1.5), color: "#666666", label: "Auth // JWT" },
  ], []);

  const lines = useMemo(() => [
    [nodes[0].pos, nodes[1].pos],
    [nodes[1].pos, nodes[2].pos],
    [nodes[0].pos, nodes[3].pos],
    [nodes[3].pos, nodes[2].pos],
  ], [nodes]);

  return (
    <group ref={group}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#FF4D00" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />

      {/* Nodes */}
      {nodes.map((n, i) => (
        <GlowingNode
          key={i}
          position={n.pos.toArray() as [number, number, number]}
          color={n.color}
          label={n.label}
        />
      ))}

      {/* Connections */}
      {lines.map((line, i) => (
        <Line
          key={`line-${i}`}
          points={[line[0], line[1]]}
          color="#ffffff"
          opacity={0.15}
          transparent
          lineWidth={1.5}
        />
      ))}

      {/* Data Flow Particles */}
      <DataParticle start={nodes[0].pos} end={nodes[1].pos} color="#FF4D00" />
      <DataParticle start={nodes[1].pos} end={nodes[2].pos} color="#FFFFFF" />
      <DataParticle start={nodes[0].pos} end={nodes[3].pos} color="#FFFFFF" />
      <DataParticle start={nodes[3].pos} end={nodes[2].pos} color="#FF4D00" />

      <ContactShadows 
        position={[0, -4, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />
    </group>
  );
}
