import React from "react";
import {
  render,
  waitFor,
  waitForDomChange,
  waitForElement,
} from "@testing-library/react";
import UserList from "../Components/UserList";
import * as apiCalls from "../ApiRequests/apiCalls";

const setup = () => {
  return render(<UserList />);
};
apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});
const mockedEmptySuccessResponse = {
  data: {
    content: [],
    number: 0,
    size: 3,
  },
};

const mockSuccessGetSinglePage = {
  data: {
    content: [
      {
        username: "user1",
        displayName: "display1",
        image: "",
      },
      {
        username: "user2",
        displayName: "display2",
        image: "",
      },
      {
        username: "user3",
        displayName: "display3",
        image: "",
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 3,
    totalPages: 1,
  },
};
const mockSuccessGetMultiPageFirst = {
  data: {
    content: [
      {
        username: "user1",
        displayName: "display1",
        image: "",
      },
      {
        username: "user2",
        displayName: "display2",
        image: "",
      },
      {
        username: "user3",
        displayName: "display3",
        image: "",
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 3,
    totalPages: 2,
  },
};
describe("UserList", () => {
  describe("Layout", () => {
    it("has header of Users", () => {
      const { container } = setup();
      const header = container.querySelector("h3");

      expect(header).toHaveTextContent("Users");
    });

    it("displays three items when listUser api returns three users", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetSinglePage);

      const { queryByTestId } = setup();
      await waitForDomChange();

      const userGroup = queryByTestId("usergroup");
      expect(userGroup.childElementCount).toBe(3);
    });

    it("displays the displayName@username when listUser api returns users", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetSinglePage);

      const { queryByText } = setup();
      const firstUser = await waitForElement(() =>
        queryByText("display1@user1")
      );

      expect(firstUser).toBeInTheDocument();
    });
    it("displays the next button when response has last value as false", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetMultiPageFirst);

      const { queryByText } = setup();
      const nextLink = await waitForElement(() => queryByText("next >"));

      expect(nextLink).toBeInTheDocument();
    });
  });
  describe("Lifecycle", () => {
    it("calls listUsers api when it is rendered", () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockedEmptySuccessResponse);

      setup();
      expect(apiCalls.listUsers).toHaveBeenCalledTimes(1);
    });
    it("calls listUsers method with page zero and size three when it is rendered", () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockedEmptySuccessResponse);

      setup();
      expect(apiCalls.listUsers).toHaveBeenCalledWith({ page: 0, size: 3 });
    });
  });
});
console.error = () => {};
