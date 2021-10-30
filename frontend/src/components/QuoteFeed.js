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
    newQuoteCount: 0,
    isLoadingOldQuotes: false,
    isLoadingNewQuotes: false,
  };

  componentDidMount() {
    this.setState({ isLoadingQuotes: true });
    apiCalls.loadQuotes(this.props.user).then((response) => {
      this.setState({ page: response.data, isLoadingQuotes: false }, () => {
        this.counter = setInterval(this.checkCount, 3000);
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  checkCount = () => {
    const quotes = this.state.page.content;
    let topQuoteId = 0;
    if (quotes.length > 0) {
      topQuoteId = quotes[0].id;
    }
    apiCalls.loadNewQuoteCount(topQuoteId, this.props.user).then((response) => {
      this.setState({ newQuoteCount: response.data.count });
    });
  };

  onClickLoadMore = () => {
    if (this.state.isLoadingOldQuotes) {
      return;
    }
    this.setState({ isLoadingOldQuotes: true });
    const quotes = this.state.page.content;
    if (quotes.length === 0) {
      return;
    }
    const quoteAtBottom = quotes[quotes.length - 1];
    apiCalls
      .loadOldQuotes(quoteAtBottom.id, this.props.user)
      .then((response) => {
        const page = { ...this.state.page };
        page.content = [...page.content, ...response.data.content];
        page.last = response.data.last;
        this.setState({ page, isLoadingOldQuotes: false });
      })
      .catch((error) => {
        this.setState({ isLoadingOldQuotes: false });
      });
  };

  onClickLoadNew = () => {
    if (this.state.isLoadingNewQuotes) return;
    const quotes = this.state.page.content;
    let topQuoteId = 0;
    if (quotes.length > 0) {
      topQuoteId = quotes[0].id;
    }
    this.setState({ isLoadingNewQuotes: true });
    apiCalls
      .loadNewQuotes(topQuoteId, this.props.user)
      .then((response) => {
        const page = { ...this.state.page };
        page.content = [...response.data, ...page.content];
        this.setState({ page, newQuoteCount: 0, isLoadingNewQuotes: false });
      })
      .catch((error) => {
        this.setState({ isLoadingNewQuotes: false });
      });
  };

  render() {
    if (this.state.isLoadingQuotes) {
      return <Spinner />;
    }
    if (
      this.state.page.content.length === 0 &&
      this.state.newQuoteCount === 0
    ) {
      return (
        <div className="card card-header text-center">There are no quotes</div>
      );
    }

    let newQuoteMessage =
      this.state.newQuoteCount === 1
        ? "There is 1 new quote"
        : `There are ${this.state.newQuoteCount} new quotes`;
    return (
      <div>
        {this.state.newQuoteCount > 0 && (
          <div
            className="card card-header text-center"
            onClick={this.onClickLoadNew}
            style={{
              cursor: this.state.isLoadingNewQuotes ? "not-allowed" : "pointer",
            }}
          >
            {this.state.isLoadingNewQuotes ? <Spinner /> : newQuoteMessage}
          </div>
        )}
        {this.state.page.content.map((quote) => {
          return <QuoteView key={quote.id} quote={quote} />;
        })}
        {this.state.page.last === false && (
          <div
            className="card card-header text-center"
            onClick={this.onClickLoadMore}
            style={{
              cursor: this.state.isLoadingOldQuotes ? "not-allowed" : "pointer",
            }}
          >
            {this.state.isLoadingOldQuotes ? <Spinner /> : "Load More"}
          </div>
        )}
      </div>
    );
  }
}

export default QuoteFeed;
