import "@testing-library/jest-dom/extend-expect";
import { cleanup, render } from "@testing-library/react";
import Input from "../components/Input";

describe("Input box", () => {
  describe("Layout", () => {
    it("has input field", () => {
      const { container } = render(<Input />);
      const input = container.querySelector("input");
      expect(input).toBeInTheDocument();
    });
    it("has input field has type text", () => {
      const { container } = render(<Input type="text" />);
      const input = container.querySelector("input");
      expect(input.type).toBe("text");
    });

    it("has input field has type password", () => {
      const { container } = render(<Input type="password" />);
      const input = container.querySelector("input");
      expect(input.type).toBe("password");
    });
    it("takes placeholder", () => {
      const { queryByPlaceholderText } = render(
        <Input type="text" placeholder="Your display name" />
      );
      const input = queryByPlaceholderText("Your display name");
      expect(input).toBeInTheDocument();
    });

    it("has form-control-file class when type is file", () => {
      const { container } = render(<Input type="file" />);
      const input = container.querySelector("input");
      expect(input.className).toBe("form-control-file");
    });
  });
});
