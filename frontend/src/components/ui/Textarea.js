import React from "react";

export default function Textarea({
  label,
  helperText,
  error,
  className = "",
  ...props
}) {
  return (
    <label className={`field ${className}`}>
      {label && <span className="field-label">{label}</span>}
      <textarea className="textarea-field" {...props} />
      {helperText && <span className="field-helper">{helperText}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
