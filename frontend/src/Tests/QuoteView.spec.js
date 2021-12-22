import React from "react";
import { render } from "@testing-library/react";
import QuoteView from "../components/QuoteView";
import { MemoryRouter } from "react-router";
import authReducer from "../redux/authReducer";
import { Provider } from "react-redux";
import { createStore } from "redux";

const loggedInStateUser1 = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword$",
  isLoggedIn: true,
};
const loggedInStateUser2 = {
  id: 2,
  username: "user2",
  displayName: "display2",
  image: "profile2.png",
  password: "P4ssword$",
  isLoggedIn: true,
};

const setup = (state = loggedInStateUser1) => {
  const oneMinute = 60 * 1000;
  const date = new Date(new Date() - oneMinute);

  const quote = {
    id: 10,
    content: "This is the first quote",
    date: date,
    user: {
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
    },
  };
  const store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <QuoteView quote={quote} />
      </MemoryRouter>
    </Provider>
  );
};

describe("QuoteView", () => {
  describe("Layout", () => {
    it("displays quote content", () => {
      const { queryByText } = setup();
      expect(queryByText("This is the first quote")).toBeInTheDocument();
    });
    it("displays users image", () => {
      const { container } = setup();
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/profile1.png");
    });
    it("displays displayName@user", () => {
      const { queryByText } = setup();
      expect(queryByText("display1@user1")).toBeInTheDocument();
    });
    it("displays relative time", () => {
      const { queryByText } = setup();
      expect(queryByText("1 minute ago")).toBeInTheDocument();
    });
    it("has link to user page", () => {
      const { container } = setup();
      const anchor = container.querySelector("a");
      expect(anchor.getAttribute("href")).toBe("/user1");
    });
    it("displays delete button when quote owned by logged in user", () => {
      const { container } = setup();
      expect(container.querySelector("button")).toBeInTheDocument();
    });
    it("displays delete button when quote owned by logged in user", () => {
      const { container } = setup(loggedInStateUser2);
      expect(container.querySelector("button")).not.toBeInTheDocument();
    });
  });
});
