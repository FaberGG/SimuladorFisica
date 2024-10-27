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

// Importamos todas las funciones del archivo de cálculos como un objeto
import * as coupledCalculations from "./coupled_calculations/coupledCalculations";

// También importamos calculateInertia del archivo globalCalculations
import { calculateInertia } from "../pendulo_torsion/motionCalculations/globalCalculations";

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

    //CALCULOS

    //LLAMADO A LOS CALCULOS PARA CADA VALOR DE TIEMPO (CUANDO ESTA EN EJECUCION)
    const setAllTimeVars = (time) => {
      setTime(time);

      // Funciones theta1 y theta2 en función de los parámetros
      let newPosition = coupledCalculations.position1(
        time,
        variables.InitAmplitude.A1,
        variables.InitAmplitude.A2,
        variables.omega,
        variables.omega2,
        variables.phi
      );
      let newPosition2 = coupledCalculations.position2(
        time,
        variables.InitAmplitude2.B1,
        variables.InitAmplitude2.B2,
        variables.omega,
        variables.omega2,
        variables.phi
      );

      let newAmplitude = variables.InitAmplitude;

      let newAmplitude2 = variables.InitAmplitude2;

      setTimeVariables({
        position: newPosition,
        velocity: 0,
        amplitude: newAmplitude,
        position2: newPosition2,
        velocity2: 0,
        amplitude2: newAmplitude2,
        energy: 0,
      });
    };

    //setear todas las variables que no dependen del tiempo al darle el btn de iniciar
    const setAllNoTimeVars = () => {
      //IMPLEMENTAR LOS CALCULOS PARA ACOPLADOS
      let inertia1 = calculateInertia(variables.mass, variables.length);
      let inertia2 = calculateInertia(variables.mass2, variables.length2);

      let amplitude1;
      let amplitude2;
      // Calculamos las frecuencias normales omega_1 y omega_2
      let { omega1, omega2 } = coupledCalculations.calculateFrequencies(
        inertia1,
        inertia2,
        dimensions.K1,
        dimensions.K2,
        dimensions.Kc
      );

      // Calculamos las relaciones de amplitud entre los modos normales
      let amplitudeRelation = coupledCalculations.calculateAmplitudeRelation(
        inertia1,
        inertia2,
        dimensions.K1,
        dimensions.K2,
        dimensions.Kc,
        omega1,
        omega2
      );

      //(LAS VARIABLES QUE NO SE CALCULAN AUI SE DEJAN EN CERO)
      return {
        InitAmplitude: amplitude1,
        inertia: inertia1,
        phi: coupledCalculations.calculatePhi(variables.InitAmplitude, 0),
        omega: coupledCalculations.calculateOmega(
          variables.inertia,
          variables.length
        ),
        omegaD: 0,
        gamma: 0,
        period: coupledCalculations.calculatePeriod(variables.omega),
        frecuency: 0,
        delta: 0,

        InitAmplitude2: amplitude2,
        inertia2: inertia2,
        phi2: coupledCalculations.calculatePhi(variables.InitAmplitude2, 0),
        omega2: coupledCalculations.calculateOmega(
          variables.inertia2,
          variables.length2
        ),
        omegaD2: 0,
        gamma2: 0,
        period2: coupledCalculations.calculatePeriod(variables.omega2),
        frecuency2: 0,
        delta2: 0,

        // Relaciones de amplitud para los modos normales
        amplitudeRelation: amplitudeRelation,
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

    // dimensiones proporcionales para los objetos
    const barsDistanceBtwn = 1.5 * (dimensions.r + dimensions.r2);
    const ceilingHeight =
      barsDistanceBtwn + 0.5 * (dimensions.l + dimensions.l2);
    const wirePosition = ceilingHeight / 2 - barsDistanceBtwn / 2;
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
        <mesh position={[0, ceilingHeight - barsDistanceBtwn / 2, 0]}>
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
        <mesh position={[0, wirePosition, 0]}>
          <cylinderGeometry args={[wireRadius, wireRadius, ceilingHeight, 8]} />
          <meshStandardMaterial color="white" metalness={0.7} roughness={0.3} />
        </mesh>

        <BarWithSpheres
          length={dimensions.l}
          radius={dimensions.r}
          thetaPosition={position.position} // ángulo theta a mostrar
          yposition={barsDistanceBtwn / 2}
          showGuides={showGuides}
        ></BarWithSpheres>

        <BarWithSpheres
          length={dimensions.l2}
          radius={dimensions.r2}
          thetaPosition={position.position2} // ángulo theta a mostrar
          yposition={-barsDistanceBtwn / 2}
          showGuides={showGuides}
        ></BarWithSpheres>
      </>
    );
  }
);

export default ScenePendulo;
