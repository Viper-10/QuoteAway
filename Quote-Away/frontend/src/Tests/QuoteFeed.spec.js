import React from "react";
import {
  render,
  waitForDomChange,
  waitForElement,
  fireEvent,
} from "@testing-library/react";
import QuoteFeed from "../components/QuoteFeed";
import * as apiCalls from "../ApiRequests/apiCalls";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../redux/authReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";

const loggedInStateUser = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword$",
  isLoggedIn: true,
};

const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

let timedFunction;

const useFakeIntervals = () => {
  window.setInterval = (callback, interval) => {
    timedFunction = callback;
  };
  window.clearInterval = () => {
    timedFunction = undefined;
  };
};

const useRealIntervals = () => {
  window.setInterval = originalSetInterval;
  window.clearInterval = originalClearInterval;
};

const runTimer = () => {
  timedFunction && timedFunction();
};

const setup = (props, state = loggedInStateUser) => {
  const store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <QuoteFeed {...props} />
      </MemoryRouter>
    </Provider>
  );
};

const mockEmptyResponse = {
  data: {
    content: [],
  },
};
const mockSuccessGetQuotesMiddleOfMultiPage = {
  data: {
    content: [
      {
        id: 5,
        content: "This quote is in middle page",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: false,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetNewQuotesList = {
  data: [
    {
      id: 21,
      content: "This is the newest quote",
      date: 1561294668539,
      user: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    },
  ],
};
const mockSuccessGetQuotesSinglePage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest quote",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 1,
  },
};

const mockSuccessGetQuotesFirstOfMultiPage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest quote",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
      {
        id: 9,
        content: "This is quote 9",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetQuotesLastOfMultiPage = {
  data: {
    content: [
      {
        id: 1,
        content: "This is the oldest quote",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 2,
  },
};
describe("QuoteFeed", () => {
  describe("Lifecycle", () => {
    it("calls loadQuotes when it is rendered", () => {
      apiCalls.loadQuotes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      expect(apiCalls.loadQuotes).toHaveBeenCalled();
    });
    it("calls loadQuotes with user parameter when it is rendered with user property", () => {
      apiCalls.loadQuotes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup({ user: "user1" });
      expect(apiCalls.loadQuotes).toHaveBeenCalledWith("user1");
    });
    it("calls loadQuotes without user parameter when it is rendered without user property", () => {
      apiCalls.loadQuotes = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const parameter = apiCalls.loadQuotes.mock.calls[0][0];
      expect(parameter).toBeUndefined();
    });
    it("calls loadNewQuoteCount with topQuote id", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      await waitForElement(() => queryByText("There is 1 new quote"));
      const firstParam = apiCalls.loadNewQuoteCount.mock.calls[0][0];
      expect(firstParam).toBe(10);
      useRealIntervals();
    });
    it("calls loadNewQuoteCount with topQuote id and username when rendered with user property", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      await waitForElement(() => queryByText("There is 1 new quote"));
      expect(apiCalls.loadNewQuoteCount).toHaveBeenCalledWith(10, "user1");
      useRealIntervals();
    });
    it("displays new quote count as 1 after loadNewQuoteCount success", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      expect(newQuoteCount).toBeInTheDocument();
      useRealIntervals();
    });
    it("displays new quote count constantly", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      await waitForElement(() => queryByText("There is 1 new quote"));
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 2 } });
      runTimer();
      const newQuoteCount = await waitForElement(() =>
        queryByText("There are 2 new quotes")
      );
      expect(newQuoteCount).toBeInTheDocument();
      useRealIntervals();
    });
    // it("does not call loadNewQuoteCount after component is unmounted", async () => {
    //   useFakeIntervals();
    //   apiCalls.loadQuotes = jest
    //     .fn()
    //     .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
    //   apiCalls.loadNewQuoteCount = jest
    //     .fn()
    //     .mockResolvedValue({ data: { count: 1 } });
    //   const { queryByText, unmount } = setup({ user: "user1" });
    //   await waitForDomChange();
    //   runTimer();
    //   await waitForElement(() => queryByText("There is 1 new quote"));
    //   unmount();
    //   expect(apiCalls.loadNewQuoteCount).toHaveBeenCalledTimes(1);
    //   useRealIntervals();
    // });
    it("displays new quote count as 1 after loadNewQuoteCount success when user does not have quotes initially", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest.fn().mockResolvedValue(mockEmptyResponse);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      expect(newQuoteCount).toBeInTheDocument();
      useRealIntervals();
    });
  });
  describe("Layout", () => {
    it("displays no quote message when the response has empty page", async () => {
      apiCalls.loadQuotes = jest.fn().mockResolvedValue(mockEmptyResponse);
      const { queryByText } = setup();
      const message = await waitForElement(() =>
        queryByText("There are no quotes")
      );
      expect(message).toBeInTheDocument();
    });
    it("does not display no quote message when the response has page of quote", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesSinglePage);
      const { queryByText } = setup();
      await waitForDomChange();
      expect(queryByText("There are no quotes")).not.toBeInTheDocument();
    });
    it("displays spinner when loading the quotes", async () => {
      apiCalls.loadQuotes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetQuotesSinglePage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      expect(queryByText("Loading...")).toBeInTheDocument();
    });
    it("displays quote content", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesSinglePage);
      const { queryByText } = setup();
      const hoaxContent = await waitForElement(() =>
        queryByText("This is the latest quote")
      );
      expect(hoaxContent).toBeInTheDocument();
    });
    it("displays Load More when there are next pages", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      expect(loadMore).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    it("calls loadOldQuotes with quote id when clicking Load More", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadOldQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesLastOfMultiPage);
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const firstParam = apiCalls.loadOldQuotes.mock.calls[0][0];
      expect(firstParam).toBe(9);
    });
    it("calls loadOldQuotes with quote id and username when clicking Load More when rendered with user property", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadOldQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesLastOfMultiPage);
      const { queryByText } = setup({ user: "user1" });
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      expect(apiCalls.loadOldQuotes).toHaveBeenCalledWith(9, "user1");
    });
    it("displays loaded old quote when loadOldQuotes api call success", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadOldQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesLastOfMultiPage);
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const oldQuote = await waitForElement(() =>
        queryByText("This is the oldest quote")
      );
      expect(oldQuote).toBeInTheDocument();
    });
    it("hides Load More when loadOldQuotes api call returns last page", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadOldQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesLastOfMultiPage);
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      await waitForElement(() => queryByText("This is the oldest quote"));
      expect(queryByText("Load More")).not.toBeInTheDocument();
    });

    // load new quotes
    it("calls loadNewQuotes with quote id when clicking New quote Count Card", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewQuotesList);
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      fireEvent.click(newQuoteCount);
      const firstParam = apiCalls.loadNewQuotes.mock.calls[0][0];
      expect(firstParam).toBe(10);
      useRealIntervals();
    });
    it("calls loadNewQuotes with quote id and username when clicking New quote Count Card", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewQuotesList);
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      fireEvent.click(newQuoteCount);
      expect(apiCalls.loadNewQuotes).toHaveBeenCalledWith(10, "user1");
      useRealIntervals();
    });
    it("displays loaded new quote when loadNewQuotes api call success", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewQuotesList);
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      fireEvent.click(newQuoteCount);
      const newHoax = await waitForElement(() =>
        queryByText("This is the newest quote")
      );
      expect(newHoax).toBeInTheDocument();
      useRealIntervals();
    });
    it("hides new quote count when loadNewQuotes api call success", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewQuotesList);
      const { queryByText } = setup({ user: "user1" });
      await waitForDomChange();
      runTimer();
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      fireEvent.click(newQuoteCount);
      await waitForElement(() => queryByText("This is the newest quote"));
      expect(queryByText("There is 1 new quote")).not.toBeInTheDocument();
      useRealIntervals();
    });

    // progress indicator
    it("does not allow loadOldQuotes to be called when there is an active api call about it", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadOldQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesLastOfMultiPage);
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      fireEvent.click(loadMore);

      expect(apiCalls.loadOldQuotes).toHaveBeenCalledTimes(1);
    });
    it("replaces Load More with spinner when there is an active api call about it", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadOldQuotes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetQuotesLastOfMultiPage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      const spinner = await waitForElement(() => queryByText("Loading..."));
      expect(spinner).toBeInTheDocument();
      expect(queryByText("Load More")).not.toBeInTheDocument();
    });
    it("replaces Spinner with Load More after active api call for loadOldQuotes finishes with middle page response", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadOldQuotes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetQuotesMiddleOfMultiPage);
          }, 300);
        });
      });
      const { queryByText } = setup();
      const loadMore = await waitForElement(() => queryByText("Load More"));
      fireEvent.click(loadMore);
      await waitForElement(() => queryByText("This quote is in middle page"));
      expect(queryByText("Loading...")).not.toBeInTheDocument();
      expect(queryByText("Load More")).toBeInTheDocument();
    });

    it("does not allow loadNewQuotes to be called when there is an active api call about it", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewQuotesList);
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      fireEvent.click(newQuoteCount);
      fireEvent.click(newQuoteCount);

      expect(apiCalls.loadNewQuotes).toHaveBeenCalledTimes(1);
      useRealIntervals();
    });
    it("replaces There is 1 new quote with spinner when there is an active api call about it", async () => {
      useFakeIntervals();
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewQuotes = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetNewQuotesList);
          }, 300);
        });
      });
      const { queryByText } = setup();
      await waitForDomChange();
      runTimer();

      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      fireEvent.click(newQuoteCount);
      const spinner = await waitForElement(() => queryByText("Loading..."));
      expect(spinner).toBeInTheDocument();
      expect(queryByText("There is 1 new quote")).not.toBeInTheDocument();
      useRealIntervals();
    });
    it("displays modal when clicking delete on quote", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByTestId, container } = setup();
      await waitForDomChange();

      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).toHaveClass("modal fade d-block show");
    });
    it("hides modal when clicking cancel", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByTestId, container, queryByText } = setup();
      await waitForDomChange();

      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      fireEvent.click(queryByText("Cancel"));

      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).not.toHaveClass("d-block show");
    });
    it("displays modal with information about the action", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { container, queryByText } = setup();
      await waitForDomChange();

      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);

      const message = queryByText(
        `Are you sure to delete 'This is the latest quote'?`
      );
      expect(message).toBeInTheDocument();
    });

    it("calls deleteQuote api with hoax id when delete button is clicked on modal", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteQuote = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteQuoteButton = queryByText("Delete Quote");
      fireEvent.click(deleteQuoteButton);
      expect(apiCalls.deleteQuote).toHaveBeenCalledWith(10);
    });
    it("hides modal after successful deleteQuote api call", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteQuote = jest.fn().mockResolvedValue({});
      const { container, queryByText, queryByTestId } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteQuoteButton = queryByText("Delete Quote");
      fireEvent.click(deleteQuoteButton);
      await waitForDomChange();
      const modalRootDiv = queryByTestId("modal-root");
      expect(modalRootDiv).not.toHaveClass("d-block show");
    });
    it("removes the deleted hoax from document after successful deleteQuote api call", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deleteQuote = jest.fn().mockResolvedValue({});
      const { container, queryByText } = setup();
      await waitForDomChange();
      const deleteButton = container.querySelectorAll("button")[0];
      fireEvent.click(deleteButton);
      const deleteQuoteButton = queryByText("Delete Quote");
      fireEvent.click(deleteQuoteButton);
      await waitForDomChange();
      const deletedQuoteContent = queryByText("This is the latest quote");
      expect(deletedQuoteContent).not.toBeInTheDocument();
    });
  });
});

console.error = () => {};
