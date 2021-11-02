import React from "react";

const Input = ({
  type,
  placeholder,
  value,
  label,
  hasError,
  errorMessage,
  onChange,
}) => {
  let inputClassName = "form-control";

  if (type === "file") {
    inputClassName += "-file";
  }

  if (hasError !== undefined) {
    inputClassName += hasError === true ? " is-invalid" : " is-valid";
  }

  return (
    <div>
      {label && <label> {label} </label>}
      <input
        className={inputClassName}
        type={type || "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      ></input>
      {hasError && <div className="invalid-feedback">{errorMessage}</div>}
    </div>
  );
};

Input.defaultProps = {
  type: "text",
  onChange: () => {},
};

export default Input;
