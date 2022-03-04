import React from "react";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Input from "../components/Input";
import { connect } from "react-redux";
import * as authActions from "../Redux/authActions";
import "../App.css";
import "../Css/Utilities.css";
import MyInput from "../components/MyInput";
import { Link } from "react-router-dom";
import loginIcon from "../assets/login-icon.png";
export class LoginPage extends React.Component {
  state = {
    username: "",
    password: "",
    apiError: undefined,
    pendingApiCall: false,
  };

  onChangeUserName = (e) => {
    let value = e.target.value;
    this.setState({
      username: value,
      apiError: undefined,
    });
  };
  onChangePassword = (e) => {
    let value = e.target.value;
    this.setState({
      password: value,
      apiError: undefined,
    });
  };
  onClickLogin = (e) => {
    this.setState({ pendingApiCall: true });
    const body = {
      username: this.state.username,
      password: this.state.password,
    };
    this.props.actions
      .postLogin(body)
      .then((response) => {
        this.setState({ pendingApiCall: false }, () => {
          this.props.history.push("/");
        });
      })
      .catch((error) => {
        if (error.response) {
          this.setState({ apiError: error.response.data.message });
          this.setState({ pendingApiCall: false });
        }
      });
  };
  render() {
    let disableLogin = false;
    if (this.state.username === "" || this.state.password === "") {
      disableLogin = true;
    }
    return (
      <div className="container">
        <div className="form">
          <div className="form-container">
            <div className="form-header">
              <img src={loginIcon} className="pt-3" />
              <h2 className="mb-3">Login</h2>
              <h4 className="mb-3">Hello User, Welcome Back!</h4>
            </div>
            <div className="mb-3 ">
              <MyInput
                label="Username :"
                placeholder="Your username"
                onChange={this.onChangeUserName}
              />
            </div>
            <div className="mb-3">
              <MyInput
                label="Password :"
                placeholder="Your password"
                type="password"
                onChange={this.onChangePassword}
              />
            </div>
            {this.state.apiError !== undefined && (
              <div className="mb-3">
                <div className="alert alert-danger" role="alert">
                  {this.state.apiError}
                </div>
              </div>
            )}
            <div className="flex-row-between text-center pb-3 flex-mobile-column">
              <ButtonWithProgress
                onClick={this.onClickLogin}
                disabled={disableLogin || this.state.pendingApiCall}
                text="Login"
                className="btn-yellow"
                pendingApiCall={this.state.pendingApiCall}
              />
              <div className="footer-text">
                Don't have an account?&nbsp;
                <Link to="/signup" className="form-link">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="login-signup-container">
            <h2 className="text-center ">Login</h2>
            <div className="col-12 mb-3 ">
              <Input
                label="Username :"
                placeholder="Your username"
                onChange={this.onChangeUserName}
              />
            </div>
            <div className="col-12 mb-3">
              <Input
                label="Password :"
                placeholder="Your password"
                type="password"
                onChange={this.onChangePassword}
              />
            </div>
            {this.state.apiError !== undefined && (
              <div className="col-12 mb-3">
                <div className="alert alert-danger" role="alert">
                  {this.state.apiError}
                </div>
              </div>
            )}
            <div className="flex-row-between text-center">
              <ButtonWithProgress
                onClick={this.onClickLogin}
                disabled={disableLogin || this.state.pendingApiCall}
                text="Login"
                className="btn-black"
                pendingApiCall={this.state.pendingApiCall}
              />
              <div className="small-text">
                Don't have an account?&nbsp;
                <Link to="/signup" className="signup-link">
                  Sign up
                </Link>
              </div>
            </div>
          </div> */}
      </div>
    );
  }
}
LoginPage.defaultProps = {
  actions: {
    postLogin: () => new Promise((resolve, reject) => resolve({})),
  },
  history: {
    push: () => {},
  },
  dispatch: () => {},
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postLogin: (body) => dispatch(authActions.loginHandler(body)),
    },
  };
};
export default connect(null, mapDispatchToProps)(LoginPage);
