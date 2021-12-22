import React, { Component } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { connect } from "react-redux";
import * as apiCalls from "../ApiRequests/apiCalls";
import ButtonWithProgress from "../components/ButtonWithProgress";

class QuoteSubmit extends Component {
  state = {
    focused: false,
    content: undefined,
    pendingApiCall: false,
    errors: {},
  };

  onChangeContent = (e) => {
    const value = e.target.value;
    this.setState({ content: value, errors: {} });
  };

  onClickAddQuote = (e) => {
    const body = {
      content: this.state.content,
    };
    this.setState({ pendingApiCall: true });
    apiCalls
      .postQuote(body)
      .then((response) => {
        this.setState({
          focused: false,
          content: "",
          pendingApiCall: false,
        });
      })
      .catch((error) => {
        let errors;
        if (
          error.response &&
          error.response.data &&
          error.response.data.validationErrors
        ) {
          errors = error.response.data.validationErrors;
        }

        this.setState({ errors, pendingApiCall: false });
      });
  };

  onFocus = () => {
    this.setState({
      focused: true,
    });
  };

  onClickCancel = () => {
    this.setState({
      focused: false,
      content: "",
      errors: {},
    });
  };

  render() {
    let textAreaClassName = "form-control w-100 mt-2 mb-2";
    if (this.state.errors.content) {
      textAreaClassName += " is-invalid";
    }

    return (
      <div>
        <div className="card d-flex flex-row p-1">
          <ProfileImageWithDefault
            className="rounded-circle m-3"
            width="32"
            height="32"
            image={this.props.loggedInUser.image}
          />
          <div className="flex-fill">
            <textarea
              className={textAreaClassName}
              rows={this.state.focused ? 3 : 1}
              onFocus={this.onFocus}
              value={this.state.content}
              onChange={this.onChangeContent}
            />
            {this.state.errors.content && (
              <span className="invalid-feedback">
                {this.state.errors.content}
              </span>
            )}
            {this.state.focused && (
              <div className="text-right mt-1">
                <ButtonWithProgress
                  className="btn btn-success"
                  disabled={this.state.pendingApiCall}
                  onClick={this.onClickAddQuote}
                  pendingApiCall={this.state.pendingApiCall}
                  text="Add Quote"
                />
                <button
                  className="btn btn-secondary ms-1"
                  disabled={this.state.pendingApiCall}
                  onClick={this.onClickCancel}
                >
                  <i className="fas fa-times me-1"></i>Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};

export default connect(mapStateToProps)(QuoteSubmit);
