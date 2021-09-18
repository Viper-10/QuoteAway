import { MemoryRouter } from "react-router";
import App from "../containers/App";
import { render } from "@testing-library/react";

const setup = (path) => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
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
});
