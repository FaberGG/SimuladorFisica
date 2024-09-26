import React from "react";
import { useState } from "react";
import ScenePendulo from "./ScenePendulo";
import { ControlsForm } from "./ControlsForm";

export const PenduloTorsionMain = () => {
  //estado para el tipo de movimiento seleccionado (simple, damped, forcedUndamped)
  const [motionType, setMotionType] = useState("damped");
  //dimensiones
  const [dimensions, setDimensions] = useState({ b: 1, k: 5, l: 1, r: 0.2 });
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
  //es falso cuando el programa esta pausado, true cuando se estan ejecutando los calculos de posicion
  const [isAnimating, setIsAnimating] = useState(false);
  //se actualiza al querer reiniciar el programa de cero
  const [reset, setReset] = useState(false);

  //SECCION CONDICIONES INICIALES
  //SE CALCULAN TODAS LAS VARIABLES QUE DEPENDEN DE LAS CONDICIONES INICIALES
  //son llamadas cada vez que se actualizan las condiciones iniciales
  const calculateInitAmplitude = () => {
    // Implementar amplitud inicial
    return 0;
  };

  const calculateInertia = () => {
    // Implementar inercia
    return 0;
  };

  const calculateOmega = () => {
    // Implementar frecuencia angular omega
    return 0;
  };
  const calculateOmegaD = () => {
    // Implementar frecuencia angular amortiguada omegaD
    return 0;
  };

  const calculateGamma = () => {
    // Implementar factor de amortiguamiento gamma
    return 0;
  };

  const calculatePeriod = () => {
    // Implementar periodo del péndulo
    return 0;
  };

  const calculateFrequency = () => {
    // Implementar frecuencia
    return 0;
  };

  //SECCION FUNCIONES DE TIEMPO
  //no llamar funciones de condiciones iniciales dentro de estas funciones (se actualizan cada fotograma)
  //en lugar de esto utilizar las variables de estado useState

  //calcular la POSICION theta
  const calculatePosition = (time) => {
    //se debe calcular el angulo con las variables que se calcularon anteriormente
    //los angulos siempre en radianes
    const newAngle = (Math.PI / 2) * Math.sin(time);

    return newAngle;
  };

  //funcion para calcular VELOCIDAD
  const calculateVelocity = (time) => {
    // Implementar
    const newVelocity = 0;
    return newVelocity;
  };

  //funcion para calcular acceleration (es necesaria?)
  const calculateAcceleration = (time) => {
    // Implementar
    const newAcceleration = 0;
    return newAcceleration;
  };

  //funcion para calcular VELOCIDAD
  const calculateAmplitude = (time) => {
    //En esta no se setea ningun estado
    //no se llama a la funcion calcular gamma, se usa la variable
    // Implementar
    const newAmplitude = 0;
    return newAmplitude;
  };

  //funcion para la ENERGIA
  const calculateEnergy = (time) => {
    // Implementar
    const newEnergy = 0;
    return newEnergy;
  };
  //FIN DE LOS CALCULOS

  //LLAMADO A LOS CALCULOS CON EL VALOR DE LAS CONDICIONES INICIALES
  const updateInitConditions = (name, value) => {
    setInitConditions((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0, // Convierte a float y usa 0 si es NaN
    }));

    // Calcula las variables iniciales con las nuevas condiciones
    const newAmplitude = calculateInitAmplitude();
    const newInertia = calculateInertia();
    const newOmega = calculateOmega();
    const newOmegaD = calculateOmegaD();
    const newGamma = calculateGamma();
    const newPeriod = calculatePeriod();
    const newFrequency = calculateFrequency();

    // Actualiza el estado con las nuevas variables calculadas
    setvariables({
      InitAmplitude: newAmplitude,
      inertia: newInertia,
      phi: initConditions.position, // Depende de la posición inicial
      omega: newOmega,
      omegaD: newOmegaD,
      gamma: newGamma,
      period: newPeriod,
      frecuency: newFrequency,
    });

    name == "position" ? setPosition(parseFloat(value) || 0) : 0;
    name == "velocity" ? setVelocity(parseFloat(value) || 0) : 0;
  };

  //LLAMADO A LOS CALCULOS PARA CADA VALOR DE TIEMPO (CUANDO ESTA EN EJECUCION)

  const setAllTimeVars = (time) => {
    setTime(time);
    if (motionType != "simple") {
      setAmplitude(calculateAmplitude(time));
    }
    setPosition(calculatePosition(time));
    setAcceleration(calculateAcceleration(time));
    setVelocity(calculateVelocity(time));
    setEnergy(calculateEnergy(time));
  };

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
    setInitConditions({ position: 0, velocity: 0 });
    setPosition(initConditions.position);
    setTime(0);
    setVelocity(initConditions.velocity);
    setAcceleration(0);
    setAmplitude(variables.InitAmplitude);
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
        />
        <ScenePendulo
          dimensions={dimensions}
          setAllTimeVars={setAllTimeVars}
          position={position}
          isAnimating={isAnimating}
          reset={reset}
        />
      </div>
    </>
  );
};
