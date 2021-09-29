import React from "react";
import { render } from "@testing-library/react";
import UserListItem from "../components/UserListItem";

const user = {
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
};
describe("UserListItem", () => {
  it("has image", () => {
    const { container } = render(<UserListItem user={user} />);
    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
  });
  it("displays default image when user does not have one", () => {
    const userWithoutImage = {
      ...user,
      image: undefined,
    };
    const { container } = render(<UserListItem user={userWithoutImage} />);
    const image = container.querySelector("img");
    expect(image.src).toContain("/profile.png");
  });
  it("displays user image when user has one", () => {
    const { container } = render(<UserListItem user={user} />);
    const image = container.querySelector("img");
    expect(image.src).toContain("/images/profile/" + user.image);
  });
});
