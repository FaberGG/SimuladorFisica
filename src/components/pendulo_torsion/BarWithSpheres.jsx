import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import React from "react";
import * as THREE from "three"; // Asegúrate de importar THREE

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
  setAllTimeVars,
  position,
  isAnimating,
  reset,
}) {
  const groupRef = useRef();
  const [elapsedTime, setElapsedTime] = useState(0); // Tiempo acumulado antes de la pausa
  const clockRef = useRef(new THREE.Clock(false)); // Reloj para el cálculo del tiempo

  // Efecto para manejar la pausa/reanudación del reloj
  useEffect(() => {
    if (isAnimating) {
      clockRef.current.start(); // Iniciar el reloj cuando la animación comience
    } else {
      clockRef.current.stop(); // Detener el reloj si se pausa
      setElapsedTime((prev) => prev + clockRef.current.getElapsedTime()); // Acumular el tiempo transcurrido antes de pausar
    }
  }, [isAnimating]);

  useFrame(() => {
    if (isAnimating) {
      const currentElapsedTime = clockRef.current.getElapsedTime();
      const totalElapsedTime = elapsedTime + currentElapsedTime; // Tiempo total transcurrido
      setAllTimeVars(totalElapsedTime);
    }
    groupRef.current.rotation.y = position;
  });
  return (
    <>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Barra */}
        <mesh>
          <boxGeometry
            args={[
              length,
              (0.1 * radius) / 2 + length * (0.03 * radius),
              (0.1 * radius) / 2 + length * (0.03 * radius),
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
