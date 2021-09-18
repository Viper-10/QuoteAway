import React from "react";
import { render } from "@testing-library/react";
import UserPage from "../pages/UserPage";

describe("User page", () => {
  describe("Layout", () => {
    it("has root page div", () => {
      const { queryByTestId } = render(<UserPage />);
      const userPageDiv = queryByTestId("userpage");
      expect(userPageDiv).toBeInTheDocument();
    });
  });
});
