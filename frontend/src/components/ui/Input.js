import React from "react";

export default function Input({
  label,
  helperText,
  error,
  className = "",
  hideLabel = false,
  ...props
}) {
  return (
    <label className={`field ${className}`}>
      {label && (
        <span className={`field-label${hideLabel ? " sr-only" : ""}`}>{label}</span>
      )}
      <input className="input-field" {...props} />
      {helperText && <span className="field-helper">{helperText}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
