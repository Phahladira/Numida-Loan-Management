import React, { useState, ChangeEvent } from "react";

import "../styles/AddPaymentForm.css";
import { FormFieldProps } from "../util/types";

const FormField: React.FC<FormFieldProps> = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  validate,
  error: externalError,
  disabled = false,
}) => {
  const [internalError, setInternalError] = useState<string | undefined>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(name, newValue);

    if (validate) {
      setInternalError(validate(newValue));
    }
  };

  const error = externalError || internalError;

  return (
    <>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="form-input"
      />
      {error && (
        <div className="error-message-container">
          <span className="error-message">{error}</span>
        </div>
      )}
    </>
  );
};

export default FormField;
