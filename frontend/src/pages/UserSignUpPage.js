import React from "react";
import * as apiCalls from "../ApiRequests/apiCalls";

export class UserSignUpPage extends React.Component {
  state = {
    displayName: "",
    userName: "",
    password: "",
    reTypedPassword: "",
    pendingApiSubmitCall: false,
  };

  onChangeDisplayName = (e) => {
    this.setState({ displayName: e.target.value });
  };

  onChangeUserName = (e) => {
    this.setState({ userName: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };
  onChangeConfirmPassword = (e) => {
    this.setState({ reTypedPassword: e.target.value });
  };

  onClickSignUp = (e) => {
    const user = {
      userName: this.state.userName,
      displayName: this.state.displayName,
      password: this.state.password,
    };

    this.setState({ pendingApiSubmitCall: true });

    if (this.props.actions) {
      this.props.actions
        .postSignUp(user)
        .then((response) => {
          this.setState({ pendingApiSubmitCall: false });
        })
        .catch((error) => {
          this.setState({ pendingApiSubmitCall: false });
        });
    }
  };

  render() {
    return (
      <div className="container">
        <h3 className="text-center">Sign Up</h3>

        <div className="col-12 mb-3">
          <label>Display Name</label>
          <input
            className="form-control"
            type="text"
            placeholder="Your display name"
            value={this.state.displayName}
            onChange={this.onChangeDisplayName}
          ></input>
        </div>
        <div className="col-12 mb-3">
          <label>User Name</label>
          <input
            className="form-control"
            type="text"
            value={this.state.userName}
            onChange={this.onChangeUserName}
            placeholder="Your username"
          ></input>
        </div>
        <div className="col-12 mb-3">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="Your password"
            value={this.password}
            onChange={this.onChangePassword}
          ></input>
        </div>
        <div className="col-12 mb-3">
          <label>Confirm Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="Confirm your password"
            value={this.reTypedPassword}
            onChange={this.onChangeConfirmPassword}
          ></input>
        </div>

        <div className="text-center">
          <button
            className="btn btn-primary"
            onClick={this.onClickSignUp}
            disabled={this.state.pendingApiSubmitCall}
          >
            {this.state.pendingApiSubmitCall && (
              <div className="spinner-border text-light spinner-border-sm mr-1 "></div>
            )}
            Sign up
          </button>
        </div>
      </div>
    );
  }
}

// UserSignUpPage.defaultProps = {
//   actions: {
//     postSignUp: apiCalls.signup,
//   },
// };

export default UserSignUpPage;
