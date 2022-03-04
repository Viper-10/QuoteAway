import React from "react";

const MyInput = ({
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
    <div className="my-input-group">
      {label && <label className="pb-1"> {label} </label>}
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

MyInput.defaultProps = {
  type: "text",
  onChange: () => {},
};

export default MyInput;
