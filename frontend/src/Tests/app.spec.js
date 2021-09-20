import { MemoryRouter } from "react-router";
import App from "../containers/App";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import authReducer from "../Redux/authReducer";
const defaultState = {
  id: 0,
  userName: "",
  displayName: "",
  image: "",
  isLoggedIn: false,
  password: "",
};

const setup = (path) => {
  const store = createStore(authReducer);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};
describe("App", () => {
  it("displays homepage when url is /", () => {
    const { queryByTestId } = setup("/");

    expect(queryByTestId("homepage")).toBeInTheDocument();
  });
  it("displays login page when url is /login", () => {
    const { container } = setup("/login");

    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Login");
  });
  it("does not display home page when url is /login", () => {
    const { queryByTestId } = setup("/login");
    expect(queryByTestId("homepage")).not.toBeInTheDocument();
  });
  it("displays signup page when url is /signup", () => {
    const { container } = setup("/signup");
    const header = container.querySelector("h3");
    expect(header).toHaveTextContent("Sign Up");
  });
  it("displays userpage when url is other than /, /login or /signup", () => {
    const { queryByTestId } = setup("/user1");
    expect(queryByTestId("userpage")).toBeInTheDocument();
  });

  it("displays TopBar when url is /", () => {
    const { container } = setup("/");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });
  it("displays TopBar when url is /login", () => {
    const { container } = setup("/login");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });
  it("displays TopBar when url is /signup", () => {
    const { container } = setup("/signup");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });
  it("displays TopBar when url is /user1", () => {
    const { container } = setup("/user1");
    const navigation = container.querySelector("nav");
    expect(navigation).toBeInTheDocument();
  });

  it("shows Usersignup page when signup is clicked", () => {
    const { queryByText, container } = setup("/");
    const signUpLink = queryByText("Sign Up");

    fireEvent.click(signUpLink);
    const header = container.querySelector("h3");
    expect(header).toHaveTextContent("Sign Up");
  });
  it("shows login page when login is clicked", () => {
    const { queryByText, container } = setup("/");
    const loginLink = queryByText("Login");

    fireEvent.click(loginLink);
    const header = container.querySelector("h1");
    expect(header).toHaveTextContent("Login");
  });
  it("shows home page when logo is clicked", () => {
    const { queryByText, container, queryByTestId } = setup("/");
    const logo = container.querySelector("img");

    fireEvent.click(logo);
    expect(queryByTestId("homepage")).toBeInTheDocument();
  });
});
