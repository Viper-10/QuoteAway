import React from "react";
import * as apiCalls from "../ApiRequests/apiCalls";
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { connect } from "react-redux";
import * as authActions from "../Redux/authActions";
import { Link } from "react-router-dom";

export class UserSignUpPage extends React.Component {
  state = {
    displayName: "",
    username: "",
    password: "",
    confirmPassword: "",
    pendingApiSubmitCall: false,
    errors: {},
    passwordRepeatConfirmed: true,
  };

  onChangeDisplayName = (e) => {
    const value = e.target.value;
    const errors = { ...this.state.errors };
    delete errors.displayName;

    this.setState({ displayName: e.target.value, errors });
  };

  onChangeUserName = (e) => {
    const value = e.target.value;
    const errors = { ...this.state.errors };
    delete errors.username;

    this.setState({ username: e.target.value, errors });
  };

  onChangePassword = (e) => {
    const value = e.target.value;
    const errors = { ...this.state.errors };
    delete errors.password;

    let passwordRepeatConfirmed = this.state.confirmPassword === value;
    errors.confirmPassword = passwordRepeatConfirmed
      ? ""
      : "Does not match to password";
    this.setState({
      password: value,
      passwordRepeatConfirmed,
      errors,
    });
  };
  onChangeConfirmPassword = (e) => {
    const value = e.target.value;

    let passwordRepeatConfirmed = this.state.password === value;
    const errors = { ...this.state.errors };

    errors.confirmPassword = passwordRepeatConfirmed
      ? ""
      : "Does not match to password";

    this.setState({
      confirmPassword: value,
      passwordRepeatConfirmed,
      errors,
    });
  };

  onClickSignUp = (e) => {
    const user = {
      username: this.state.username,
      displayName: this.state.displayName,
      password: this.state.password,
    };

    this.setState({ pendingApiSubmitCall: true });

    if (this.props.actions) {
      this.props.actions
        .postSignUp(user)
        .then((response) => {
          this.setState({ pendingApiSubmitCall: false }, () => {
            /*
              History is a part of the props provided by router
              It has a function called push, accessed by
              this.props.history.push("url") in the PageComponent
              It'll redirect to that url which has been pushed.
            */
            this.props.history.push("/");
          });
        })
        .catch((apiError) => {
          let errors = { ...this.state.errors };
          // validationErros is the name that we have given in the backend
          // for errors regarding validation errors such as
          // not having symbol in password, username being less than 4 letters
          if (
            apiError.response &&
            apiError.response.data &&
            apiError.response.data.validationErrors
          ) {
            errors = { ...apiError.response.data.validationErrors };
          }
          this.setState({ pendingApiSubmitCall: false, errors: errors });
        });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="form">
          <div className="form-container">
            <div className="form-header">
              {/* <i className="fas fa-solid fa-user-plus fa-2x mt-3 pe-3"></i> */}
              <div className="fs-3 mb-3">Sign Up</div>
            </div>
            <div className="mb-3">
              {/* <label>Displayname</label>
            <input
              className="form-control is-invalid"
              type="text"
              placeholder="Your display name"
              value={this.state.displayName}
              onChange={this.onChangeDisplayName}
            ></input>
            <div className="invalid-feedback">
              {this.state.errors.displayName}
            </div> */}
              <Input
                label="Displayname"
                placeholder="Your display name"
                value={this.state.displayName}
                onChange={this.onChangeDisplayName}
                hasError={this.state.errors.displayName && true}
                errorMessage={this.state.errors.displayName}
              />
            </div>
            <div className="mb-3">
              <Input
                label="Username"
                value={this.state.username}
                onChange={this.onChangeUserName}
                placeholder="Your username"
                hasError={this.state.errors.username && true}
                errorMessage={this.state.errors.username}
              />
            </div>
            <div className="mb-3">
              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                value={this.password}
                onChange={this.onChangePassword}
                hasError={this.state.errors.password && true}
                errorMessage={this.state.errors.password}
              />
            </div>
            <div className="mb-3">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={this.confirmPassword}
                onChange={this.onChangeConfirmPassword}
                hasError={this.state.errors.confirmPassword && true}
                errorMessage={this.state.errors.confirmPassword}
              />
            </div>

            <div className="flex-row-between text-center pb-3 flex-mobile-column">
              <ButtonWithProgress
                onClick={this.onClickSignUp}
                className="btn-yellow"
                disabled={
                  this.state.pendingApiSubmitCall ||
                  !this.state.passwordRepeatConfirmed
                }
                text="Sign up"
                pendingApiCall={this.state.pendingApiSubmitCall}
              />
              <div className="footer-text">
                Already registered? &nbsp;
                <Link to="/login" className="form-link">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserSignUpPage.defaultProps = {
  actions: {
    postSignUp: apiCalls.signup,
  },
  history: {
    push: () => {},
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      postSignUp: (user) => dispatch(authActions.signupHandler(user)),
    },
  };
};
export default connect(null, mapDispatchToProps)(UserSignUpPage);
