import React from "react";
import logo from "../assets/QuoteAway2.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import "../App.css";
import "../Css/Navbar.css";

class Navbar extends React.Component {
  state = {
    dropDownVisible: false,
  };

  componentDidMount() {
    document.addEventListener("click", this.onClickTracker);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onClickTracker);
  }

  onClickTracker = (event) => {
    if (this.actionArea && !this.actionArea.contains(event.target)) {
      this.setState({
        dropDownVisible: false,
      });
    }
  };

  onClickDisplayName = () => {
    this.setState({
      dropDownVisible: true,
    });
  };

  onClickLogout = () => {
    this.setState({
      dropDownVisible: false,
    });
    const action = {
      type: "logout-success",
    };
    this.props.dispatch(action);
    window.location.href = "/";
  };

  onClickMyProfile = () => {
    this.setState({
      dropDownVisible: false,
    });
  };

  assignActionArea = (area) => {
    this.actionArea = area;
  };

  render() {
    let links = (
      <ul>
        <li className="navbar-links">
          <Link to="/signup" className="link">
            Sign Up
          </Link>
        </li>
        <li className="navbar-links">
          <Link to="/login" className="link">
            Login
          </Link>
        </li>
      </ul>
    );
    if (this.props.user.isLoggedIn) {
      let dropDownClass = "p-0 shadow dropdown-menu";
      if (this.state.dropDownVisible) {
        dropDownClass += " show";
      }
      links = (
        // have a ul
        // have a li dropdown
        <ul>
          <li class="my-dropdown">
            <ProfileImageWithDefault
              className="rounded-circle m-auto"
              width="32"
              height="32"
              image={this.props.user.image}
            />
            <button className="dropdown-link ps-2">
              {this.props.user.displayName}
              <span className="ps-2">
                <i className="fas fa-angle-down" />
              </span>
            </button>

            <div className="my-dropdown-menu">
              <div className="my-dropdown-item">
                <i className="fas fa-user"></i>
                <Link to={`/${this.props.user.username}`}>My Profile</Link>
              </div>
              <div
                className="my-dropdown-item"
                onClick={this.onClickLogout}
                style={{
                  cursor: "pointer",
                }}
              >
                <i className="fas fa-sign-out-alt text-danger"></i> Logout
              </div>
            </div>
          </li>
        </ul>
      );
    }
    return (
      <div className="shadow-sm mb-1">
        <div className="container">
          <div className="my-navbar">
            <ul>
              <li className="navbar-links">
                <Link to="/" className="link">
                  QuoteAway
                </Link>
              </li>
            </ul>
            {links}
          </div>
        </div>
      </div>
    );
  }
}
Navbar.defaultProps = {
  history: {
    push: () => {},
  },
};
const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

export default connect(mapStateToProps)(Navbar);
