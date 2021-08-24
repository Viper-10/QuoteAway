import React from "react";
import InputBox from "../components/InputBox";
import Button from "../components/Button";

export class UserSignUpPage extends React.Component {
  state = {
    displayName: "",
    userName: "",
    password: "",
    reTypedPassword: "",
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

    if (this.props.actions) {
      this.props.actions.postSignup(user);
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
          <button className="btn btn-primary" onClick={this.onClickSignUp}>
            Sign up
          </button>
        </div>

        {/* <InputBox placeholderText="Your display name" />
        <InputBox placeholderText="Your Username" />
        <InputBox inputType="password" placeholderText="Your Password" />
        <InputBox
          inputType="password"
          placeholderText="Confirm Your Password"
        />
        <Button /> */}
      </div>
    );
  }
}

UserSignUpPage.defaultProps = {
  actions: {
    postSignup: () =>
      new Promise((resolve, reject) => {
        resolve({});
      }),
  },
};

export default UserSignUpPage;
