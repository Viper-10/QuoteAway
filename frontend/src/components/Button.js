import React from "react";

const Button = () => {
  const onClickEventHandler = (e) => {
    console.log();
  };
  return (
    <div>
      <button onClick={onClickEventHandler}>Sign up</button>
    </div>
  );
};

export default Button;
