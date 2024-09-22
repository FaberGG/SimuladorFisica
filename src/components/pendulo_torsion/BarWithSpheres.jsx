import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import React from "react";
import * as THREE from "three"; // Asegúrate de importar THREE

function Sphere({ radius, xPosition }) {
  return (
    <mesh position={[xPosition, 0, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color="red" metalness={0.5} roughness={0.4} />
    </mesh>
  );
}

export default function BarWithSpheres({
  length,
  radius,
  calculateAngle,
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

  // Handle reset
  useEffect(() => {
    if (reset) {
      setElapsedTime(0);
      clockRef.current = new THREE.Clock(false); // Reset the clock
      groupRef.current.rotation.y = 0; // Reset rotation
    }
  }, [reset]);
  useFrame(() => {
    if (isAnimating) {
      const currentElapsedTime = clockRef.current.getElapsedTime();
      const totalElapsedTime = elapsedTime + currentElapsedTime; // Tiempo total transcurrido
      console.log(currentElapsedTime + " -- " + totalElapsedTime);
      const angle = calculateAngle(totalElapsedTime);
      groupRef.current.rotation.y = angle;
    }
  });
  return (
    <>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Barra */}
        <mesh>
          <boxGeometry
            args={[length, 0.1 * radius * length, 0.1 * radius * length]}
          />
          <meshStandardMaterial color="white" metalness={0.6} roughness={0.1} />
        </mesh>

        {/* Esfera en el extremo izquierdo */}
        <Sphere radius={radius} xPosition={-length / 2} />
        {/* Esfera en el extremo derecho */}
        <Sphere radius={radius} xPosition={length / 2} />
      </group>
    </>
  );
}
