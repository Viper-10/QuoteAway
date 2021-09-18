import { Route, Switch } from "react-router";
import React from "react";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import UserSignUpPage from "../pages/UserSignUpPage";
import UserPage from "../pages/UserPage";
import * as apiCalls from "../ApiRequests/apiCalls";

const actions = {
  postSignUp: apiCalls.signup,
  postLogin: apiCalls.login,
};

/* 
  History is a part of the props provided by router
  It has a function called push, accessed by 
  this.props.history.push("url") in the PageComponent

  It'll redirect to that url which has been pushed. 
*/

function App() {
  return (
    <div className="container">
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          path="/login"
          component={(props) => <LoginPage {...props} actions={actions} />}
        />
        <Route
          path="/signup"
          component={(props) => <UserSignUpPage {...props} actions={actions} />}
        />
        <Route path="/:username" component={UserPage} />
      </Switch>
    </div>
  );
}
export default App;
