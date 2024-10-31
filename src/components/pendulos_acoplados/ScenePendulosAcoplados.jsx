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
      setStrEcuation,
      position,
      updateDataGraph,
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
      //Variables a calcular
      let omegas = { omega1: 0, omega2: 0 };

      //IMPLEMENTAR LOS CALCULOS PARA ACOPLADOS
      let newInertia = calculateInertia(variables.r, variables.l);
      let newInertia2 = calculateInertia(variables.r2, variables.l2);

      // Calculamos las frecuencias normales omega_1 y omega_2
      omegas = coupledCalculations.calculateFrequencies(
        newInertia,
        newInertia2,
        dimensions.K,
        dimensions.K2
      );
      let newInitAmplitude; //A1 A2
      let newInitAmplitude2; //B1 B2

      let strEcuation = "";
      let strEcuation2 = "";
      //(LAS VARIABLES QUE NO SE CALCULAN AUI SE DEJAN EN CERO)
      return {
        InitAmplitude: newInitAmplitude,
        inertia: newInertia,
        phi: 0,
        omega: omegas.omega1,
        omegaD: 0, //no se calcula
        gamma: 0, //no se calcula
        period: coupledCalculations.calculatePeriod(variables.omega),
        frecuency: 0,
        delta: 0, //no se calcula

        InitAmplitude2: newInitAmplitude2,
        inertia2: newInertia2,
        phi2: 0,
        omega2: omegas.omega2,
        omegaD2: 0, //no se calcula
        gamma2: 0, //no se calcula
        period2: coupledCalculations.calculatePeriod(variables.omega2),
        frecuency2: 0,
        delta2: 0, //no se calcula
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
          updateDataGraph();
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

        {/* Pendulo superior (pendulo1) */}
        <BarWithSpheres
          length={dimensions.l}
          radius={dimensions.r}
          thetaPosition={position.position} // ángulo theta a mostrar
          yposition={barsDistanceBtwn / 2}
          showGuides={showGuides}
        ></BarWithSpheres>

        {/* pendulo inferior (pendulo 2) */}
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
