import React from "react";
import "./styles/forminput.css";

export const FormInput = ({ label, name, disabled, value, onChange, min }) => {
  function roundDecimal(numero, decimales) {
    const factor = 10 ** decimales;
    return Math.round(numero * factor) / factor;
  }
  // Función para desactivar el scroll sobre el input
  const handleWheel = (e) => {
    e.target.blur(); // Desenfoca el input cuando se usa la rueda del mouse
  };

  return (
    <div className="form-input-wrapper">
      <label htmlFor={name} className="form-input-label">
        {label}
      </label>
      <input
        value={value == 0 ? "" : roundDecimal(value, 4)}
        placeholder={value == 0 ? "0" : ""}
        onChange={(e) => onChange(name, e.target.value)}
        type="number"
        id={name}
        name={name}
        className="form-input-input"
        disabled={disabled}
        min={min}
        onWheel={handleWheel}
      />
    </div>
  );
};
