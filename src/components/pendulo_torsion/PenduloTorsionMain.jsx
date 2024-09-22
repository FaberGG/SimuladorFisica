import React from "react";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import ScenePendulo from "./ScenePendulo";
import { ControlsForm } from "./ControlsForm";
import { velocity } from "three/webgpu";

export const PenduloTorsionMain = () => {
  const [dimensions, setDimensions] = useState({ b: 1, k: 5, l: 1, r: 0.2 });
  const [initConditions, setInitConditions] = useState({
    position: 0,
    velocity: 0,
  });

  const [variables, setvariables] = useState({
    amplitude: 0,
    inertia: 0,
    phi: 0,
    omega: 0,
    period: 0,
    frecuency: 0,
    ept: 0,
    ecr: 0, //energia cinetica rotacional
  });

  const [angle, setAngle] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reset, setReset] = useState(false);
  //SECCION CONDICIONES INICIALES (SOLO SE CALCULAN UNA VEZ)

  //SECCION FUNCIONES DE TIEMPO

  // Función para calcular el angulo con tiempo
  const calculateAngle = (time) => {
    //Se calcula en angulo con las ecuaciones
    const newAngle = (Math.PI / 4) * Math.sin(1 * time);

    if (Math.abs(newAngle - angle) > 0.05) {
      // Solo actualizar si hay diferencia significativa (por rendimiento)
      setAngle(newAngle);
    }
    return newAngle;
  };
  //FIN DE LOS CALCULOS

  //CONTROLAR ANIMACION

  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev); // Alternar entre verdadero y falso
  };

  //REINICIAR EL PROGRAMA
  const resetSystem = () => {
    setIsAnimating(false);
    setReset(true);
    setTimeout(() => setReset(false), 0);
    setDimensions({ b: 1, k: 5, l: 1, r: 0.2 });
  };

  return (
    <>
      <div className="form-scene-container">
        <ControlsForm
          dimensions={dimensions}
          setDimensions={setDimensions}
          toggleAnimation={toggleAnimation}
          resetSystem={resetSystem}
          isAnimating={isAnimating}
          variables={variables}
          initConditions={initConditions}
          position={angle.toFixed(2)}
          velocity={velocity.toFixed(2)}
        />
        <ScenePendulo
          dimensions={dimensions}
          calculateAngle={calculateAngle}
          isAnimating={isAnimating}
          reset={reset}
        />
      </div>
    </>
  );
};
