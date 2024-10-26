import React from "react";
import { useState } from "react";
import ScenePendulo from "./ScenePendulo";
import { Canvas } from "@react-three/fiber";

import { ControlsForm } from "./ControlsForm";
//importo las funciones segun el tipo de movimiento
import { getMotionCalculations } from "./motionCalculations/useMotionCalculations";

export const PenduloTorsionMain = () => {
  //estado para el tipo de movimiento seleccionado (simple, damped, forcedUndamped, forcedDamped)
  const [motionType, setMotionType] = useState("simple");
  //estado auxiliar para el tipo de amortiguamiento si aplica
  const [dampedType, setDampedType] = useState("NONE");
  //estado auxiliar que revela si existe resonancia en el sistema
  const [resonance, setResonance] = useState(false);
  //dimensiones
  const [dimensions, setDimensions] = useState({
    b: 0.1,
    k: 5,
    l: 1,
    r: 0.2,
    Fo: 1, //AMPLUTUD FUERZA EXTERNA
    omegaF: 1, //FRECUENCIA FUERZA EXTERNA
    massSpheres: 1,
    massBar: 3,
  });

  //condiciones iniciales
  const [initConditions, setInitConditions] = useState({
    position: -0.22,
    velocity: 0,
  });

  //variables que solo se calculan una vez al establecer condiciones iniciales
  const [variables, setvariables] = useState({
    InitAmplitude: 0,
    inertia: 0,
    phi: 0,
    omega: 0,
    omegaD: 0, //frecuencia amortiguada
    gamma: 0, //amortiguamiento
    period: 0,
    frecuency: 0,
    delta: 0,
  });

  const [time, setTime] = useState(0);
  //theta o posicion (se actualiza todo el tiempo despues de presionar el boton inicial)
  const [position, setPosition] = useState(initConditions.position);
  //velocidad, se calcula en todo momento (solo para mostrar su valor no se usa para mover el sistema)
  const [velocity, setVelocity] = useState(initConditions.velocity);
  //amplitud (con amortiguamiento varia en el tiempo)
  const [amplitude, setAmplitude] = useState(variables.InitAmplitude);
  //Energia tambien varia con el tiempo
  const [energy, setEnergy] = useState(0);

  //ESTADOS DEL PROGRAMA
  //es falso cuando el programa esta pausado, true cuando se estan ejecutando los calculos de posicion
  const [isAnimating, setIsAnimating] = useState(false);
  //se actualiza al querer reiniciar el programa de cero
  const [reset, setReset] = useState(false);
  //se actualiza para mostrar guias (el transportador)
  const [showGuides, setShowGuides] = useState(true);

  //CALCULOS
  //TODOS LOS CALCULOS LOS IMPORTO EN EL SIGUIENTE OBJETO, SEGUN EL TIPO DE MOVIMIENTO
  const motionCalculations = getMotionCalculations(motionType);

  //LLAMADO A LOS CALCULOS CON EL VALOR DE LAS CONDICIONES INICIALES
  const updateInitConditions = (name, value) => {
    setInitConditions((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0, // Convierte a float y usa 0 si es NaN
    }));

    name == "position" ? setPosition(parseFloat(value) || 0) : 0;
    name == "velocity" ? setVelocity(parseFloat(value) || 0) : 0;
  };

  //LLAMADO A LOS CALCULOS PARA CADA VALOR DE TIEMPO (CUANDO ESTA EN EJECUCION)

  const setAllTimeVars = (time) => {
    setTime(time);
    switch (motionType) {
      case "simple":
        setPosition(
          motionCalculations.calculatePosition(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega
          )
        );
        setVelocity(
          motionCalculations.calculateVelocity(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega
          )
        );
        setEnergy(
          motionCalculations.calculateEnergy(
            velocity,
            position,
            variables.inertia,
            dimensions.k
          )
        );
        setAmplitude(variables.InitAmplitude);
        break;

      case "damped":
        setPosition(
          motionCalculations.calculatePosition(
            time,
            variables.InitAmplitude,
            variables.omega,
            variables.omegaD,
            variables.gamma,
            variables.phi,
            dampedType
          )
        );

        setAmplitude(
          dampedType == "subDamped"
            ? motionCalculations.calculateAmplitude(
                time,
                variables.InitAmplitude,
                variables.gamma
              )
            : 0
        );
        setEnergy(
          motionCalculations.calculateEnergy(
            velocity,
            position,
            variables.inertia,
            dimensions.k
          )
        );

        break;
      case "forcedUndamped": //caso forzado no amortiguado
        setPosition(
          motionCalculations.calculatePosition(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega,
            dimensions.omegaF
          )
        );
        setVelocity(
          motionCalculations.calculateVelocity(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega,
            dimensions.omegaF,
            //agrego Fo, inercia
            dimensions.Fo,
            variables.inertia
          )
        );

        setEnergy(
          motionCalculations.calculateEnergy(
            time,
            variables.InitAmplitude,
            dimensions.omegaF,
            dimensions.Fo
          )
        );
        resonance
          ? setAmplitude(
              motionCalculations.calculateAmplitude(
                time,
                variables.InitAmplitude
              )
            )
          : setAmplitude(variables.InitAmplitude);
        break;
      case "forcedDamped": //caso forzado amortiguado
        setPosition(
          motionCalculations.calculatePosition(
            time,
            variables.omega,
            dimensions.omegaF,
            variables.InitAmplitude,
            variables.phi
          )
        );
        setEnergy(
          //FALTA INSTANCIAR DELTA PORQUE NO SE COMO XD  delta
          motionCalculations.calculateEnergy(
            time,
            variables.InitAmplitude,
            variables.gamma,
            dimensions.omegaF,
            variables.inertia,
            dimensions.k
          )
        );
        setAmplitude(
          motionCalculations.calculateAmplitude(
            time,
            variables.InitAmplitude
            //quito variables.gamma
          )
        );

        break;
      default: // Tipo de mov no implementado
        alert(
          "ERROR: Tipo de movimiento " +
            motionType +
            " no implementado. asegurese de seleccionar uno"
        );
        break;
    }
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
        newGamma = motionCalculations.calculateGamma(dimensions.b, newInertia);
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
        newResonance = motionCalculations.checkResonance(
          newOmega,
          dimensions.omegaF
        );
        newDelta = motionCalculations.calculateDelta(
          newOmega,
          dimensions.omegaF
        );
        //Revisa si existe resonancia
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
        newGamma = motionCalculations.calculateGamma(dimensions.b, newInertia);

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
    // Actualiza el estado con las nuevas variables calculadas
    setvariables({
      InitAmplitude: newAmplitude,
      inertia: newInertia,
      phi: newPhi,
      omega: newOmega,
      omegaD: newOmegaD,
      gamma: newGamma,
      period: newPeriod,
      frecuency: newFrequency,
      delta: newDelta,
    });
  };

  //CONTROLAR ANIMACION
  const toggleAnimation = () => {
    //al iniciar animacion, calcular todas las variables que no dependen del tiempo
    if (dimensions.l == 0 || dimensions.r == 0 || dimensions.k == 0) {
      alert("ERORR: Las dimensiones o k no pueden ser 0 o nulas");
    } else if (Math.abs(initConditions.position) > 0.2618) {
      alert(
        "ERROR: La posicion y velocidad inicial deben estar en el rango de 15 grados"
      );
    } //si ambas condiciones iniciales son cero se solicita que se llenen
    else if (initConditions.position == 0 && initConditions.velocity == 0) {
      alert(" ERROR: La posicion y velocidad inicial deben ser ingresadas ");
    } else {
      setAllNoTimeVars();
      setIsAnimating((prev) => !prev); // Alternar entre verdadero y falso
    }
  };

  //REINICIAR EL PROGRAMA
  const resetSystem = () => {
    setIsAnimating(false);
    setReset(true);
    setTimeout(() => setReset(false), 100);

    setvariables({
      InitAmplitude: 0,
      inertia: 0,
      phi: 0,
      omega: 0,
      omegaD: 0,
      omegaF: 0,
      gamma: 0,
      period: 0,
      frecuency: 0,
    });
    setTime(0);
    setPosition(initConditions.position);
    setVelocity(initConditions.velocity);
    setAmplitude(variables.InitAmplitude);
    setEnergy(0);
  };

  return (
    <>
      <div className="form-scene-container">
        <ControlsForm
          motionType={motionType}
          setMotionType={setMotionType}
          dampedType={dampedType}
          dimensions={dimensions}
          setDimensions={setDimensions}
          isAnimating={isAnimating}
          toggleAnimation={toggleAnimation}
          resetSystem={resetSystem}
          initConditions={initConditions}
          onInitConditionChange={updateInitConditions}
          variables={variables}
          time={time}
          position={position}
          velocity={velocity}
          amplitude={amplitude}
          energy={energy}
          setShowGuides={setShowGuides}
          showGuides={showGuides}
        />
        <Canvas style={{ display: "flex", height: "100vh" }}>
          <ScenePendulo
            dimensions={dimensions}
            setAllTimeVars={setAllTimeVars}
            position={position}
            isAnimating={isAnimating}
            reset={reset}
            showGuides={showGuides}
          />
        </Canvas>
      </div>
    </>
  );
};
