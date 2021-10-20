import React from "react";
import { connect } from "react-redux";
import * as apiCalls from "../ApiRequests/apiCalls";
import ProfileCard from "../components/ProfileCard";

class UserPage extends React.Component {
  state = {
    user: undefined,
    userNotFound: false,
    isLoadingUser: false,
    inEditMode: false,
    originalDisplayName: undefined,
    pendingUpdateCall: false,
    image: undefined,
    errors: {},
  };
  loadUser = () => {
    this.setState({ userNotFound: false, isLoadingUser: true });
    const username = this.props.match.params.username;

    if (!username) return;
    apiCalls
      .getUser(username)
      .then((response) => {
        this.setState({ user: response.data, isLoadingUser: false });
      })
      .catch((error) => {
        this.setState({
          userNotFound: true,
          isLoadingUser: false,
        });
      });
  };
  componentDidMount() {
    this.loadUser();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.loadUser();
    }
  }

  onClickEdit = () => {
    this.setState({ inEditMode: true });
  };

  onClickCancel = () => {
    const user = { ...this.state.user };
    if (this.state.originalDisplayName !== undefined) {
      user.displayName = this.state.originalDisplayName;
    }
    this.setState({
      user,
      inEditMode: false,
      originalDisplayName: undefined,
      image: undefined,
      errors: {},
    });
  };

  onClickSave = () => {
    this.setState({ pendingUpdateCall: true });
    const userId = this.props.loggedInUser.id;
    const userUpdate = {
      displayName: this.state.user.displayName,
      image: this.state.image && this.state.image.split(",")[1],
    };
    apiCalls
      .updateUser(userId, userUpdate)
      .then((response) => {
        const user = { ...this.state.user };
        user.image = response.data.image;
        this.setState(
          {
            inEditMode: false,
            originalDisplayName: undefined,
            pendingUpdateCall: false,
            user,
            image: undefined,
          },
          () => {
            const action = {
              type: "update-success",
              payload: user,
            };

            this.props.dispatch(action);
          }
        );
      })
      .catch((error) => {
        let errors = {};
        if (
          error.response &&
          error.response.data &&
          error.response.data.validationErrors
        ) {
          errors = error.response.data.validationErrors;
        }
        this.setState({ pendingUpdateCall: false, errors });
      });
  };

  onChangeDisplayName = (event) => {
    const user = { ...this.state.user };
    let originalDisplayName = this.state.originalDisplayName;

    if (originalDisplayName === undefined) {
      originalDisplayName = user.displayName;
    }

    user.displayName = event.target.value;

    const errors = { ...this.state.errors };
    errors.displayName = undefined;

    this.setState({ user, originalDisplayName, errors });
  };

  onFileSelect = (event) => {
    if (event.target.files.length === 0) return;
    const file = event.target.files[0];
    const errors = { ...this.state.errors };
    errors.image = undefined;

    let reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        image: reader.result,
        errors,
      });
    };
    // reader reads the file and when it is read fully it calls onloadend function.

    reader.readAsDataURL(file);
  };
  render() {
    let pageContent;

    if (this.state.isLoadingUser) {
      pageContent = (
        <div className="d-flex text-black-50 m-auto">
          <div className="spinner-border">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    } else if (this.state.userNotFound) {
      pageContent = (
        <div className="alert alert-danger text-center">
          <div className="alert-heading">
            <i className="fas fa-exclamation-triangle fa-3x" />
          </div>
          <h5>User not found</h5>
        </div>
      );
    } else {
      const isEditable =
        this.props.loggedInUser.username === this.props.match.params.username;

      pageContent = this.state.user && (
        <ProfileCard
          user={this.state.user}
          isEditable={isEditable}
          inEditMode={this.state.inEditMode}
          onClickEdit={this.onClickEdit}
          onClickCancel={this.onClickCancel}
          onClickSave={this.onClickSave}
          onChangeDisplayName={this.onChangeDisplayName}
          pendingUpdateCall={this.state.pendingUpdateCall}
          loadedImage={this.state.image}
          onFileSelect={this.onFileSelect}
          errors={this.state.errors}
        />
      );
    }

    return <div data-testid="userpage">{pageContent}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    loggedInUser: state,
  };
};

// to get dispatch from match params in props we assign this.
UserPage.defaultProps = {
  match: {
    params: {},
  },
};
export default connect(mapStateToProps)(UserPage);

console.error = () => {};
