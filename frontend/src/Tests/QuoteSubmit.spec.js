import React from "react";
import { render, fireEvent } from "@testing-library/react";
import QuoteSubmit from "../components/QuoteSubmit";
import { createStore } from "redux";
import authReducer from "../redux/authReducer";
import { Provider } from "react-redux";

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
  });
});
