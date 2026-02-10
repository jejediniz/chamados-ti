import React from "react";

export default function Select({
  label,
  helperText,
  error,
  children,
  className = "",
  ...props
}) {
  return (
    <label className={`field ${className}`}>
      {label && <span className="field-label">{label}</span>}
      <select className="select-field" {...props}>
        {children}
      </select>
      {helperText && <span className="field-helper">{helperText}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
