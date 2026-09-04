import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { TypingViewport } from "./TypingViewport";

// Mock speakText so no real speech synthesis fires in tests.
vi.mock("../helpers/useTextToSpeech", () => ({
  speakText: vi.fn(),
  useTextToSpeech: () => ({ speak: vi.fn(), supported: true, cancel: vi.fn() })
}));

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

test("each character span has a data-absolute-index attribute", () => {
  render(<TypingViewport text="You have power." />);

  const chars = screen.getAllByTestId("typing-char");
  chars.forEach((span, i) => {
    expect(span).toHaveAttribute("data-absolute-index", String(i));
  });
});

test("shows selection feedback before pointer release while dragging across text", () => {
  render(<TypingViewport text="You have power." />);

  const textarea = screen.getByLabelText(/typing surface/i);
  const chars = screen.getAllByTestId("typing-char");
  Object.defineProperty(document, "elementFromPoint", {
    configurable: true,
    value: vi.fn()
      .mockReturnValueOnce(chars[0])
      .mockReturnValueOnce(chars[3])
  });
  Object.defineProperty(textarea, "setPointerCapture", {
    configurable: true,
    value: vi.fn()
  });

  fireEvent.pointerDown(textarea, { button: 0, clientX: 10, clientY: 10, pointerId: 1 });
  fireEvent.pointerMove(textarea, { clientX: 40, clientY: 10, pointerId: 1 });

  expect(chars[0]).toHaveClass("bg-fuchsia-500/45");
  expect(chars[3]).toHaveClass("bg-fuchsia-500/45");
});

test("Escape refocuses the typing surface", () => {
  render(<TypingViewport text="You have power." />);

  const textarea = screen.getByLabelText(/typing surface/i);
  const otherElement = document.createElement("button");
  document.body.append(otherElement);
  otherElement.focus();

  fireEvent.keyDown(window, { key: "Escape" });

  expect(textarea).toHaveFocus();
  otherElement.remove();
});
