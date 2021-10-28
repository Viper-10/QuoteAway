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

const setup = (props) => {
  return render(
    <MemoryRouter>
      <QuoteFeed {...props} />
    </MemoryRouter>
  );
};

const mockEmptyResponse = {
  data: {
    content: [],
  },
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
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup();
      await waitForElement(() => queryByText("There is 1 new quote"));
      const firstParam = apiCalls.loadNewQuoteCount.mock.calls[0][0];
      expect(firstParam).toBe(10);
    });
    it("calls loadNewQuoteCount with topQuote id and username when rendered with user property", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      await waitForElement(() => queryByText("There is 1 new quote"));
      expect(apiCalls.loadNewQuoteCount).toHaveBeenCalledWith(10, "user1");
    });
    it("displays new quote count as 1 after loadNewQuoteCount success", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      expect(newQuoteCount).toBeInTheDocument();
    });
    it("displays new quote count constantly", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      await waitForElement(() => queryByText("There is 1 new quote"));
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 2 } });
      const newQuoteCount = await waitForElement(() =>
        queryByText("There are 2 new quotes")
      );
      expect(newQuoteCount).toBeInTheDocument();
    }, 7000);
    it("does not call loadNewQuoteCount after component is unmounted", async (done) => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText, unmount } = setup({ user: "user1" });
      await waitForElement(() => queryByText("There is 1 new quote"));
      unmount();
      setTimeout(() => {
        expect(apiCalls.loadNewQuoteCount).toHaveBeenCalledTimes(1);
        done();
      }, 3500);
    }, 7000);
    it("displays new quote count as 1 after loadNewQuoteCount success when user does not have quotes initially", async () => {
      apiCalls.loadQuotes = jest.fn().mockResolvedValue(mockEmptyResponse);
      apiCalls.loadNewQuoteCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { queryByText } = setup({ user: "user1" });
      const newQuoteCount = await waitForElement(() =>
        queryByText("There is 1 new quote")
      );
      expect(newQuoteCount).toBeInTheDocument();
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
  });
});

console.error = () => {};
