import { fireEvent, render, screen } from "@testing-library/react";
import { TypingSession } from "./TypingSession";

test("renders live typing feedback", () => {
  render(<TypingSession text="You have power." title="Control and Perception" />);

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "You" }
  });

  const characters = screen.getAllByTestId("typing-char");
  expect(characters[0]).toHaveAttribute("data-state", "correct");
  expect(characters[1]).toHaveAttribute("data-state", "correct");
  expect(characters[2]).toHaveAttribute("data-state", "correct");
  expect(characters[3]).toHaveAttribute("data-state", "current");
});

test("shows completion state when the target text is matched", () => {
  render(<TypingSession text="Hi" title="Greeting" />);

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "Hi" }
  });

  expect(screen.getByText(/completed/i)).toBeInTheDocument();
});
