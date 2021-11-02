import React from "react";
import { render, fireEvent, waitForDomChange } from "@testing-library/react";
import QuoteSubmit from "../components/QuoteSubmit";
import { createStore } from "redux";
import authReducer from "../redux/authReducer";
import { Provider } from "react-redux";
import * as apiCalls from "../ApiRequests/apiCalls";

const defaultState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

let store;

const setup = (state = defaultState) => {
  store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <QuoteSubmit />
    </Provider>
  );
};

describe("QuoteSubmit", () => {
  describe("Layout", () => {
    it("has textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      expect(textArea).toBeInTheDocument();
    });

    it("displays user image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/" + defaultState.image);
    });
  });

  describe("Interactions", () => {
    it("displays 3 rows when focused to textarea", () => {
      const { container } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      expect(textArea.rows).toBe(3);
    });

    it("displays Add Quote button when focused to textarea", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const addQuoteButton = queryByText("Add Quote");
      expect(addQuoteButton).toBeInTheDocument();
    });
    it("displays cancel button when focused to textarea", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeInTheDocument();
    });
    it("goes to unfocused state after clicking cancel button", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(queryByText("Cancel")).not.toBeInTheDocument();
    });
    it("does not display cancel and add quote button when focused to textarea", () => {
      const { queryByText } = setup();
      const cancelButton = queryByText("Cancel");
      const addQuoteButton = queryByText("Add Quote");
      expect(cancelButton).not.toBeInTheDocument();
      expect(addQuoteButton).not.toBeInTheDocument();
    });
    it("calls postQuote with quote request object when clicking Add Quote", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const postQuoteButton = queryByText("Add Quote");

      apiCalls.postQuote = jest.fn().mockResolvedValue({});
      fireEvent.click(postQuoteButton);

      expect(apiCalls.postQuote).toHaveBeenCalledWith({
        content: "Test hoax content",
      });
    });
    it("returns back to unfocused state after successful postQuote action", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      apiCalls.postQuote = jest.fn().mockResolvedValue({});
      fireEvent.click(addQuoteButton);

      await waitForDomChange();
      expect(queryByText("Add Quote")).not.toBeInTheDocument();
    });
    it("clear content after successful postQuote action", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      apiCalls.postQuote = jest.fn().mockResolvedValue({});
      fireEvent.click(addQuoteButton);

      await waitForDomChange();
      expect(queryByText("Test hoax content")).not.toBeInTheDocument();
    });
    it("clears content after clicking cancel", () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      fireEvent.click(queryByText("Cancel"));

      expect(queryByText("Test hoax content")).not.toBeInTheDocument();
    });
    it("disables Add Quote button when there is postQuote api call", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postQuote = mockFunction;
      fireEvent.click(addQuoteButton);

      fireEvent.click(addQuoteButton);
      expect(mockFunction).toHaveBeenCalledTimes(1);
    });
    it("disables Cancel button when there is postQuote api call", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postQuote = mockFunction;
      fireEvent.click(addQuoteButton);

      const cancelButton = queryByText("Cancel");
      expect(cancelButton).toBeDisabled();
    });
    it("enables Add Quote button when postQuote api call fails", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postQuote = mockFunction;
      fireEvent.click(addQuoteButton);

      await waitForDomChange();

      expect(queryByText("Add Quote")).not.toBeDisabled();
    });
    it("enables Cancel button when postQuote api call fails", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postQuote = mockFunction;
      fireEvent.click(addQuoteButton);

      await waitForDomChange();

      expect(queryByText("Cancel")).not.toBeDisabled();
    });
    it("enables Add Quote button after successful postQuote action", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      apiCalls.postQuote = jest.fn().mockResolvedValue({});
      fireEvent.click(addQuoteButton);

      await waitForDomChange();
      fireEvent.focus(textArea);
      expect(queryByText("Add Quote")).not.toBeDisabled();
    });

    it("displays validation error for content", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postQuote = mockFunction;
      fireEvent.click(addQuoteButton);

      await waitForDomChange();

      expect(
        queryByText("It must have minimum 10 and maximum 5000 characters")
      ).toBeInTheDocument();
    });
    it("clears validation error after clicking cancel", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postQuote = mockFunction;
      fireEvent.click(addQuoteButton);

      await waitForDomChange();
      fireEvent.click(queryByText("Cancel"));

      expect(
        queryByText("It must have minimum 10 and maximum 5000 characters")
      ).not.toBeInTheDocument();
    });
    it("clears validation error after content is changed", async () => {
      const { container, queryByText } = setup();
      const textArea = container.querySelector("textarea");
      fireEvent.focus(textArea);
      fireEvent.change(textArea, { target: { value: "Test hoax content" } });

      const addQuoteButton = queryByText("Add Quote");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postQuote = mockFunction;
      fireEvent.click(addQuoteButton);

      await waitForDomChange();
      fireEvent.change(textArea, {
        target: { value: "Test hoax content updated" },
      });

      expect(
        queryByText("It must have minimum 10 and maximum 5000 characters")
      ).not.toBeInTheDocument();
    });
  });
});

console.error = () => {};
