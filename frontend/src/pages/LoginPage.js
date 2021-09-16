import React from "react";
import Input from "../components/Input";

export class LoginPage extends React.Component {
  state = {
    username: "",
    password: "",
    apiError: "login failed",
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
    const body = {
      username: this.state.username,
      password: this.state.password,
    };
    this.props.actions.postLogin(body).catch((error) => {
      if (error.response) {
        this.setState({ apiError: error.response.data.message });
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
        <h1 className="text-center">Login</h1>
        <div className="col-12 mb-3">
          <Input
            label="Username"
            placeholder="Your username"
            onChange={this.onChangeUserName}
          />
        </div>
        <div className="col-12 mb-3">
          <Input
            label="Password"
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
        <div className="text-center">
          <button
            className="btn btn-primary"
            onClick={this.onClickLogin}
            disabled={disableLogin}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}
LoginPage.defaultProps = {
  actions: {
    postLogin: () => new Promise((resolve, reject) => resolve({})),
  },
};
export default LoginPage;
