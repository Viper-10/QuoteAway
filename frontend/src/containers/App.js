import { Route, Switch } from "react-router-dom";
import React from "react";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import UserSignUpPage from "../pages/UserSignUpPage";
import UserPage from "../pages/UserPage";
import TopBar from "../components/TopBar";

/* 
  History is a part of the props provided by router
  It has a function called push, accessed by 
  this.props.history.push("url") in the PageComponent

  It'll redirect to that url which has been pushed. 
*/

function App() {
  return (
    <div>
      <TopBar />
      <div className="container">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={UserSignUpPage} />
          <Route path="/:username" component={UserPage} />
        </Switch>
      </div>
    </div>
  );
}
export default App;
