import React from "react";
import "./styles/forminput.css";

export const FormInput = ({ label, name, disabled, value, onChange, min }) => {
  function roundDecimal(numero, decimales) {
    const factor = 10 ** decimales;
    return Math.round(numero * factor) / factor;
}
  return (
    <div>
      <div className="form-input-label">
        <label htmlFor={name}>{label}</label>
      </div>
      <div className="form-input-container">
        <input
          value={value.toFixed(2) == 0 ? "" : roundDecimal(value,4)}
          onChange={(e) => onChange(name, e.target.value)}
          type="number"
          id={name}
          name={name}
          className="form-input-input"
          disabled={disabled}
          min={min}
        />
      </div>
    </div>
  );
};
