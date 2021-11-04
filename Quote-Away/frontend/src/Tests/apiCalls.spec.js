import { assertOptionalCallExpression } from "@babel/types";
import axios from "axios";
import * as apiCalls from "../ApiRequests/apiCalls";

describe("apicalls", () => {
  describe("signup", () => {
    it("calls /api/1.0/users", () => {
      const mockSignup = jest.fn();
      axios.post = mockSignup;
      apiCalls.signup();

      const path = mockSignup.mock.calls[0][0];
      expect(path).toBe("api/1.0/users");
    });
  });
  describe("login", () => {
    it("calls /api/1.0/login", () => {
      const mockLogin = jest.fn();
      axios.post = mockLogin;
      apiCalls.login({ username: "test-user", password: "P4ssword$" });
      const path = mockLogin.mock.calls[0][0];
      expect(path).toBe("api/1.0/login");
    });
  });

  describe("listUser", () => {
    it("calls /api/1.0/users?page=0&size=3 when no param provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers();

      expect(mockListUsers).toBeCalledWith("/api/1.0/users?page=0&size=3");
    });
    it("calls /api/1.0/users?page=5&size=10 when params are provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ page: 5, size: 10 });

      expect(mockListUsers).toBeCalledWith("/api/1.0/users?page=5&size=10");
    });
    it("calls /api/1.0/users?page=5&size=3 when size is not  provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ page: 5 });

      expect(mockListUsers).toBeCalledWith("/api/1.0/users?page=5&size=3");
    });
    it("calls /api/1.0/users?page=0&size=5 when page is not  provided for listUsers", () => {
      const mockListUsers = jest.fn();
      axios.get = mockListUsers;
      apiCalls.listUsers({ size: 5 });

      expect(mockListUsers).toBeCalledWith("/api/1.0/users?page=0&size=5");
    });
  });

  describe("getUser", () => {
    it("calls /api/1.0/users/user5 when user5 is provided for getUser", () => {
      const mockGetUser = jest.fn();
      axios.get = mockGetUser;
      apiCalls.getUser("user5");
      expect(mockGetUser).toBeCalledWith("/api/1.0/users/user5");
    });
  });
  describe("updateUser", () => {
    it("calls /api/1.0/users/5 when 5 is provided for updateUser", () => {
      const mockUpdateUser = jest.fn();
      axios.put = mockUpdateUser;
      apiCalls.updateUser("5");
      const path = mockUpdateUser.mock.calls[0][0];
      expect(path).toBe("/api/1.0/users/5");
    });
  });

  describe("postQuote", () => {
    it("calls /api/1.0/quotes", () => {
      const mockPostQuote = jest.fn();
      axios.post = mockPostQuote;

      apiCalls.postQuote();

      const path = mockPostQuote.mock.calls[0][0];
      expect(path).toBe("/api/1.0/quotes");
    });
  });

  describe("loadQuotes", () => {
    it("calls /api/1.0/quotes?page=0&size=5&sord=id,desc when no param provided", () => {
      const mockGetQuotes = jest.fn();
      axios.get = mockGetQuotes;
      apiCalls.loadQuotes();

      expect(mockGetQuotes).toBeCalledWith(
        "/api/1.0/quotes?page=0&size=5&sort=id,desc"
      );
    });

    it("calls /api/1.0/users/user1/quotes?page=0&size=5&sord=id,desc when no param provided", () => {
      const mockGetQuotes = jest.fn();
      axios.get = mockGetQuotes;
      apiCalls.loadQuotes("user1");

      expect(mockGetQuotes).toBeCalledWith(
        "/api/1.0/users/user1/quotes?page=0&size=5&sort=id,desc"
      );
    });
  });
  describe("loadOldQuotes", () => {
    it("calls /api/1.0/quotes/5?direction=before&page=0&size=5&sort=id,desc when quote id param provided", () => {
      const mockGetQuotes = jest.fn();
      axios.get = mockGetQuotes;
      apiCalls.loadOldQuotes(5);

      expect(mockGetQuotes).toBeCalledWith(
        "/api/1.0/quotes/5?direction=before&page=0&size=5&sort=id,desc"
      );
    });

    it("calls /api/1.0/quotes/5?direction=before&page=0&size=5&sort=id,desc when quote id param provided", () => {
      const mockGetQuotes = jest.fn();
      axios.get = mockGetQuotes;
      apiCalls.loadOldQuotes(5, "user3");

      expect(mockGetQuotes).toBeCalledWith(
        "/api/1.0/users/user3/quotes/5?direction=before&page=0&size=5&sort=id,desc"
      );
    });
  });
  describe("loadNewQuotes", () => {
    it("calls /api/1.0/quotes/5?direction=after&sort=id,desc when quote id param provided", () => {
      const mockGetQuotes = jest.fn();
      axios.get = mockGetQuotes;
      apiCalls.loadNewQuotes(5);

      expect(mockGetQuotes).toBeCalledWith(
        "/api/1.0/quotes/5?direction=after&sort=id,desc"
      );
    });

    it("calls /api/1.0/users/user3/quotes/5?direction=after&sort=id,desc when quote id param provided", () => {
      const mockGetQuotes = jest.fn();
      axios.get = mockGetQuotes;
      apiCalls.loadNewQuotes(5, "user3");

      expect(mockGetQuotes).toBeCalledWith(
        "/api/1.0/users/user3/quotes/5?direction=after&sort=id,desc"
      );
    });
  });
  describe("loadNewQuoteCount", () => {
    it("calls /api/1.0/quotes/5?direction=after&count=true when quote id param provided", () => {
      const mockGetQuotes = jest.fn();
      axios.get = mockGetQuotes;
      apiCalls.loadNewQuoteCount(5);

      expect(mockGetQuotes).toBeCalledWith(
        "/api/1.0/quotes/5?direction=after&count=true"
      );
    });

    it("calls /api/1.0/users/user3/quotes/5?direction=after&count=true when quote id param provided", () => {
      const mockGetQuotes = jest.fn();
      axios.get = mockGetQuotes;
      apiCalls.loadNewQuoteCount(5, "user3");

      expect(mockGetQuotes).toBeCalledWith(
        "/api/1.0/users/user3/quotes/5?direction=after&count=true"
      );
    });
  });
  describe("deleteQuote", () => {
    it("calls /api/1.0/quotes/5 when quote id param provided as 5", () => {
      const mockDelete = jest.fn();
      axios.delete = mockDelete;
      apiCalls.deleteQuote(5);
      const path = mockDelete.mock.calls[0][0];
      expect(path).toBe("/api/1.0/quotes/5");
    });
  });
});
