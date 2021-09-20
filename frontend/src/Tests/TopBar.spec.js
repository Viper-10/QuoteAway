import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TopBar from "../components/TopBar";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../Redux/authReducer";

const loggedInState = {
  id: 1,
  userName: "user1",
  displayName: "display1",
  image: "profile1.png",
  isLoggedIn: true,
  password: "P4ssword$",
};
const defaultState = {
  id: 0,
  userName: "",
  displayName: "",
  image: "",
  isLoggedIn: false,
  password: "",
};
const setup = (state = defaultState) => {
  const store = createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    </Provider>
  );
};

describe("Top Bar", () => {
  describe("Layout", () => {
    it("has application logo", () => {
      const { container } = setup();
      const image = container.querySelector("img");

      expect(image.src).toContain("hoaxify-logo.png");
    });
    it("has link to home from logo", () => {
      const { container } = setup();
      const image = container.querySelector("img");

      expect(image.parentElement.getAttribute("href")).toBe("/");
    });
    it("has link to signup", () => {
      const { queryByText } = setup();
      const signUpLink = queryByText("Sign Up");

      expect(signUpLink.getAttribute("href")).toBe("/signup");
    });
    it("has link to login", () => {
      const { queryByText } = setup();
      const loginLink = queryByText("Login");

      expect(loginLink.getAttribute("href")).toBe("/login");
    });
    it("has link to logout when user is logged in", () => {
      const { queryByText } = setup(loggedInState);
      const logoutLink = queryByText("Logout");

      expect(logoutLink).toBeInTheDocument();
    });
    it("has link to user profile when user is logged in", () => {
      const { queryByText } = setup(loggedInState);
      const myprofileLink = queryByText("My Profile");

      expect(myprofileLink.getAttribute("href")).toBe("/user1");
    });
  });

  describe("Interactions", () => {
    it("displays the login and signup links when the user clicks logout", () => {
      const { queryByText } = setup(loggedInState);
      const logoutLink = queryByText("Logout");

      fireEvent.click(logoutLink);
      const loginLink = queryByText("Login");

      expect(loginLink).toBeInTheDocument();
    });
  });
});
