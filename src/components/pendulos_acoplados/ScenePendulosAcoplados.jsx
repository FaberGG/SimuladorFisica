import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { OrbitControls } from "@react-three/drei";
import BarWithSpheres from "../BarWithSpheres";
import Protractor from "../Protractor";
import * as THREE from "three";

const ScenePendulo = forwardRef(
  (
    {
      dimensions,
      variables,
      initConditions,
      setTimeVariables,
      setTime,
      position,
      isAnimating,
      reset,
      showGuides,
    },
    ref
  ) => {
    //Estado para pasarle la posicion al componente hijo
    const [elapsedTime, setElapsedTime] = useState(0); // Tiempo acumulado antes de la pausa
    const clockRef = useRef(new THREE.Clock(false)); // Reloj para el cálculo del tiempo

    // dimensiones proporcionales para los objetos
    const ceilingHeight = 4 * dimensions.r * dimensions.l;
    const wireHeight = ceilingHeight / 2;
    const wireRadius =
      (0.1 * dimensions.r + 0.1 * dimensions.l * (0.003 * dimensions.r)) / 4;

    //CALCULOS

    //LLAMADO A LOS CALCULOS PARA CADA VALOR DE TIEMPO (CUANDO ESTA EN EJECUCION)
    const setAllTimeVars = (time) => {
      setTime(time);
      let newPosition = 0;
      let newVelocity = 0;
      let newAmplitude = 0;
      let newPosition2 = 0;
      let newVelocity2 = 0;
      let newAmplitude2 = 0;
      let newEnergy = 0;

      setTimeVariables({
        position: newPosition,
        velocity: newVelocity,
        amplitude: newAmplitude,
        position2: newPosition2,
        velocity2: newVelocity2,
        amplitude2: newAmplitude2,
        energy: newEnergy,
      });
    };

    //setear todas las variables que no dependen del tiempo al darle el btn de iniciar
    const setAllNoTimeVars = () => {
      //IMPLEMENTAR LOS CALCULOS PARA ACOPLADOS
      //(LAS VARIABLES QUE NO SE CALCULAN AUI SE DEJAN EN CERO)
      return {
        InitAmplitude: 0,
        inertia: 0,
        phi: 0,
        omega: 0,
        omegaD: 0,
        gamma: 0,
        period: 0,
        frecuency: 0,
        delta: 0,

        InitAmplitude2: 0,
        inertia2: 0,
        phi2: 0,
        omega2: 0,
        omegaD2: 0,
        gamma2: 0,
        period2: 0,
        frecuency2: 0,
        delta2: 0,
      };
    };

    // Exponemos las funciones al componente padre
    useImperativeHandle(ref, () => ({
      setAllTimeVars,
      setAllNoTimeVars,
    }));

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
        {showGuides ? (
          <Protractor length={dimensions.l / 2} yposition={0} />
        ) : (
          ""
        )}

        <BarWithSpheres
          length={dimensions.l}
          radius={dimensions.r}
          thetaPosition={position} // ángulo theta a mostrar
          yposition={0}
        ></BarWithSpheres>
      </>
    );
  }
);

export default ScenePendulo;
