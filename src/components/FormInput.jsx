import React from "react";

export const FormInput = ({ label, name, disabled, value, onChange, min }) => {
  return (
    <div>
      <div className="form-input-label">
        <label htmlFor={name}>{label}</label>
      </div>
      <div className="form-input-container">
        <input
          value={value}
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
