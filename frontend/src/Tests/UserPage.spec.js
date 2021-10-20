import React from "react";
import {
  render,
  waitForElement,
  fireEvent,
  waitForDomChange,
} from "@testing-library/react";
import UserPage from "../pages/UserPage";
import * as apiCalls from "../ApiRequests/apiCalls";
import { Provider } from "react-redux";
import configureStore from "../Redux/configureStore";
import axios from "axios";

const mockSuccessGetUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};
const mockSuccessUpdateUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1-update",
    image: "profile1-update.png",
  },
};
const mockFailUpdateUser = {
  response: {
    data: {
      validationErrors: {
        displayName: "It must have minimum 4 and maximum 255 characters",
        image: "Only PNG and JPG files are allowed",
      },
    },
  },
};
const mockFailedGetUser = {
  response: {
    data: {
      message: "User not found",
    },
  },
};
const match = {
  params: {
    username: "user1",
  },
};
beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
});
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
const setup = (props) => {
  const store = configureStore(false);

  return render(
    <Provider store={store}>
      <UserPage {...props} />
    </Provider>
  );
};
describe("User page", () => {
  describe("Layout", () => {
    it("has root page div", () => {
      const { queryByTestId } = setup();
      const userPageDiv = queryByTestId("userpage");
      expect(userPageDiv).toBeInTheDocument();
    });
    it("displays the displayName@username when user data loaded", async () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const { queryByText } = setup({ match });
      const text = await waitForElement(() => queryByText("display1@user1"));
      expect(text).toBeInTheDocument();
    });
    it("displays the not found alert when user not found", async () => {
      apiCalls.getUser = jest.fn().mockRejectedValue(mockFailedGetUser);
      const { queryByText } = setup({ match });
      const alert = await waitForElement(() => queryByText("User not found"));
      expect(alert).toBeInTheDocument();
    });
    it("displays the spinner while loading user data", () => {
      const mockDelayedResponse = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetUser);
          }, 300);
        });
      });
      apiCalls.getUser = mockDelayedResponse;
      const { queryByText } = setup({ match });
      const spinner = queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });

    it("displays the edit button when loggedInUser matches to user in url", async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);

      const { queryByText } = setup({ match });
      await waitForElement(() => queryByText("display1@user1"));
      const editButton = queryByText("Edit");
      expect(editButton).toBeInTheDocument();
    });
  });

  describe("Lifecycle", () => {
    it("calls getUser when it is rendered", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);

      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
    });
    it("calls getUser for user1 when it is rendered with user1 in match", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);

      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
    });
  });
  describe("ProfileCard Interactions", () => {
    const setUpForEdit = async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);

      const rendered = setup({ match });

      const editButton = await waitForElement(() =>
        rendered.queryByText("Edit")
      );
      fireEvent.click(editButton);

      return rendered;
    };
    it("displays edit layout when clicking edit button", async () => {
      const { queryByText } = await setUpForEdit();
      expect(queryByText("Save")).toBeInTheDocument();
    });
    it("returns to normal mode after clicking cancel", async () => {
      const { queryByText } = await setUpForEdit();

      const cancelButton = await waitForElement(() => queryByText("Cancel"));

      fireEvent.click(cancelButton);

      expect(queryByText("Edit")).toBeInTheDocument();
    });
    it("calls updateUser api when clicking save", async () => {
      const { queryByText } = await setUpForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = await waitForElement(() => queryByText("Save"));

      fireEvent.click(saveButton);

      expect(apiCalls.updateUser).toHaveBeenCalledTimes(1);
    });
    it("calls updateUser api with user id", async () => {
      const { queryByText } = await setUpForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = await waitForElement(() => queryByText("Save"));

      fireEvent.click(saveButton);

      const userId = apiCalls.updateUser.mock.calls[0][0];
      expect(userId).toBe(1);
    });
    it("calls updateUser api with request body having changed displayName", async () => {
      const { queryByText, container } = await setUpForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const displayInput = container.querySelector("input");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });

      const saveButton = await waitForElement(() => queryByText("Save"));

      fireEvent.click(saveButton);

      const requestBody = apiCalls.updateUser.mock.calls[0][1];
      expect(requestBody.displayName).toBe("display1-update");
    });
    it("returns to non edit mode after successful updateUser api call", async () => {
      const { queryByText } = await setUpForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = await waitForElement(() => queryByText("Save"));

      fireEvent.click(saveButton);

      const editButtonAfterClickingSave = await waitForElement(() =>
        queryByText("Edit")
      );
      expect(editButtonAfterClickingSave).toBeInTheDocument();
    });

    it("displays the selected image in edit mode", async () => {
      const { container } = await setUpForEdit();

      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();

      const image = container.querySelector("img");
      expect(image.src).toContain("data:image/png;base64");
    });
    it("returns back to original image when the new image added before saving is cancelled", async () => {
      const { queryByText, container } = await setUpForEdit();

      const inputs = container.querySelectorAll("input");
      // selecting the file
      const uploadInput = inputs[1];

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();

      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);

      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/profile1.png");
    });
    it("does not throw error after file not selected", async () => {
      const { container } = await setUpForEdit();

      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];

      expect(() =>
        fireEvent.change(uploadInput, { target: { files: [] } })
      ).not.toThrow();
    });
    it("calls updateUser api with request body having new image without data:image/png;base64", async () => {
      const { queryByText, container } = await setUpForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];
      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);

      const requestBody = apiCalls.updateUser.mock.calls[0][1];

      expect(requestBody.image).not.toContain("data:image/png;base64");
    });
    it("returns to last updated image when image is change for another time but cancelled", async () => {
      const { queryByText, container } = await setUpForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitForDomChange();
      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);

      const editButtonAfterClickingSave = await waitForElement(() =>
        queryByText("Edit")
      );
      fireEvent.click(editButtonAfterClickingSave);

      const newFile = new File(["another content"], "example2.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [newFile] } });

      const cancelButton = queryByText("Cancel");
      fireEvent.click(cancelButton);
      const image = container.querySelector("img");
      expect(image.src).toContain("/images/profile/profile1-update.png");
    });

    it("displays validation errors for displayName when update api fails", async () => {
      const { queryByText } = await setUpForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);
      await waitForDomChange();

      const errorMessage = queryByText(
        "It must have minimum 4 and maximum 255 characters"
      );

      expect(errorMessage).toBeInTheDocument();
    });
    it("displays validation errors for file when update api fails", async () => {
      const { queryByText } = await setUpForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = queryByText("Save");
      fireEvent.click(saveButton);
      await waitForDomChange();

      const errorMessage = queryByText("Only PNG and JPG files are allowed");

      expect(errorMessage).toBeInTheDocument();
    });
  });
});
