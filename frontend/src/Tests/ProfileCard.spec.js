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
    it("displays edit button when isEditable property set as true", () => {
      const { queryByText } = render(
        <ProfileCard user={user} isEditable={true} />
      );
      const editButton = queryByText("Edit");
      expect(editButton).toBeInTheDocument();
    });
    it("does not display edit button when isEditable property not provided", () => {
      const { queryByText } = render(<ProfileCard user={user} />);
      const editButton = queryByText("Edit");
      expect(editButton).not.toBeInTheDocument();
    });

    it("displays displayName input when inEditMode property set as true", () => {
      const { container } = render(
        <ProfileCard user={user} inEditMode={true} />
      );
      const displayInput = container.querySelector("input");
      expect(displayInput).toBeInTheDocument();
    });

    it("displays file input when in Edit Mode is true", () => {
      const { container } = render(
        <ProfileCard user={user} inEditMode={true} />
      );

      const inputs = container.querySelectorAll("input");
      const uploadInput = inputs[1];
      expect(uploadInput.type).toBe("file");
    });
  });
});
