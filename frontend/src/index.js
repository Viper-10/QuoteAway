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
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import authReducer from "./Redux/authReducer";
import logger from "redux-logger";

const actions = {
  postSignUp: apiCalls.signup,
  postLogin: apiCalls.login,
};

/*
In redux application we have one store and it is responsible for holding the 
  application state. 

  Provider enables the lower components in the hierarchy to connect with the 
  store

  when an action is dispatched to redux store, reducer is called. Reducer changes the state of the store according 
  to the action
*/
const loggedInState = {
  id: 1,
  userName: "user1",
  displayName: "display1",
  image: "profile1.png",
  isLoggedIn: true,
  password: "P4ssword$",
};

// logger logs can be seen in the console in browser

const store = createStore(authReducer, loggedInState, applyMiddleware(logger));

ReactDOM.render(
  // <React.StrictMode>
  // {/* <UserSignUpPage actions={actions} /> */}
  // {/* <LoginPage /> */}
  // * </React.StrictMode>, }
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
