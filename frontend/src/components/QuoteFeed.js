import React, { Component } from "react";
import * as apiCalls from "../ApiRequests/apiCalls";
import Spinner from "./Spinner";
import QuoteView from "./QuoteView";

class QuoteFeed extends Component {
  state = {
    page: {
      content: [],
    },
    isLoadingQuotes: false,
  };

  componentDidMount() {
    this.setState({ isLoadingQuotes: true });
    apiCalls.loadQuotes(this.props.user).then((response) => {
      this.setState({ page: response.data, isLoadingQuotes: false });
    });
  }

  render() {
    if (this.state.isLoadingQuotes) {
      return <Spinner />;
    }
    if (this.state.page.content.length === 0) {
      return (
        <div className="card card-header text-center"> There are no quotes</div>
      );
    }
    return (
      <div>
        {this.state.page.content.map((quote) => {
          return <QuoteView key={quote.id} quote={quote} />;
        })}

        {this.state.page.last === false && (
          <div className="card card-header text-center">Load More</div>
        )}
      </div>
    );
  }
}

export default QuoteFeed;
