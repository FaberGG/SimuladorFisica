import React from "react";
import "../styles/ControlsForm.css";
import { FormInput } from "../FormInput";

export const ControlsForm = ({
  dimensions,
  setDimensions,
  variables,
  position,
  velocity,
  initConditions,
  toggleAnimation,
  resetSystem,
  isAnimating,
}) => {
  const dimensionsinputChange = (name, value) => {
    setDimensions((prev) => ({
      ...prev, // Mantiene los otros valores
      [name]: parseFloat(value) || 0, // Convierte a número, usa 0 si es NaN
    }));
  };

  const cambioCoso = (name, value) => {
    setcoso(parseFloat(value));
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
          <label className="form-label" htmlFor="set-dimensions">
            dimensiones
          </label>
          <form action="" className="controls-form-inputs-form">
            <FormInput
              label="Constante de amortiguamiento (b)"
              name="b"
              value={dimensions.b}
              onChange={dimensionsinputChange}
            />
            <FormInput
              label="Constante de torsión (k)"
              name="k"
              value={dimensions.k}
              onChange={dimensionsinputChange}
            />
            <FormInput
              label="Longitud de la barra (l)"
              name="l"
              value={dimensions.l}
              onChange={dimensionsinputChange}
            />
            <FormInput
              label="Radio de las esferas (r)"
              name="r"
              value={dimensions.r}
              onChange={dimensionsinputChange}
            />
          </form>

          <label className="controls-form-inputs-label">
            Condiciones iniciales
          </label>
          <form className="controls-form-inputs-form">
            <FormInput label="Posicion inicial" name="initialAngle" />
            <FormInput label="Velocidad inicial" name="initialVelocity" />
          </form>
          <label className="controls-form-inputs-label">
            Variables del sistema
          </label>
          <form className="controls-form-inputs-form">
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
              label="phi"
              name="phi"
              value={variables.phi}
              disabled={true}
            />
            <FormInput
              label="omega"
              name="omega"
              value={variables.omega}
              disabled={true}
            />
            <FormInput
              label="Momento de inercia"
              name="inertia"
              value={variables.inertia}
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
            <FormInput
              label="Energia potencial de torsion"
              name="ept"
              value={variables.ept}
              disabled={true}
            />
            <FormInput
              label="Energia cinetica rotacional"
              name="ecr"
              value={variables.ecr}
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
          <button type="button" className="controls-form-save-button">
            GUARDAR
          </button>
        </div>
      </div>
    </div>
  );
};
