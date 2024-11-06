import React from "react";
import { useState, useRef } from "react";
import ScenePendulo from "./pendulo_torsion/ScenePendulo";
import ScenePendulosAcoplados from "./pendulos_acoplados/ScenePendulosAcoplados";
import PositionTimeGraph from "./PositionTimeGraph";
import { Canvas } from "@react-three/fiber";

import { ControlsForm } from "./ControlsForm";
import { roundDecimal } from "./pendulo_torsion/motionCalculations/globalCalculations";
export default function PenduloTorsionMain({ isCoupled }) {
  //estado para el tipo de movimiento seleccionado (simple, damped, forcedUndamped, forcedDamped)
  const [motionType, setMotionType] = useState("simple");
  //estado auxiliar para el tipo de amortiguamiento si aplica
  const [dampedType, setDampedType] = useState("NONE");
  //estado para saber el modo de vibracion en caso de ser acoplado
  const [vibrationMode, setVibrationMode] = useState(0);

  //estado para actualizar el string de ecuacion a mostrar
  const [strEcuation, setStrEcuation] = useState([
    "θ(t) = C cos(ω₀ t + ϕ) + C cos(ω₀ t + ϕ)",
    "θ(t) = C cos(ω₀ t + ϕ)",
  ]);

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
    b2: 0.1,
    k2: 5,
    l2: 1,
    r2: 0.2,
    massSpheres2: 1,
    massBar2: 3,
  });

  //condiciones iniciales
  const [initConditions, setInitConditions] = useState({
    position: -0.22,
    velocity: 0,
    position2: -0.22,
    velocity2: 0,
  });

  //variables que solo se calculan una vez al establecer condiciones iniciales
  const [variables, setVariables] = useState({
    InitAmplitude: 0, //A1 A2
    inertia: 0,
    phi: 0,
    omega: 0,
    omegaD: 0,
    gamma: 0,
    period: 0,
    frecuency: 0,
    delta: 0,

    InitAmplitude2: 0, //B1 B2
    inertia2: 0,
    phi2: 0,
    omega2: 0,
    omegaD2: 0,
    gamma2: 0,
    period2: 0,
    frecuency2: 0,
    delta2: 0,
  });

  const [time, setTime] = useState(0);
  const [timeVariables, setTimeVariables] = useState({
    position: initConditions.position,
    velocity: initConditions.velocity,
    amplitude: variables.InitAmplitude,
    position2: initConditions.position2,
    velocity2: initConditions.velocity2,
    amplitude2: variables.InitAmplitude2,
    energy: 0,
  });

  //ESTADOS DEL PROGRAMA
  //es falso cuando el programa esta pausado, true cuando se estan ejecutando los calculos de posicion
  const [isAnimating, setIsAnimating] = useState(false);
  //se actualiza al querer reiniciar el programa de cero
  const [reset, setReset] = useState(false);
  //se actualiza para mostrar guias (el transportador)
  const [showGuides, setShowGuides] = useState(true);

  //estados para la graficas
  const [positionData, setPositionData] = useState([]);
  const [position2Data, setPosition2Data] = useState([]);

  //FUNCION PARA LLAMAR A LOS CALCULOS EN LA ESCENA
  const pendulumRef = useRef();
  const handleCallSetNoTimeVars = () => {
    if (pendulumRef.current) {
      // Actualiza el estado con las nuevas variables calculadas
      setVariables(pendulumRef.current.setAllNoTimeVars());
    }
  };

  //FUNCION LLAMADA DESDE LA ESCENA PARA LLENAR EL ARREGLO DE DATOS PARA LA GRAFICA
  const updateDataGraph = () => {
    const t = roundDecimal(time, 2);
    let position = roundDecimal(timeVariables.position, 2);

    setPositionData([...positionData, { t, position }]);
    if (isCoupled) {
      position = roundDecimal(timeVariables.position2, 2);
      setPosition2Data([...position2Data, { t, position }]);
    }
  };
  //se llama cuando se cambian las condiciones iniciales en el formulario
  const updateInitConditions = (name, value) => {
    setInitConditions((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0, // Convierte a float y usa 0 si es NaN
    }));

    setTimeVariables({
      position: name == "position" ? parseFloat(value) || 0 : 0,
      velocity: name == "velocity" ? parseFloat(value) || 0 : 0,
      amplitude: variables.InitAmplitude,
      position2: name == "position2" ? parseFloat(value) || 0 : 0,
      velocity2: name == "velocity2" ? parseFloat(value) || 0 : 0,
      amplitude2: variables.InitAmplitude2,
      energy: 0,
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
      handleCallSetNoTimeVars();
      setIsAnimating((prev) => !prev); // Alternar entre verdadero y falso
    }
  };

  //REINICIAR EL PROGRAMA
  const resetSystem = () => {
    setIsAnimating(false);
    setReset(true);
    setTimeout(() => setReset(false), 100);

    setVariables({
      InitAmplitude: 0,
      inertia: 0,
      phi: 0,
      omega: 0,
      omegaD: 0,
      omegaF: 0,
      gamma: 0,
      period: 0,
      frecuency: 0,
      InitAmplitude2: 0,
      inertia2: 0,
      phi2: 0,
      omega2: 0,
      omegaD2: 0,
      omegaF2: 0,
      gamma2: 0,
      period2: 0,
      frecuency2: 0,
    });
    setTime(0);
    setTimeVariables({
      position: initConditions.position,
      velocity: initConditions.velocity,
      amplitude: variables.InitAmplitude,
      position2: initConditions.position2,
      velocity2: initConditions.velocity2,
      amplitude2: variables.InitAmplitude2,
      energy: 0,
    });
    setPositionData([]);
    setPosition2Data([]);
  };

  return (
    <>
      <div className="form-scene-container">
        <ControlsForm
          strEcuation={strEcuation}
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
          timeVariables={timeVariables}
          setShowGuides={setShowGuides}
          showGuides={showGuides}
          isCoupled={isCoupled}
        />

        <Canvas style={{ display: "flex", height: "100vh" }}>
          {!isCoupled ? (
            <ScenePendulo
              dimensions={dimensions}
              variables={variables}
              initConditions={initConditions}
              motionType={motionType}
              dampedType={dampedType}
              setDampedType={setDampedType}
              setTimeVariables={setTimeVariables}
              setTime={setTime}
              position={timeVariables.position}
              updateDataGraph={updateDataGraph}
              isAnimating={isAnimating}
              reset={reset}
              showGuides={showGuides}
              ref={pendulumRef}
            />
          ) : (
            <ScenePendulosAcoplados
              dimensions={dimensions}
              variables={variables}
              initConditions={initConditions}
              setTimeVariables={setTimeVariables}
              setTime={setTime}
              setVibrationMode={setVibrationMode}
              setStrEcuation={setStrEcuation}
              position={{
                position: timeVariables.position,
                position2: timeVariables.position2,
              }}
              updateDataGraph={updateDataGraph}
              isAnimating={isAnimating}
              reset={reset}
              showGuides={showGuides}
              ref={pendulumRef}
            />
          )}
        </Canvas>

        {/* GRAFICAS */}
        <div className="graph-container">
          <PositionTimeGraph
            positionData={positionData}
            title={"Péndulo 1: Posición vs Tiempo"}
          />
          {isCoupled && (
            <PositionTimeGraph
              positionData={position2Data}
              title={"Péndulo 2: Posición vs Tiempo"}
            />
          )}
        </div>
      </div>
    </>
  );
}
