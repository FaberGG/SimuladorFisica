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

//importo las funciones segun el tipo de movimiento
import { getMotionCalculations } from "./motionCalculations/useMotionCalculations";

const ScenePendulo = forwardRef(
  (
    {
      dimensions,
      variables,
      initConditions,
      motionType,
      dampedType,
      setDampedType,
      setTimeVariables,
      setTime,
      position,
      isAnimating,
      reset,
      showGuides,
    },
    ref
  ) => {
    //auxiliar que comprueba si existe resonancia
    const [resonance, setResonance] = useState(false);

    //Estado para pasarle la posicion al componente hijo
    const [elapsedTime, setElapsedTime] = useState(0); // Tiempo acumulado antes de la pausa
    const clockRef = useRef(new THREE.Clock(false)); // Reloj para el cálculo del tiempo

    // Posiciones calculadas
    const ceilingHeight = 4 * dimensions.r * dimensions.l;
    const wireHeight = ceilingHeight / 2;
    const wireRadius =
      (0.1 * dimensions.r + 0.1 * dimensions.l * (0.003 * dimensions.r)) / 4;

    //CALCULOS
    //TODOS LOS CALCULOS LOS IMPORTO EN EL SIGUIENTE OBJETO, SEGUN EL TIPO DE MOVIMIENTO
    const motionCalculations = getMotionCalculations(motionType);

    //LLAMADO A LOS CALCULOS PARA CADA VALOR DE TIEMPO (CUANDO ESTA EN EJECUCION)
    const setAllTimeVars = (time) => {
      setTime(time);
      let newPosition = 0,
        newVelocity = 0,
        newAmplitude = 0,
        newEnergy = 0;

      switch (motionType) {
        case "simple":
          newPosition = motionCalculations.calculatePosition(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega
          );
          newVelocity = motionCalculations.calculateVelocity(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega
          );
          newEnergy = motionCalculations.calculateEnergy(
            newVelocity,
            newPosition,
            variables.inertia,
            dimensions.k
          );
          newAmplitude = variables.InitAmplitude;
          break;

        case "damped":
          newPosition = motionCalculations.calculatePosition(
            time,
            variables.InitAmplitude,
            variables.omega,
            variables.omegaD,
            variables.gamma,
            variables.phi,
            dampedType
          );
          newAmplitude =
            dampedType === "subDamped"
              ? motionCalculations.calculateAmplitude(
                  time,
                  variables.InitAmplitude,
                  variables.gamma
                )
              : 0;
          newEnergy = motionCalculations.calculateEnergy(
            newVelocity,
            newPosition,
            variables.inertia,
            dimensions.k
          );
          break;

        case "forcedUndamped":
          newPosition = motionCalculations.calculatePosition(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega,
            dimensions.omegaF
          );
          newVelocity = motionCalculations.calculateVelocity(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega,
            dimensions.omegaF,
            dimensions.Fo,
            variables.inertia
          );
          newEnergy = motionCalculations.calculateEnergy(
            time,
            variables.InitAmplitude,
            dimensions.omegaF,
            dimensions.Fo
          );
          newAmplitude = resonance
            ? motionCalculations.calculateAmplitude(
                time,
                variables.InitAmplitude
              )
            : variables.InitAmplitude;
          break;

        case "forcedDamped":
          newPosition = motionCalculations.calculatePosition(
            time,
            variables.omega,
            dimensions.omegaF,
            variables.InitAmplitude,
            variables.phi
          );
          newEnergy = motionCalculations.calculateEnergy(
            time,
            variables.InitAmplitude,
            variables.gamma,
            dimensions.omegaF,
            variables.inertia,
            dimensions.k
          );
          newAmplitude = motionCalculations.calculateAmplitude(
            time,
            variables.InitAmplitude
          );
          break;

        default:
          alert(
            "ERROR: Tipo de movimiento " +
              motionType +
              " no implementado. Asegúrese de seleccionar uno"
          );
          return;
      }

      setTimeVariables({
        position: newPosition,
        velocity: newVelocity,
        amplitude: newAmplitude,
        energy: newEnergy,
      });
    };

    //setear todas las variables que no dependen del tiempo al darle el btn de iniciar
    const setAllNoTimeVars = () => {
      //calcula la inercia con los valores de radio esferas y longitud barra
      const newInertia = motionCalculations.calculateInertia(
        dimensions.r,
        dimensions.l
      );

      //CALCULA LA FRECUENCIA NATURAL DE MOV
      const newOmega = motionCalculations.calculateOmega(
        newInertia,
        dimensions.k
      );

      //vars temps
      let newGamma = 1;
      let newOmegaD = newOmega;
      let newPhi = 0;
      let newAmplitude = 0;
      let newPeriod = 0;
      let newFrequency = 0;
      let newResonance = false;
      let newDelta = 0;
      switch (motionType) {
        case "simple":
          newPhi = motionCalculations.calculatePhi(
            initConditions.position,
            initConditions.velocity,
            newOmega
          );
          //calcula la amplitud inicial segun el tipo de mov
          newAmplitude = motionCalculations.calculateInitAmplitude(
            newPhi,
            initConditions.position,
            initConditions.velocity,
            newOmega
          );
          //calcula el periodo segun el tipo de mov
          newPeriod = motionCalculations.calculatePeriod(newOmega);
          //calcula la frecuencia a partir del periodo
          newFrequency = motionCalculations.calculateFrequency(newPeriod);
          //calcula el valor de phi segun el tipo de movimiento
          break;

        case "damped": //caso amortiguado omegaTemp es omegaD
          newGamma = motionCalculations.calculateGamma(
            dimensions.b,
            newInertia
          );
          const type = motionCalculations.checkDampedType(newOmega, newGamma);

          if (type == "subDamped") {
            newOmegaD = motionCalculations.calculateOmegaD(newOmega, newGamma);
            newPhi = motionCalculations.calculatePhi(
              initConditions.position,
              initConditions.velocity,
              newOmegaD,
              newGamma
            );
          }
          newAmplitude = motionCalculations.calculateInitAmplitude(
            newPhi,
            initConditions.position,
            initConditions.velocity,
            newOmega,
            newOmegaD,
            newGamma,
            type
          );
          setDampedType(type);
          break;

        case "forcedUndamped": //caso forzado no amortiguado
          //Revisa si existe resonancia
          newResonance = motionCalculations.checkResonance(
            newOmega,
            dimensions.omegaF
          );
          newPhi = motionCalculations.calculatePhiForUnd(
            initConditions.position,
            initConditions.velocity,
            newOmega,
            dimensions.omegaF,
            dimensions.Fo,
            newInertia
          );
          newAmplitude = motionCalculations.calculateForcedInitAmplitude(
            newPhi,
            initConditions.position,
            initConditions.velocity,
            newOmega,
            dimensions.omegaF,
            dimensions.Fo,
            newInertia
          );
          //calcula el periodo segun el tipo de mov
          newPeriod = motionCalculations.calculatePeriod(newOmega);
          //calcula la frecuencia a partir del periodo
          newFrequency = motionCalculations.calculateFrequency(newPeriod);
          //calcula el valor de phi segun el tipo de movimiento
          break;
        case "forcedDamped": //caso forzado amortiguado
          newGamma = motionCalculations.calculateGamma(
            dimensions.b,
            newInertia
          );
          const typeforcedDamped = motionCalculations.checkDampedType(
            newOmega,
            newGamma
          );

          newAmplitude = motionCalculations.calculateInitAmplitude(
            dimensions.Fo,
            dimensions.k,
            dimensions.omegaF,
            newOmega,
            newInertia,
            newGamma
          );

          newDelta = motionCalculations.calculateDelta(
            newOmega,
            dimensions.omegaF,
            newGamma
          );
          setDampedType(typeforcedDamped);

          break;
        default: // Tipo de mov no implementado
          alert(
            "ERROR: Tipo de movimiento " +
              motionType +
              " no implementado. asegurese de seleccionar uno"
          );
          break;
      }

      setResonance(newResonance);
      return {
        InitAmplitude: newAmplitude,
        inertia: newInertia,
        phi: newPhi,
        omega: newOmega,
        omegaD: newOmegaD,
        gamma: newGamma,
        period: newPeriod,
        frecuency: newFrequency,
        delta: newDelta,
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
