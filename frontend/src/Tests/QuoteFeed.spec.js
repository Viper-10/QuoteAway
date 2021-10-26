import React from "react";
import * as apiCalls from "../ApiRequests/apiCalls";
import {
  render,
  waitForDomChange,
  waitForElement,
} from "@testing-library/react";
import QuoteFeed from "../components/QuoteFeed";
import { MemoryRouter } from "react-router";

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
    ],
    number: 0,
    first: true,
    last: false,
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
    it("does not display no hoax message when the response has page of hoax", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesSinglePage);
      const { queryByText } = setup();
      await waitForDomChange();
      expect(queryByText("There are no quotes")).not.toBeInTheDocument();
    });
    it("displays hoax content", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesSinglePage);
      const { queryByText } = setup();
      const quoteContent = await waitForElement(() =>
        queryByText("This is the latest quote")
      );
      expect(quoteContent).toBeInTheDocument();
    });

    it("displays Load More when there are next pages", async () => {
      apiCalls.loadQuotes = jest
        .fn()
        .mockResolvedValue(mockSuccessGetQuotesFirstOfMultiPage);
      const { queryByText } = setup();
      const LoadMore = await waitForElement(() => queryByText("Load More"));
      expect(LoadMore).toBeInTheDocument();
    });
  });
});
