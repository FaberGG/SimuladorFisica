import React from "react";
import { useState } from "react";
import ScenePendulo from "./ScenePendulo";
import { ControlsForm } from "./ControlsForm";
//importo las funciones segun el tipo de movimiento
import { getMotionCalculations } from "./motionCalculations/useMotionCalculations";

export const PenduloTorsionMain = () => {
  //estado para el tipo de movimiento seleccionado (simple, damped, forcedUndamped)
  const [motionType, setMotionType] = useState("simple");
  //dimensiones
  const [dimensions, setDimensions] = useState({
    b: 1,
    k: 5,
    l: 1,
    r: 0.2,
    feFrecuency: 0,
    massSpheres: 1,
    massBar: 3,
  });

  //condiciones iniciales
  const [initConditions, setInitConditions] = useState({
    position: 0,
    velocity: 0,
  });

  //variables que solo se calculan una vez al establecer condiciones iniciales
  const [variables, setvariables] = useState({
    InitAmplitude: 0,
    inertia: 0,
    phi: 0,
    omega: 0, //frecuencia nat
    omegaD: 0, //frecuencia amortiguada
    omegaF: 0, //frecuencia angular forzada
    gamma: 0, //amortiguamiento
    period: 0,
    frecuency: 0,
  });

  const [time, setTime] = useState(0);
  //theta o posicion (se actualiza todo el tiempo despues de presionar el boton inicial)
  const [position, setPosition] = useState(initConditions.position);
  //velocidad, se calcula en todo momento (solo para mostrar su valor no se usa para mover el sistema)
  const [velocity, setVelocity] = useState(initConditions.velocity);
  //aceleracion, se actualiza en todo momento solo para mostrar solamente
  const [acceleration, setAcceleration] = useState(0);
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
  const [showGuides, setShowGuides] = useState(false);

  //CALCULOS
  //TODOS LOS CALCULOS LOS IMPORTO EN EL SIGUIENTE OBJETO, SEGUN EL TIPO DE MOVIMIENTO
  const motionCalculations = getMotionCalculations(motionType);

  //CALCULO PARA LA INERCIA (SIEMPRE SERA LA MISMA)
  // Función para calcular el momento de inercia del sistema
  const calculateInertia = (r, l) => {
    //SE ASUME QUE masaEsfera=1kg y masaBarra = 3kg
    return (4 / 5) * Math.pow(r, 2) + (3 / 4) * Math.pow(l, 2);
  };

  //LLAMADO A LOS CALCULOS CON EL VALOR DE LAS CONDICIONES INICIALES
  const updateInitConditions = (name, value) => {
    setInitConditions((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0, // Convierte a float y usa 0 si es NaN
    }));

    // Calcula las variables iniciales con las nuevas condiciones
    setAllNoTimeVars();

    name == "position" ? setPosition(parseFloat(value) || 0) : 0;
    name == "velocity" ? setVelocity(parseFloat(value) || 0) : 0;
  };

  //LLAMADO A LOS CALCULOS PARA CADA VALOR DE TIEMPO (CUANDO ESTA EN EJECUCION)

  const setAllTimeVars = (time) => {
    setTime(time);
    if (motionType != "simple") {
      setAmplitude(motionCalculations.calculateAmplitude(time));
    }
    setPosition(motionCalculations.calculatePosition(time));
    setAcceleration(motionCalculations.calculateAcceleration(time));
    setVelocity(motionCalculations.calculateVelocity(time));
    setEnergy(motionCalculations.calculateEnergy(time));
  };

  //setear todas las variables que no dependen del tiempo al darle el btn de iniciar
  const setAllNoTimeVars = () => {
    const newAmplitude = motionCalculations.calculateInitAmplitude();
    const newInertia = calculateInertia(dimensions.r, dimensions.l);

    const newOmega = motionCalculations.calculateOmega();
    const newPeriod = motionCalculations.calculatePeriod();
    const newFrequency = motionCalculations.calculateFrequency();
    let newPhi = 0;
    let newOmegaD = newOmega;
    let newGamma = 0;
    let newOmegaF = 0;
    if (motionType == "damped") {
      newOmegaD = motionCalculations.calculateOmegaD();
      newGamma = motionCalculations.calculateGamma();
      newPhi = motionCalculations.calculatePhi();
    } else if (motionType == "forcedUndamped") {
      newOmegaF = motionCalculations.calculateOmegaF();
    }

    // Actualiza el estado con las nuevas variables calculadas
    setvariables({
      InitAmplitude: newAmplitude,
      inertia: newInertia,
      phi: newPhi,
      omega: newOmega,
      omegaD: newOmegaD,
      omegaF: newOmegaF,
      gamma: newGamma,
      period: newPeriod,
      frecuency: newFrequency,
    });
  };
  //CONTROLAR ANIMACION
  const toggleAnimation = () => {
    //al iniciar animacion, calcular todas las variables que no dependen del tiempo
    if (dimensions.l == 0 || dimensions.r == 0 || dimensions.k == 0) {
      alert("ERORR: Las dimensiones o k no pueden ser 0 o nulas");
    } else {
      setAllNoTimeVars();
      setIsAnimating((prev) => !prev); // Alternar entre verdadero y falso
    }
  };

  //MOSSTRAR U OCULTAR GUIAS (TRANSPORTADOR)
  const toggleGuides = () => {
    setShowGuides((prev) => !prev);
  };

  //REINICIAR EL PROGRAMA
  const resetSystem = () => {
    setIsAnimating(false);
    setReset(true);
    setTimeout(() => setReset(false), 0);

    setDimensions({
      b: 1,
      k: 5,
      l: 1,
      r: 0.2,
      feFrecuency: 0,
      massSpheres: 1,
      massBar: 3,
    });
    setInitConditions({ position: 0, velocity: 0 });
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
    setPosition(0);
    setVelocity(0);
    setAcceleration(0);
    setAmplitude(variables.InitAmplitude);
    setEnergy(0);
  };

  return (
    <>
      <div className="form-scene-container">
        <ControlsForm
          motionType={motionType}
          setMotionType={setMotionType}
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
          toggleGuides={toggleGuides}
        />
        <ScenePendulo
          dimensions={dimensions}
          setAllTimeVars={setAllTimeVars}
          position={position}
          isAnimating={isAnimating}
          reset={reset}
          showGuides={showGuides}
        />
      </div>
    </>
  );
};
