import React from "react";
import UserList from "../components/UserList";
import QuoteSubmit from "../components/QuoteSubmit";

class Homepage extends React.Component {
  render() {
    return (
      <div data-testid="homepage">
        <div className="row">
          <div className="col-8">
            <QuoteSubmit />
          </div>
          <div className="col-4">
            <UserList />
          </div>
        </div>
      </div>
    );
  }
}

export default Homepage;
