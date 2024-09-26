import React from "react";
import "../styles/ControlsForm.css";
import { FormInput } from "../FormInput";

export const ControlsForm = ({
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
}) => {
  const dimensionsinputChange = (name, value) => {
    setDimensions((prev) => ({
      ...prev, // Mantiene los otros valores
      [name]: parseFloat(value) || 0, // Convierte a float, usa 0 si es NaN
    }));
  };
  const initConditionsInputChange = (name, value) => {
    onInitConditionChange(name, value);
  };
  const initConditionsInputChangeGrades = (name, value) => {
    onInitConditionChange(name, value*(Math.PI/180));
  };

  return (
    <div className="controls-form-container">
      <div className="controls-form-card">
        <div className="controls-form-header">
          <label className="controls-form-title">Pendulo de torsion</label>
          <button
            onClick={toggleAnimation}
            type="button"
            className={
              isAnimating
                ? "controls-form-btn on-play"
                : "controls-form-btn on-pause"
            }
          >
            {isAnimating ? "Pausar" : "Iniciar"}
          </button>
        </div>

        <div className="controls-form-container-forms-container">
          {/* constantes y dimensiones del sistema */}
          <label className="form-label" htmlFor="set-dimensions">
            dimensiones
          </label>
          <form action="" className="controls-form-inputs-form">
            <FormInput
              label="Constante de amortiguamiento (b)"
              name="b"
              value={dimensions.b}
              onChange={dimensionsinputChange}
              disabled={isAnimating}
              min={0}
            />
            <FormInput
              label="Constante de torsión (k)"
              name="k"
              value={dimensions.k}
              onChange={dimensionsinputChange}
              disabled={isAnimating}
              min={0}
            />
            <FormInput
              label="Longitud de la barra (l)"
              name="l"
              value={dimensions.l}
              onChange={dimensionsinputChange}
              disabled={isAnimating}
              min={0}
            />
            <FormInput
              label="Radio de las esferas (r)"
              name="r"
              value={dimensions.r}
              onChange={dimensionsinputChange}
              disabled={isAnimating}
              min={0}
            />
          </form>
          {/* condiciones iniciales */}
          <label className="controls-form-inputs-label">
            Condiciones iniciales
          </label>
          <form className="controls-form-inputs-form">
            <FormInput
              label="Posicion inicial (Grados)"
              value={initConditions.position *(180/Math.PI)}
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
              label="Velocidad inicial"
              value={initConditions.velocity}
              name="velocity"
              onChange={initConditionsInputChange}
              disabled={isAnimating}
            />
          </form>
          {/* variables del sistema */}
          <label className="controls-form-inputs-label">
            Variables del sistema
          </label>
          <form className="controls-form-inputs-form">
            <FormInput
              label="Tiempo"
              name="time"
              disabled={true}
              value={time}
            />
            <FormInput
              label="Posicion"
              name="position"
              disabled={true}
              value={position}
            />
            <FormInput
              label="Velocidad"
              name="velocity"
              value={velocity}
              disabled={true}
            />
            <FormInput
              label="Amplitud variable"
              name="amplitude"
              value={amplitude}
              disabled={true}
            />
            <FormInput
              label="Energia Mecanica"
              name="energy"
              disabled={true}
              value={energy}
            />
            <FormInput
              label="Amplitud Inicial"
              name="ecr"
              value={variables.InitAmplitude}
              disabled={true}
            />
            <FormInput
              label="Momento de inercia"
              name="inertia"
              value={variables.inertia}
              disabled={true}
            />
            <FormInput
              label="phi"
              name="phi"
              value={variables.phi}
              disabled={true}
            />
            <FormInput
              label="Frecuencia angular (omega)"
              name="omega"
              value={variables.omega}
              disabled={true}
            />
            <FormInput
              label="Frecuencia angular amortiguada (omega d)"
              name="omegaD"
              value={variables.omegaD}
              disabled={true}
            />
            <FormInput
              label="gamma"
              name="gamma"
              value={variables.gamma}
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
            className="controls-form-reset-button"
          >
            REINICIAR
          </button>
          <button type="button" className="controls-form-guide-button">
            MOSTRAR GUIAS
          </button>
        </div>
      </div>
    </div>
  );
};
