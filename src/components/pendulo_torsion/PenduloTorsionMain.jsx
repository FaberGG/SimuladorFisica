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
    b: 0.1,
    k: 5,
    l: 1,
    r: 0.2,
    Fo: 1,
    omegaF: 1,
    massSpheres: 1,
    massBar: 3,
  });

  //condiciones iniciales
  const [initConditions, setInitConditions] = useState({
    position: 0.22,
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
  const [showGuides, setShowGuides] = useState(false);

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
            variables.phi
          )
        );
        // setVelocity(
        //   motionCalculations.calculateVelocity(
        //     time,
        //     variables.InitAmplitude,
        //     variables.phi,
        //     variables.omega
        //   )
        // );
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
      case "forcedUndamped": //caso forzado no amortiguado
        setPosition(
          motionCalculations.calculatePosition(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega,
            dimensions.omegaF,
            dimensions.Fo,
            variables.inertia
          )
        );
        setVelocity(
          motionCalculations.calculateVelocity(
            time,
            variables.InitAmplitude,
            variables.phi,
            variables.omega,
            dimensions.omegaF,
            dimensions.Fo,
            variables.inertia
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
        setAmplitude(
          motionCalculations.calculateAmplitude(
            time,
            variables.InitAmplitude,
            variables.gamma
          )
        );
        break;
      case "forcedDamped": //caso forzado no amortiguado
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

    let omegaTemp = 0; // toma el valor de w, wd u wf segun el tipo de movimiento
    let newGamma = 1;
    let newOmegaD = newOmega;

    switch (motionType) {
      case "simple": //caso simple omegaTemp es la misma frecuancia natural
        omegaTemp = newOmega;
        break;
      case "damped": //caso amortiguado omegaTemp es omegaD
        newGamma = motionCalculations.calculateGamma(
          dimensions.b,
          variables.inertia
        );
        newOmegaD = motionCalculations.calculateOmegaD(newOmega, newGamma);

        omegaTemp = newOmegaD;
        break;
      case "forcedUndamped": //caso forzado no amortiguado
        omegaTemp = dimensions.omegaF;
        break;
      case "forcedDamped": //caso forzado no amortiguado
        break;
      default: // Tipo de mov no implementado
        alert(
          "ERROR: Tipo de movimiento " +
            motionType +
            " no implementado. asegurese de seleccionar uno"
        );
        break;
    }

    const newPhi = motionCalculations.calculatePhi(
      initConditions.position,
      initConditions.velocity,
      omegaTemp
    );
    //calcula la amplitud inicial segun el tipo de mov
    let newAmplitude = motionCalculations.calculateInitAmplitude(
      newPhi,
      initConditions.position,
      initConditions.velocity,
      omegaTemp
    );
    //calcula el periodo segun el tipo de mov
    const newPeriod = motionCalculations.calculatePeriod(omegaTemp);
    //calcula la frecuencia a partir del periodo
    const newFrequency = motionCalculations.calculateFrequency(newPeriod);
    //calcula el valor de phi segun el tipo de movimiento

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
    setAmplitude(0);
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
          setShowGuides={setShowGuides}
          showGuides={showGuides}
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
