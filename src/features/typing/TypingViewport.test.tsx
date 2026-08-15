import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
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
  expect(characters[3]).toHaveClass("underline");
  expect(characters[3]).toHaveClass("decoration-fuchsia-400");
});

test("scrolls the live surface to the active character as text changes", () => {
  render(<TypingViewport text="You have power." />);

  const textarea = screen.getByLabelText(/typing surface/i);
  const scrollIntoView = vi.fn();
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scrollIntoView
  });

  fireEvent.change(textarea, {
    target: { value: "You" }
  });

  expect(scrollIntoView).toHaveBeenCalled();
});

test("speaks the lesson when the surface is clicked", () => {
  const onSpeak = vi.fn();
  render(<TypingViewport text="You have power." onSpeak={onSpeak} />);

  fireEvent.click(screen.getByLabelText(/typing surface/i));

  expect(onSpeak).toHaveBeenCalled();
});
