import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserSignUpPage } from "../pages/UserSignUpPage";
import { isTSDeclareFunction } from "@babel/types";

describe("UserSignUpPage_tests", () => {
  describe("Layout", () => {
    it("has header of Sign Up", () => {
      const { container } = render(<UserSignUpPage />);
      const header = container.querySelector("h3");
      expect(header).toHaveTextContent("Sign Up");
    });
    it("has name input", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const input = queryByPlaceholderText("Your display name");
      expect(input).toBeInTheDocument();
    });
    it("has input for username", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const input = queryByPlaceholderText("Your username");
      expect(input).toBeInTheDocument();
    });
    it("has input for password", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const input = queryByPlaceholderText("Your password");
      expect(input).toBeInTheDocument();
    });
    it("has input for confirm password", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const input = queryByPlaceholderText("Confirm your password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const input = queryByPlaceholderText("Your password");
      expect(input.type).toBe("password");
    });
    it("has password type for confirm password input", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const input = queryByPlaceholderText("Confirm your password");
      expect(input.type).toBe("password");
    });
    it("has submit button", () => {
      const { container } = render(<UserSignUpPage />);
      const input = container.querySelector("button");
      expect(input).toBeInTheDocument();
      expect(input.textContent).toBe("Sign up");
    });
  });
  const changeEvent = (content) => {
    return {
      target: {
        value: content,
      },
    };
  };
  let button,
    displayNameInput,
    userNameInput,
    passwordInput,
    confirmPasswordInput;

  const setUpForSubmit = (props) => {
    const rendered = render(<UserSignUpPage {...props} />);

    const { container, queryByPlaceholderText } = rendered;

    displayNameInput = queryByPlaceholderText("Your display name");
    userNameInput = queryByPlaceholderText("Your username");
    confirmPasswordInput = queryByPlaceholderText("Confirm your password");
    passwordInput = queryByPlaceholderText("Your password");

    fireEvent.change(displayNameInput, changeEvent("my-display-name"));
    fireEvent.change(userNameInput, changeEvent("my-user-name"));
    fireEvent.change(confirmPasswordInput, changeEvent("my-confirm-password"));
    fireEvent.change(passwordInput, changeEvent("P4ssword"));

    button = container.querySelector("button");

    return rendered;
  };

  describe("Interactions", () => {
    it("sets the displayName value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const displayNameInput = queryByPlaceholderText("Your display name");
      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      expect(displayNameInput).toHaveValue("my-display-name");
    });
    it("sets the userName value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const userNameInput = queryByPlaceholderText("Your username");
      fireEvent.change(userNameInput, changeEvent("my-user-name"));
      expect(userNameInput).toHaveValue("my-user-name");
    });
    it("sets the password value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const passwordInput = queryByPlaceholderText("Your password");
      fireEvent.change(passwordInput, changeEvent("my-password"));
      expect(passwordInput).toHaveValue("my-password");
    });
    it("sets the confirm password value into state", () => {
      const { queryByPlaceholderText } = render(<UserSignUpPage />);
      const confirmPasswordInput = queryByPlaceholderText(
        "Confirm your password"
      );
      fireEvent.change(
        confirmPasswordInput,
        changeEvent("my-confirm-password")
      );
      expect(confirmPasswordInput).toHaveValue("my-confirm-password");
    });
  });

  it("calls postSignup when the fields are valid and the actions are provided in props", () => {
    const actions = {
      postSignup: jest.fn().mockResolvedValueOnce({}),
    };

    setUpForSubmit({ actions });
    fireEvent.click(button);

    expect(actions.postSignup).toHaveBeenCalledTimes(1);
  });
  it("does not throw exception when clicking the button without providing actions property", () => {
    setUpForSubmit();
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it("calls post with user body when the fields are valid", () => {
    const actions = {
      postSignup: jest.fn().mockResolvedValueOnce({}),
    };

    setUpForSubmit({ actions });
    fireEvent.click(button);
    const expectedUserObject = {
      userName: "my-user-name",
      displayName: "my-display-name",
      password: "P4ssword",
    };

    expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
  });
});
