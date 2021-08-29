import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserSignUpPage } from "./pages/UserSignUpPage";
import * as apiCalls from "./ApiRequests/apiCalls";

const actions = {
  postSignUp: apiCalls.signup,
};

ReactDOM.render(
  <React.StrictMode>
    <UserSignUpPage actions={actions} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
