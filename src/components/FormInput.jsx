import React from "react";
import "./styles/forminput.css";

export const FormInput = ({
  label,
  name,
  disabled,
  value,
  onChange,
  min,
  onlyLabel,
}) => {
  function roundDecimal(numero, decimales) {
    const factor = 10 ** decimales;
    return Math.round(numero * factor) / factor;
  }
  // Función para redondear todos los valores numéricos en un objeto
  function redondearValoresObj(obj, decimales) {
    const resultado = {};

    for (let key in obj) {
      if (typeof obj[key] === "number") {
        resultado[key] = roundDecimal(obj[key], decimales);
      } else {
        resultado[key] = obj[key]; // Mantener otros valores sin cambios
      }
    }

    return resultado;
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
      {!onlyLabel ? (
        <>
          {typeof value == "object" ? (
            <input
              value={JSON.stringify(redondearValoresObj(value, 4))}
              placeholder={value == NaN ? "No Calculado aun" : ""}
              type="text"
              id={name}
              name={name}
              className="form-input-input"
              disabled={disabled}
              min={min}
              onWheel={handleWheel}
            />
          ) : (
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
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};
