import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { FocusStage } from "./FocusStage";

const speak = vi.fn();

vi.mock("../features/helpers/useTextToSpeech", () => ({
  useTextToSpeech: () => ({
    speak,
    supported: true,
    cancel: vi.fn()
  })
}));

const lesson = {
  id: "stoic_001",
  title: "Control and Perception",
  category: "Stoicism",
  difficulty: "Easy",
  image: "/images/stoic.jpg",
  text: "You have power over your mind."
};

test("shows a click-to-speak focus stage", () => {
  render(<FocusStage lesson={lesson} />);

  expect(
    screen.getByRole("button", { name: /speak lesson text/i })
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/typing surface/i)).toBeInTheDocument();
  expect(screen.getByText(/wpm/i)).toBeInTheDocument();
  expect(screen.getByText(/double-click any word below/i)).toBeInTheDocument();
});

test("speaks the lesson text when clicked", () => {
  render(<FocusStage lesson={lesson} />);

  screen.getByRole("button", { name: /speak lesson text/i }).click();

  expect(speak).toHaveBeenCalledWith(lesson.text);
});
