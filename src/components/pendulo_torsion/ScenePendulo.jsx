import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BarWithSpheres from "./BarWithSpheres";

export default function ScenePendulo({
  dimensions,
  calculateAngle,
  isAnimating,
  reset,
}) {
  // estilo del canvas
  let canvasStyle = { display: "flex", height: "100vh" };

  // Posiciones calculadas
  const ceilingHeight = 4 * dimensions.r * dimensions.l;
  const wireHeight = ceilingHeight / 2;
  const wireRadius = 0.01 * dimensions.r * dimensions.l;

  return (
    <Canvas style={canvasStyle}>
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

      {/* Marcador posición inicial (la bolita) */}
      {/* <mesh position={[dimensions.l / 2, 0, 0]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="yellow" metalness={0.5} roughness={0.4} />
      </mesh> */}
      {/* <axesHelper args={[dimensions.l]} /> */}

      {/* Marcador posicion inicial (la bolita)*/}
      {/* <mesh position={[dimensions.l / 2, 0, 0]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="yellow" metalness={0.5} roughness={0.4} />
      </mesh> */}

      <BarWithSpheres
        length={dimensions.l}
        radius={dimensions.r}
        kTorsion={dimensions.k}
        calculateAngle={calculateAngle}
        isAnimating={isAnimating}
        reset={reset}
      ></BarWithSpheres>
    </Canvas>
  );
}
