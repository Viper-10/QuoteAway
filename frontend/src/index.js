import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { UserSignUpPage } from "./pages/UserSignUpPage";
import * as apiCalls from "./ApiRequests/apiCalls";
import LoginPage from "./pages/LoginPage";
import { HashRouter } from "react-router-dom";
import App from "./containers/App";
import { StrictMode } from "react/cjs/react.production.min";

const actions = {
  postSignUp: apiCalls.signup,
  postLogin: apiCalls.login,
};

ReactDOM.render(
  // <React.StrictMode>
  // {/* <UserSignUpPage actions={actions} /> */}
  // {/* <LoginPage /> */}
  // * </React.StrictMode>, }
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
