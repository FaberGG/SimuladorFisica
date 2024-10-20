import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import angleSprite from "./assets/protractor-texture.png";

export default function Protractor({ length, yposition }) {
  // Carga la textura desde el objeto importado
  const texture = useLoader(TextureLoader, angleSprite);
  // El radio del disco es proporcional a la longitud de la barra
  const radius = length / 2;

  return (
    <mesh position={[0, yposition, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* Crear el disco en el plano XY */}
      <cylinderGeometry args={[radius, radius, 0.01, 64]} />
      {/* Aplicar la textura al disco */}
      <meshStandardMaterial map={texture} opacity={0.1} />
    </mesh>
  );
}
