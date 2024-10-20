import React from "react";
import "./styles/ControlsForm.css";
import { FormInput } from "./FormInput";
import { EcuationLabel } from "./EcuationLabel";

export const ControlsForm = ({
  strEcuation,
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
  timeVariables,
  setShowGuides,
  showGuides,
  isCoupled,
}) => {
  // Handler para actualizar dimensiones y convertir valores a float
  const handleDimensionChange = (name, value) => {
    setDimensions((prev) => ({
      ...prev,
      [name]: Math.abs(parseFloat(value)) || 0,
    }));
  };

  // Handler para actualizar condiciones iniciales
  const handleInitConditionChange = (
    name,
    value,
    inDegrees = false,
    pendulum = 1
  ) => {
    const updatedValue = inDegrees ? value * (Math.PI / 180) : value;
    onInitConditionChange(name, updatedValue, pendulum); // NUEVO: incluye el péndulo
  };

  // Traducción del tipo de amortiguamiento
  const getDampedTypeLabel = () => {
    switch (dampedType) {
      case "criticallyDamped":
        return "Críticamente Amortiguado";
      case "subDamped":
        return "Sub-Amortiguado";
      case "overDamped":
        return "Sobre-Amortiguado";
      default:
        return "No Calculado";
    }
  };

  // Renderiza campos de entrada para movimiento forzado
  const renderForcedMotionInputs = () => (
    <>
      <FormInput
        label="Amplitud Fuerza Externa (Fo)"
        name="Fo"
        value={dimensions.Fo}
        onChange={handleDimensionChange}
        disabled={isAnimating}
        min={0}
      />
      <FormInput
        label="Frecuencia Fuerza Externa (ωf)"
        name="omegaF"
        value={dimensions.omegaF}
        onChange={handleDimensionChange}
        disabled={isAnimating}
        min={0}
      />
    </>
  );

  // Renderiza campos de entrada para movimiento amortiguado
  const renderDampedMotionInputs = () => (
    <>
      <FormInput
        label={`Tipo de amortiguamiento: ${getDampedTypeLabel()}`}
        value={0}
        name="dampedType"
        disabled={true}
        onlyLabel={true}
      />
      <FormInput
        label="Constante de Amortiguamiento (b)"
        name="b"
        value={dimensions.b}
        onChange={handleDimensionChange}
        disabled={isAnimating}
        min={0}
      />
    </>
  );

  // Renderiza las entradas adicionales basadas en el tipo de movimiento
  const renderAdditionalInputs = () => {
    switch (motionType) {
      case "forcedDamped":
        return (
          <>
            {renderDampedMotionInputs()}
            {renderForcedMotionInputs()}
          </>
        );
      case "damped":
        return renderDampedMotionInputs();
      case "forcedUndamped":
        return renderForcedMotionInputs();
      default:
        return null;
    }
  };

  // NUEVO: Renderiza campos para el segundo péndulo y la constante de acoplamiento
  const renderCoupledPendulumInputs = () => (
    <>
      <h3>Péndulo 2</h3>
      <FormInput
        label="Longitud de la barra 2 (m)"
        name="l2"
        value={dimensions.l2}
        onChange={handleDimensionChange}
        disabled={isAnimating}
        min={0}
      />
      <FormInput
        label="Radio de las esferas 2 (m)"
        name="r2"
        value={dimensions.r2}
        onChange={handleDimensionChange}
        disabled={isAnimating}
        min={0}
      />
      <FormInput
        label="Masa de las esferas 2 (Kg)"
        value={dimensions.massSpheres2}
        disabled={true}
      />
      <FormInput
        label="Masa de la barra 2 (Kg)"
        value={dimensions.massBar2}
        disabled={true}
      />
      <FormInput
        label="Constante de torsión 2 (k2)"
        name="k2"
        value={dimensions.k2}
        onChange={handleDimensionChange}
        disabled={isAnimating}
        min={0}
      />
    </>
  );

  return (
    <div className="controls-form-container">
      <div className="controls-form-card">
        {/* HEADER */}
        <div className="controls-form-header">
          <label className="controls-form-title">
            {isCoupled ? "Péndulo de torsión acoplado" : "Péndulo de torsión"}
          </label>
          <button
            onClick={toggleAnimation}
            type="button"
            className={`controls-form-btn ${
              isAnimating ? "btn-on-play" : "btn-on-pause"
            }`}
          >
            {isAnimating ? "Pausar" : "Iniciar"}
          </button>
        </div>

        <div className="controls-form-container-forms-container">
          {/* Tipo de movimiento */}
          <label className="form-label">Tipo de movimiento</label>
          <select
            value={motionType}
            onChange={(e) => setMotionType(e.target.value)}
            disabled={isAnimating}
            className="controls-form-select"
          >
            <option value="simple">Movimiento armónico simple</option>
            <option value="damped">Movimiento amortiguado</option>
            <option value="forcedUndamped">
              Movimiento forzado no amortiguado
            </option>
            <option value="forcedDamped">Movimiento forzado amortiguado</option>
          </select>

          {/* Dimensiones y constantes */}
          <label className="form-label">Dimensiones</label>
          <form className="controls-form-inputs-form">
            <FormInput
              label="Longitud de la barra (m)"
              name="l"
              value={dimensions.l}
              onChange={handleDimensionChange}
              disabled={isAnimating}
              min={0}
            />
            <FormInput
              label="Radio de las esferas (m)"
              name="r"
              value={dimensions.r}
              onChange={handleDimensionChange}
              disabled={isAnimating}
              min={0}
            />
            <FormInput
              label="Masa de las esferas (Kg)"
              value={dimensions.massSpheres}
              disabled={true}
            />
            <FormInput
              label="Masa de la barra (Kg)"
              value={dimensions.massBar}
              disabled={true}
            />
            <FormInput
              label="Constante de torsión (k)"
              name="k"
              value={dimensions.k}
              onChange={handleDimensionChange}
              disabled={isAnimating}
              min={0}
            />
            {renderAdditionalInputs()}

            {/* Entradas para el sistema acoplado */}
            {isCoupled && renderCoupledPendulumInputs()}
          </form>

          {/* Condiciones iniciales */}
          <label className="form-label">Condiciones iniciales</label>
          <form className="controls-form-inputs-form">
            <FormInput
              label="Posición inicial (Grados)"
              value={initConditions.position * (180 / Math.PI)}
              name="position"
              onChange={(name, value) =>
                handleInitConditionChange(name, value, true)
              }
              disabled={isAnimating}
            />
            <FormInput
              label="Posición inicial (Rad)"
              value={initConditions.position}
              name="position"
              onChange={handleInitConditionChange}
              disabled={isAnimating}
            />
            <FormInput
              label="Velocidad inicial (Grados)"
              value={initConditions.velocity * (180 / Math.PI)}
              name="velocity"
              onChange={(name, value) =>
                handleInitConditionChange(name, value, true)
              }
              disabled={isAnimating}
            />
            <FormInput
              label="Velocidad inicial (Rad)"
              value={initConditions.velocity}
              name="velocity"
              onChange={handleInitConditionChange}
              disabled={isAnimating}
            />

            {/* Condiciones iniciales del segundo péndulo */}
            {isCoupled && (
              <>
                <FormInput
                  label="Posición inicial péndulo 2 (Grados)"
                  value={initConditions.position2 * (180 / Math.PI)}
                  name="position2"
                  onChange={(name, value) =>
                    handleInitConditionChange(name, value, true, 2)
                  }
                  disabled={isAnimating}
                />
                <FormInput
                  label="Velocidad inicial péndulo 2 (Rad)"
                  value={initConditions.velocity2}
                  name="velocity2"
                  onChange={(name, value) =>
                    handleInitConditionChange(name, value, false, 2)
                  }
                  disabled={isAnimating}
                />
              </>
            )}
          </form>

          {/* Ecuación de movimiento */}
          <label className="form-label">Ecuación de movimiento</label>
          <EcuationLabel ecuation={strEcuation[0]} />

          {/* Variables del sistema */}
          <label className="form-label">Variables del sistema</label>
          <form className="controls-form-inputs-form">
            <FormInput label="Tiempo (s)" value={time} disabled={true} />
            <FormInput
              label="Posición (Rad)"
              value={timeVariables.position}
              disabled={true}
            />
            <FormInput
              label="Velocidad (Rad/s)"
              value={timeVariables.velocity}
              disabled={true}
            />
            <FormInput
              label={
                motionType === "forcedUndamped" || motionType === "forcedDamped"
                  ? "Potencia"
                  : "Energía (J)"
              }
              value={timeVariables.energy}
              disabled={true}
            />
            <FormInput
              label="Amplitud"
              value={timeVariables.amplitude}
              disabled={true}
            />
            <FormInput
              label="Momento de inercia (I)"
              value={variables.inertia}
              disabled={true}
            />
            <FormInput
              label="Periodo"
              value={variables.period}
              disabled={true}
            />
            <FormInput
              label="Frecuencia"
              value={variables.frecuency}
              disabled={true}
            />

            {/* en caso de tener pendulos acoplados */}
            {isCoupled && (
              <>
                <FormInput
                  label="Posición (Rad) Péndulo 2"
                  value={timeVariables.position2}
                  disabled={true}
                />
                <FormInput
                  label="Velocidad (Rad/s) Péndulo 2"
                  value={timeVariables.velocity2}
                  disabled={true}
                />
                <FormInput
                  label="Amplitud"
                  value={timeVariables.mplitude2}
                  disabled={true}
                />
                <FormInput
                  label="Momento de inercia (I) Péndulo 2"
                  value={variables.inertia2}
                  disabled={true}
                />
                <FormInput
                  label="Periodo Péndulo 2"
                  value={variables.period2}
                  disabled={true}
                />
              </>
            )}
          </form>
        </div>

        {/* Botones para reiniciar y guías */}
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
            onClick={() => setShowGuides((prev) => !prev)}
          >
            {showGuides ? "Ocultar Guías" : "Mostrar Guías"}
          </button>
        </div>
      </div>
    </div>
  );
};
