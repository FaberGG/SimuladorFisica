import React from "react";

export const EcuationLabel = ({ ecuation }) => {
  return (
    <div className="form-input-wrapper">
      <input
        className="ecuation-label"
        type="text"
        name="ecuation"
        value={ecuation}
        disabled={true}
      />
    </div>
  );
};
