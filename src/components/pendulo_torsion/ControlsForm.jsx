import React from "react";
import "../styles/ControlsForm.css";
import { FormInput } from "../FormInput";
import { EcuationLabel } from "../EcuationLabel";

export const ControlsForm = ({
  motionType,
  setMotionType,
  dampedType,
  dimensions,
  setDimensions,
  isAnimating,
  toggleAnimation,
  resetSystem,
  initConditions,
  onInitConditionChange,
  variables,
  time,
  position,
  velocity,
  amplitude,
  energy,
  setShowGuides,
  showGuides,
}) => {
  const dimensionsinputChange = (name, value) => {
    setDimensions((prev) => ({
      ...prev, // Mantiene los otros valores

      [name]: Math.abs(parseFloat(value)) || 0, // Convierte a float, usa 0 si es NaN
    }));
  };
  //se actualizan los valores de condiciones iniciales desde la entrada
  const initConditionsInputChange = (name, value) => {
    onInitConditionChange(name, value);
  };
  //cambios en las condiciones iniciales en grados
  const initConditionsInputChangeGrades = (name, value) => {
    //se reciben en grados y se pasa a radianes
    onInitConditionChange(name, value * (Math.PI / 180));
  };
  //cambio para seleccionar el tipo de movimiento
  const handleMotionTypeChange = (event) => {
    setMotionType(event.target.value);
  };
  //MOSSTRAR U OCULTAR GUIAS (TRANSPORTADOR)
  const toggleGuides = () => {
    setShowGuides((prev) => !prev);
  };

  const findEcuationMotion = () => {
    switch (motionType) {
      case "simple":
        return "θ(t) = C cos(ω₀ t + ϕ)";
        break;
      case "damped":
        break;
      case "forcedUndamped":
        break;
      case "forcedDamped":
        break;
      default:
        break;
    }
  };

  //FUNCIONES PARA MOSTRAR LOS FORMULARIOS PARA CADA TIPO DE MOVIMIENTO

  //ENTRADAS:
  const dimensionsForcedMot = () => {
    return (
      <>
        <FormInput
          label="Amplitud Fuerza Externa (to)"
          name="Fo"
          value={dimensions.Fo}
          onChange={dimensionsinputChange}
          disabled={isAnimating}
          min={0}
        />
        <FormInput
          label="Frecuencia Fuerza Externa (wf)"
          name="omegaF"
          value={dimensions.omegaF}
          onChange={dimensionsinputChange}
          disabled={isAnimating}
          min={0}
        />
      </>
    );
  };
  const dimensionsDampedMot = () => {
    let dampedTypeEsp = "No Calculado";
    switch (dampedType) {
      case "criticallyDamped":
        dampedTypeEsp = "Criticamente Amortiguado";
        break;
      case "subDamped":
        dampedTypeEsp = "Sub-Amortiguado";
        break;
      case "overDamped":
        dampedTypeEsp = "Sobre-Amortiguado";
        break;
      default:
        break;
    }
    return (
      <>
        <FormInput
          label={"Tipo de amortiguamiento : " + dampedTypeEsp}
          value={0}
          name="dampedType"
          disabled={true}
          onlyLabel={true}
        />
        <FormInput
          label="Constante de amortiguamiento (b)"
          name="b"
          value={dimensions.b}
          onChange={dimensionsinputChange}
          disabled={isAnimating}
          min={0}
        />
      </>
    );
  };

  return (
    <div className="controls-form-container">
      <div className="controls-form-card">
        <div className="controls-form-header">
          <label className="controls-form-title">{"Péndulo de torsión"}</label>

          {/* BOTON PARA EJECUTAR LOS CALCULOS */}
          <button
            onClick={toggleAnimation}
            type="button"
            className={
              isAnimating
                ? "controls-form-btn btn-on-play"
                : "controls-form-btn btn-on-pause"
            }
          >
            {isAnimating ? "Pausar" : "Iniciar"}
          </button>
        </div>

        <div className="controls-form-container-forms-container">
          {/* Tipo de movimiento */}
          <label className="form-label">Tipo de movimiento</label>
          <select
            value={motionType}
            onChange={handleMotionTypeChange}
            disabled={isAnimating}
            className="controls-form-select"
          >
            <option className="controls-form-option" value="simple">
              Movimiento armonico simple
            </option>
            <option className="controls-form-option" value="damped">
              Movimiento amortiguado
            </option>
            <option className="controls-form-option" value="forcedUndamped">
              Movimiento forzado no amortiguado
            </option>
            <option className="controls-form-option" value="forcedDamped">
              Movimiento forzado amortiguado
            </option>
          </select>
          {/* constantes y dimensiones del sistema */}
          <label className="form-label" htmlFor="set-dimensions">
            dimensiones
          </label>
          <form action="" className="controls-form-inputs-form">
            <FormInput
              label="Longitud de la barra (m)"
              name="l"
              value={dimensions.l}
              onChange={dimensionsinputChange}
              disabled={isAnimating}
              min={0}
            />
            <FormInput
              label="Radio de las esferas (m)"
              name="r"
              value={dimensions.r}
              onChange={dimensionsinputChange}
              disabled={isAnimating}
              min={0}
            />
            <FormInput
              label="Masa de las esferas [Kg]"
              name="massSpheres"
              value={dimensions.massSpheres}
              disabled={true}
            />
            <FormInput
              label="Masa de la barra [Kg]"
              name="massBar"
              value={dimensions.massBar}
              disabled={true}
            />
          </form>
          <label className="form-label" htmlFor="set-dimensions">
            Constantes
          </label>
          <form action="" className="controls-form-inputs-form">
            <FormInput
              label="Constante de torsión (k)"
              name="k"
              value={dimensions.k}
              onChange={dimensionsinputChange}
              disabled={isAnimating}
              min={0}
            />
            {(() => {
              switch (motionType) {
                case "forcedDamped":
                  return (
                    <>
                      {dimensionsDampedMot()}
                      {dimensionsForcedMot()}
                    </>
                  );
                case "damped":
                  return dimensionsDampedMot();
                case "forcedUndamped":
                  return dimensionsForcedMot();
                default:
                  return null; //no renderiza nada
              }
            })()}
          </form>
          {/* condiciones iniciales */}
          <label className="controls-form-inputs-label">
            Condiciones iniciales
          </label>
          <form className="controls-form-inputs-form">
            <FormInput
              label="Posicion inicial (Grados)"
              value={initConditions.position * (180 / Math.PI)}
              name="position"
              onChange={initConditionsInputChangeGrades}
              disabled={isAnimating}
            />
            <FormInput
              label="Posicion inicial (Rad)"
              value={initConditions.position}
              name="position"
              onChange={initConditionsInputChange}
              disabled={isAnimating}
            />
            <FormInput
              label="Velocidad inicial (Grados)"
              value={initConditions.velocity * (180 / Math.PI)}
              name="velocity"
              onChange={initConditionsInputChangeGrades}
              disabled={isAnimating}
            />
            <FormInput
              label="Velocidad inicial (Rad)"
              value={initConditions.velocity}
              name="velocity"
              onChange={initConditionsInputChange}
              disabled={isAnimating}
            />
          </form>
          <label className="controls-form-inputs-label">
            Ecuacion de movimiento
          </label>
          <EcuationLabel ecuation={findEcuationMotion()} />

          {/* variables del sistema */}
          <label className="controls-form-inputs-label">
            Variables del sistema
          </label>
          <form className="controls-form-inputs-form">
            <FormInput
              label="Tiempo (s)"
              name="time"
              disabled={true}
              value={time}
            />
            <FormInput
              label="Posicion (Rad)"
              name="position"
              disabled={true}
              value={position}
            />
            <FormInput
              label="Velocidad (Rad/s)"
              name="velocity"
              value={velocity}
              disabled={true}
            />

            <FormInput
              label={
                motionType == "forcedUndamped" || motionType == "forcedDamped"
                  ? "Potencia"
                  : "Energia (j)"
              }
              name="energy"
              disabled={true}
              value={energy}
            />

            <FormInput
              label="Amplitud Inicial"
              name="initAmplitude"
              value={variables.InitAmplitude}
              disabled={true}
            />
            <FormInput
              label="Amplitud"
              name="amplitude"
              value={amplitude}
              disabled={true}
            />
            {(() => {
              if (motionType == "forcedDamped" || motionType == "damped")
                return (
                  <>
                    <FormInput
                      label="gamma"
                      name="gamma"
                      value={variables.gamma}
                      disabled={true}
                    />
                    <FormInput
                      label="Frecuencia angular amortiguada (omega d)"
                      name="omegaD"
                      value={variables.omegaD}
                      disabled={true}
                    />

                    <FormInput
                      label="Delta"
                      name="delta"
                      value={variables.delta}
                      disabled={true}
                    />
                  </>
                );
            })()}
            <FormInput
              label="Momento de inercia (I)"
              name="inertia"
              value={variables.inertia}
              disabled={true}
            />
            <FormInput
              label="Frecuencia natural (omega)"
              name="omega"
              value={variables.omega}
              disabled={true}
            />
            <FormInput
              label="phi"
              name="phi"
              value={variables.phi}
              disabled={true}
            />
            <FormInput
              label="Periodo"
              name="period"
              value={variables.period}
              disabled={true}
            />
            <FormInput
              label="Frecuencia"
              name="frecuency"
              value={variables.frecuency}
              disabled={true}
            />
          </form>
        </div>
        <div className="controls-form-header">
          <button
            onClick={resetSystem}
            type="button"
            className="controls-form-reset-button controls-form-btn"
          >
            REINICIAR
          </button>
          <button
            type="button"
            className="controls-form-guide-button controls-form-btn"
            onClick={toggleGuides}
          >
            {showGuides ? "Ocultar Guias" : "Mostrar Guias"}
          </button>
        </div>
      </div>
    </div>
  );
};
