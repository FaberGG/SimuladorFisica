import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BarWithSpheres from "./BarWithSpheres";
import Protractor from "./Protractor";
import * as THREE from "three";

export default function ScenePendulo({
  dimensions,
  setAllTimeVars,
  position,
  isAnimating,
  reset,
  showGuides,
}) {
  // Variables para gestionar el tiempo
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

  // Efecto para reiniciar el tiempo cuando reset es true
  useEffect(() => {
    if (reset) {
      clockRef.current.stop(); // Detener el reloj
      clockRef.current = new THREE.Clock(false); // Crear un nuevo reloj reseteado
      setElapsedTime(0); // Reiniciar el tiempo acumulado
    }
  }, [reset]);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        const currentElapsedTime = clockRef.current.getElapsedTime();
        const totalElapsedTime = elapsedTime + currentElapsedTime; // Tiempo total transcurrido
        setAllTimeVars(totalElapsedTime);
      }, 16); // Aproximadamente 60 FPS

      return () => clearInterval(interval);
    }
  }, [isAnimating, elapsedTime, setAllTimeVars]);

  // Posiciones calculadas
  const ceilingHeight = 4 * dimensions.r * dimensions.l;
  const wireHeight = ceilingHeight / 2;
  const wireRadius =
    (0.1 * dimensions.r + 0.1 * dimensions.l * (0.003 * dimensions.r)) / 4;

  return (
    <>
      {/* libreria para los controles de la camara */}
      <OrbitControls />
      {/* luz a la escena */}
      <directionalLight position={[0, 0, 2]} intensity={0.7} />
      <ambientLight intensity={0.5} />

      {/* Bloque techo */}
      <mesh position={[0, ceilingHeight, 0]}>
        <boxGeometry args={[2 * dimensions.l, 0.2, 2 * dimensions.l]} />
        <meshStandardMaterial
          color="white"
          metalness={0.8}
          roughness={0.3}
          transparent={true}
          opacity={0.7}
        />
      </mesh>

      {/* Alambre */}
      <mesh position={[0, wireHeight, 0]}>
        <cylinderGeometry args={[wireRadius, wireRadius, ceilingHeight, 8]} />
        <meshStandardMaterial color="white" metalness={0.7} roughness={0.3} />
      </mesh>
      {showGuides ? <axesHelper args={[dimensions.l]} /> : <></>}

      {/* TRANSPORTADOR PARA TENER REFERENCIA DEL ANGULO */}
      {showGuides ? <Protractor length={dimensions.l / 2} /> : ""}

      <BarWithSpheres
        length={dimensions.l}
        radius={dimensions.r}
        position={position} // ángulo theta a mostrar
        isAnimating={isAnimating}
      ></BarWithSpheres>
    </>
  );
}
