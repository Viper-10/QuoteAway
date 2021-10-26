import React, { Component } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

class QuoteView extends Component {
  render() {
    const { quote } = this.props;
    const { user, date } = quote;
    const { username, displayName, image } = user;
    const relativeDate = format(date);

    return (
      <div className="card p-1">
        <div className="d-flex">
          <ProfileImageWithDefault
            className="rounded-circle m-1"
            width="32"
            height="32"
            image={image}
          />
          <div className="flex-fill m-auto ps-2">
            <Link to={`/${username}`} className="list-group-item-action">
              <h6 className="d-inline">
                {displayName}@{username}
              </h6>
            </Link>
            <span className="text-black-50"> - </span>
            <span className="text-black-50">{relativeDate}</span>
          </div>
        </div>
        <div className="ps-5">{quote.content}</div>
      </div>
    );
  }
}
export default QuoteView;
