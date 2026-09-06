import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { TypingViewport } from "./TypingViewport";

// Mock speakText so no real speech synthesis fires in tests.
vi.mock("../helpers/useTextToSpeech", () => ({
  speakText: vi.fn(),
  useTextToSpeech: () => ({ speak: vi.fn(), supported: true, cancel: vi.fn() })
}));

test("renders a single typing surface", () => {
  const { container } = render(<TypingViewport text="You have power." />);

  expect(screen.getByLabelText(/typing surface/i)).toBeInTheDocument();
  expect(container.firstElementChild).not.toHaveClass("overflow-auto");
  expect(container.firstElementChild?.className).not.toContain("max-h-");
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

test("renders a visual line break while a normal space advances typing", () => {
  const { container } = render(
    <TypingViewport text="First Second" displayText={"First\nSecond"} />
  );

  expect(container.querySelector("br")).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/typing surface/i), {
    target: { value: "First " }
  });

  expect(
    container.querySelector('[data-absolute-index="6"]')
  ).toHaveAttribute("data-state", "current");
});

test("restores a space-only saved session at a visual line break", () => {
  const { container } = render(
    <TypingViewport
      text="First Second"
      displayText={"First\nSecond"}
      initialTypedText="First "
    />
  );

  expect(container.querySelector("br")).toBeInTheDocument();
  expect(
    container.querySelector('[data-absolute-index="6"]')
  ).toHaveAttribute("data-state", "current");
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

  const selectedChars = screen.getAllByTestId("typing-char");
  const marker = selectedChars[0].parentElement;
  expect(marker?.tagName).toBe("MARK");
  expect(marker).toHaveClass("bg-fuchsia-400/70");
  expect(selectedChars[3].parentElement).toBe(marker);
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

test("Command+Delete requests clearing typed text and prevents browser default", () => {
  const onClearRequest = vi.fn();
  render(
    <TypingViewport
      text="You have power."
      initialTypedText="You"
      onClearRequest={onClearRequest}
    />
  );

  expect(
    fireEvent.keyDown(window, { key: "Delete", metaKey: true, cancelable: true })
  ).toBe(false);
  expect(onClearRequest).toHaveBeenCalledTimes(1);
});

test("reset token clears typed text and returns the caret to the beginning", () => {
  const { rerender } = render(
    <TypingViewport text="You have power." initialTypedText="You" resetToken={0} />
  );

  const textarea = screen.getByLabelText(/typing surface/i) as HTMLTextAreaElement;
  expect(textarea.value).toBe("You");

  rerender(
    <TypingViewport text="You have power." initialTypedText="You" resetToken={1} />
  );

  expect(textarea.value).toBe("");
  expect(textarea.selectionStart).toBe(0);
  expect(textarea).toHaveFocus();
});
