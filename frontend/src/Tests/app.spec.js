import { MemoryRouter } from "react-router";
import App from "../containers/App";
import {
  render,
  fireEvent,
  waitFor,
  waitForElement,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "../Redux/configureStore";
import axios from "axios";
import * as apiCalls from "../ApiRequests/apiCalls";

const defaultState = {
  id: 0,
  userName: "",
  displayName: "",
  image: "",
  isLoggedIn: false,
  password: "",
};
const mockSuccessGetUser1 = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};
const mockSuccessGetUser2 = {
  data: {
    id: 2,
    username: "user2",
    displayName: "display2",
    image: "profile2.png",
  },
};
const mockFailGetUser = {
  response: {
    data: {
      message: "User not found",
    },
  },
};
beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
});
apiCalls.getUser = jest.fn().mockResolvedValue({
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
});
apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});
apiCalls.loadQuotes = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});
const changeEvent = (content) => {
  return {
    target: {
      value: content,
    },
  };
};
const setup = (path) => {
  const store = configureStore(false);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};
const setUserOneLoggedInStorage = () => {
  localStorage.setItem(
    "hoax-auth",
    JSON.stringify({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword$",
      isLoggedIn: true,
    })
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

  it("displays My Profile on topbar on succesful login", async () => {
    const { queryByPlaceholderText, container, queryByText } = setup("/login");

    const userNameInput = queryByPlaceholderText("Your username");
    fireEvent.change(userNameInput, changeEvent("my-user-name"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword$"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });

    fireEvent.click(button);

    const myProfileLink = await waitForElement(() => queryByText("My Profile"));
    expect(myProfileLink).toBeInTheDocument();
  });
  it("displays My Profile on topbar on succesful sign up", async () => {
    const { queryByPlaceholderText, container, queryByText } = setup("/signup");

    const displayNameInput = queryByPlaceholderText("Your display name");
    const userNameInput = queryByPlaceholderText("Your username");
    const confirmPasswordInput = queryByPlaceholderText(
      "Confirm your password"
    );
    const passwordInput = queryByPlaceholderText("Your password");

    fireEvent.change(displayNameInput, changeEvent("my-display-name"));
    fireEvent.change(userNameInput, changeEvent("my-user-name"));
    fireEvent.change(confirmPasswordInput, changeEvent("P4ssword$"));
    fireEvent.change(passwordInput, changeEvent("P4ssword$"));

    const button = container.querySelector("button");
    axios.post = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          message: "user saved",
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      });

    fireEvent.click(button);

    const myProfileLink = await waitForElement(() => queryByText("My Profile"));
    expect(myProfileLink).toBeInTheDocument();
  });
  it("saves logged in user details to localstorage on succesful login", async () => {
    const { queryByPlaceholderText, container, queryByText } = setup("/login");

    const userNameInput = queryByPlaceholderText("Your username");
    fireEvent.change(userNameInput, changeEvent("my-user-name"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword$"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });

    fireEvent.click(button);

    await waitForElement(() => queryByText("My Profile"));

    const dataInStorage = JSON.parse(localStorage.getItem("hoax-auth"));
    expect(dataInStorage).toEqual({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword$",
      isLoggedIn: true,
    });
  });
  it("displays logged in top bar (My Profile and logout) if user is logged in", async () => {
    setUserOneLoggedInStorage();

    const { queryByText } = setup("/");
    const myProfileLink = queryByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });
  it("sets axios authorization with base 64 encoded user credentials after login success", async () => {
    const { queryByPlaceholderText, container, queryByText } = setup("/login");

    const userNameInput = queryByPlaceholderText("Your username");
    fireEvent.change(userNameInput, changeEvent("my-user-name"));
    const passwordInput = queryByPlaceholderText("Your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword$"));
    const button = container.querySelector("button");

    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });

    fireEvent.click(button);

    await waitForElement(() => queryByText("My Profile"));
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    const encoded = btoa("user1:P4ssword$");
    const expectedAuthorization = `Basic ${encoded}`;

    expect(axiosAuthorization).toBe(expectedAuthorization);
  });

  it("sets axios authorization with base64 encoded  user credentials if user is logged in", async () => {
    setUserOneLoggedInStorage();

    setup("/");
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    const encoded = btoa("user1:P4ssword$");
    const expectedAuthorization = `Basic ${encoded}`;

    expect(axiosAuthorization).toBe(expectedAuthorization);
  });
  it("removes axios authorization when user logout", async () => {
    setUserOneLoggedInStorage();

    const { queryByText } = setup("/");
    fireEvent.click(queryByText("Logout"));
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    expect(axiosAuthorization).toBeFalsy();
  });
  it("updates user page after clicking my profile when  another user page was opened", async () => {
    apiCalls.getUser = jest
      .fn()
      .mockResolvedValueOnce(mockSuccessGetUser2)
      .mockResolvedValueOnce(mockSuccessGetUser1);

    setUserOneLoggedInStorage();

    const { queryByText } = setup("/user2");

    await waitForElement(() => queryByText("display2@user2"));

    const myProfileLink = queryByText("My Profile");
    fireEvent.click(myProfileLink);

    const user1Info = await waitForElement(() => queryByText("display1@user1"));

    expect(user1Info).toBeInTheDocument();
  });
  it("updates user page after clicking my profile when  another not existing user page was requested", async () => {
    apiCalls.getUser = jest
      .fn()
      .mockRejectedValueOnce(mockFailGetUser)
      .mockResolvedValueOnce(mockSuccessGetUser1);

    setUserOneLoggedInStorage();
    const { queryByText } = setup("/user50");

    await waitForElement(() => queryByText("User not found"));

    const myProfileLink = queryByText("My Profile");
    fireEvent.click(myProfileLink);

    const user1Info = await waitForElement(() => queryByText("display1@user1"));

    expect(user1Info).toBeInTheDocument();
  });
});
console.error = () => {};
