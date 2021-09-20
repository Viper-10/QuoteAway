import React from "react";
import logo from "../assets/hoaxify-logo.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class TopBar extends React.Component {
  onClickLogout = () => {
    // action for reducer so it can alter the store
    const action = {
      type: "logout-success",
    };

    // dispatching action
    this.props.dispatch(action);
  };

  render() {
    let links = (
      <ul className="nav navbar-nav ms-auto">
        <li className="nav-item">
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
      </ul>
    );

    if (this.props.user.isLoggedIn) {
      links = (
        <ul className="nav navbar-nav ms-auto">
          <li
            className="nav-item nav-link"
            onClick={this.onClickLogout}
            style={{ cursor: "pointer" }}
          >
            Logout
          </li>
          <li className="nav-item">
            <Link to={`/${this.props.user.userName}`} className="nav-link">
              My Profile
            </Link>
          </li>
        </ul>
      );
    }

    return (
      <div className="bg-white shadow-sm mb-2">
        <div className="container">
          <nav className="navbar navbar-light navbar-expand">
            <Link to="/" className="navbar-brand">
              <img src={logo} width="60" alt="Hoaxify" />
              Hoaxify
            </Link>
            {links}
          </nav>
        </div>
      </div>
    );
  }
}

// state is the redux state.

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

export default connect(mapStateToProps)(TopBar);
