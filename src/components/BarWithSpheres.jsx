import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import React from "react";

function Sphere({ radius, xPosition, color }) {
  return (
    <mesh position={[xPosition, 0, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
    </mesh>
  );
}

export default function BarWithSpheres({
  length,
  radius,
  thetaPosition,
  yposition,
}) {
  const groupRef = useRef();

  // Uso de elapsedTime para controlar la rotación o el estado de la animación
  useFrame(() => {
    groupRef.current.rotation.y = thetaPosition; // Puedes usar elapsedTime aquí para ajustar la posición/rotación si es necesario
  });

  return (
    <>
      <group ref={groupRef} position={[0, yposition, 0]}>
        {/* Barra */}
        <mesh>
          <boxGeometry
            args={[
              length,
              (0.1 * radius + 0.3 * length * (0.003 * radius)) / 2,
              (0.1 * radius + 0.3 * length * (0.003 * radius)) / 2,
            ]}
          />
          <meshStandardMaterial color="white" metalness={0.6} roughness={0.1} />
        </mesh>

        {/* Esfera en el extremo izquierdo */}
        <Sphere radius={radius} xPosition={-length / 2} color="blue" />
        {/* Esfera en el extremo derecho */}
        <Sphere radius={radius} xPosition={length / 2} color="red" />
      </group>
    </>
  );
}
