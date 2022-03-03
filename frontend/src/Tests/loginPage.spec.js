import react from "react";
import {
  render,
  fireEvent,
  waitForElement,
  waitForDomChange,
  waitFor,
} from "@testing-library/react";
import { LoginPage } from "../pages/LoginPage";
import { renderIntoDocument } from "react-dom/test-utils";
describe("Login Page ", () => {
  describe("Layout", () => {
    it("has a header h2 of Login", () => {
      const { container } = render(<LoginPage />);
      const header = container.querySelector("h2");
      expect(header).toHaveTextContent("Login");
    });

    it("has a input for username", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const userNameInput = queryByPlaceholderText("Your username");
      expect(userNameInput).toBeInTheDocument();
    });

    it("has a input for password and type is password", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      expect(passwordInput).toBeInTheDocument();
      expect(passwordInput.type).toBe("password");
    });

    it("has a login button", () => {
      const { container } = render(<LoginPage />);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    const changeEvent = (content) => {
      return {
        target: {
          value: content,
        },
      };
    };

    let userNameInput, passwordInput, button;

    const setUpForSubmit = (props) => {
      const rendered = render(<LoginPage {...props} />);
      const { container, queryByPlaceholderText } = rendered;
      userNameInput = queryByPlaceholderText("Your username");
      fireEvent.change(userNameInput, changeEvent("my-user-name"));
      passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword$"));
      button = container.querySelector("button");

      return rendered;
    };
    it("sets the username into state", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const userNameInput = queryByPlaceholderText("Your username");
      fireEvent.change(userNameInput, changeEvent("my-user-name"));
      expect(userNameInput).toHaveValue("my-user-name");
    });
    it("sets the password into state", () => {
      const { queryByPlaceholderText } = render(<LoginPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword$"));
      expect(passwordInput).toHaveValue("P4ssword$");
    });
    it("onClick calls postLogin when values are provided for both the input fields", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };

      setUpForSubmit({ actions });
      fireEvent.click(button);
      expect(actions.postLogin).toHaveBeenCalledTimes(1);
    });
    it("does not throw exception when login is clicked without providing actions", () => {
      setUpForSubmit();
      expect(() => fireEvent.click(button)).not.toThrow();
    });
    it("calls postLogin with credentials in body", () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };

      setUpForSubmit({ actions });
      fireEvent.click(button);

      const expectedUserObject = {
        username: "my-user-name",
        password: "P4ssword$",
      };

      expect(actions.postLogin).toHaveBeenCalledWith(expectedUserObject);
    });
    it("enables the login button when the username and password input are not empty", () => {
      setUpForSubmit();
      expect(button).not.toBeDisabled();
    });
    it("disables the login button when the username or the password is empty", () => {
      setUpForSubmit();
      fireEvent.change(passwordInput, changeEvent(""));
      fireEvent.change(userNameInput, changeEvent(""));
      expect(button).toBeDisabled();
    });

    it("displays alert when login fails", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };

      const { queryByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      const alert = await waitForElement(() => queryByText("Login failed"));
      expect(alert).toBeInTheDocument();
    });
    it("clears alert when user changes username input", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };

      const { queryByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      await waitForElement(() => queryByText("Login failed"));
      fireEvent.change(userNameInput, changeEvent("updated-user-name"));

      const alert = queryByText("Login failed");
      expect(alert).not.toBeInTheDocument();
    });
    it("clears alert when user changes password input", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };

      const { queryByText } = setUpForSubmit({ actions });
      fireEvent.click(button);

      await waitForElement(() => queryByText("Login failed"));
      fireEvent.change(passwordInput, changeEvent("updated-password"));

      const alert = queryByText("Login failed");
      expect(alert).not.toBeInTheDocument();
    });
    it("redirects to home page after successful login", async () => {
      const actions = {
        postLogin: jest.fn().mockResolvedValue({}),
      };

      const history = {
        push: jest.fn(),
      };

      setUpForSubmit({ actions, history });
      fireEvent.click(button);

      await waitFor(() => expect(history.push).toHaveBeenCalledWith("/"));
    });
  });
});
