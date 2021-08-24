import React, { useState } from "react";

const InputBox = (props) => {
  const [inputValue, changeInputValue] = useState("");

  const changeInputValueFunction = (e) => {
    changeInputValue(() => {
      return e.target.value;
    });
  };
  return (
    <div>
      <input
        type={props.inputType}
        placeholder={props.placeholderText}
        onChange={changeInputValueFunction}
        value={inputValue}
      ></input>
    </div>
  );
};

InputBox.defaultProps = {
  inputType: "text",
};

export default InputBox;
