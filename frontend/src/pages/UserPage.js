import React from "react";
import * as apiCalls from "../ApiRequests/apiCalls";
import ProfileCard from "../components/ProfileCard";

class UserPage extends React.Component {
  state = {
    user: undefined,
    userNotFound: false,
    isLoadingUser: false,
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
      pageContent = this.state.user && <ProfileCard user={this.state.user} />;
    }

    return <div data-testid="userpage">{pageContent}</div>;
  }
}

UserPage.defaultProps = {
  match: {
    params: {},
  },
};
export default UserPage;
