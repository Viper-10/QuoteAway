import React from "react";
import UserList from "../components/UserList";
import QuoteSubmit from "../components/QuoteSubmit";
import { connect } from "react-redux";
import QuoteFeed from "../components/QuoteFeed";

class HomePage extends React.Component {
  render() {
    return (
      <div data-testid="homepage">
        <div className="row">
          <div className="col-6 flex-grow-1">
            {this.props.loggedInUser.isLoggedIn && <QuoteSubmit />}
            <QuoteFeed />
          </div>
          <div className="col">
            <UserList />
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

export default connect(mapStateToProps)(HomePage);
