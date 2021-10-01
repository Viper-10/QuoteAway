import React from "react";
import { render } from "@testing-library/react";
import ProfileCard from "../components/ProfileCard";

const user = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
};
describe("ProfileCard", () => {
  describe("Layout", () => {
    it("displays the displayName@username", () => {
      const { queryByText } = render(<ProfileCard user={user} />);
      const userInfo = queryByText("display1@user1");
      expect(userInfo).toBeInTheDocument();
    });

    it("has image", () => {
      const { container } = render(<ProfileCard user={user} />);
      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
    });
  });
});
