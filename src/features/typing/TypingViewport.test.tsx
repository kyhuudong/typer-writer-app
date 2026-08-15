import { fireEvent, render, screen } from "@testing-library/react";
import { TypingViewport } from "./TypingViewport";

test("renders a single typing surface", () => {
  render(<TypingViewport text="You have power." />);

  expect(screen.getByLabelText(/typing surface/i)).toBeInTheDocument();
});

test("updates the live text surface as typing changes", () => {
  render(<TypingViewport text="You have power." />);

  fireEvent.change(screen.getByLabelText(/typing surface/i), {
    target: { value: "You" }
  });

  const characters = screen.getAllByTestId("typing-char");
  expect(characters[0]).toHaveAttribute("data-state", "correct");
  expect(characters[1]).toHaveAttribute("data-state", "correct");
  expect(characters[2]).toHaveAttribute("data-state", "correct");
  expect(characters[3]).toHaveAttribute("data-state", "current");
});

test("scrolls the live surface to the bottom as text changes", () => {
  render(<TypingViewport text="You have power." />);

  const textarea = screen.getByLabelText(/typing surface/i);
  const viewport = textarea.parentElement?.parentElement as HTMLDivElement;

  Object.defineProperty(viewport, "scrollHeight", {
    configurable: true,
    value: 480
  });

  fireEvent.change(textarea, {
    target: { value: "You have power." }
  });

  expect(viewport.scrollTop).toBe(480);
});
