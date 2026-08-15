import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { InputStage } from "./InputStage";

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

test("renders the input surface and transparent stats", () => {
  render(<InputStage lesson={lesson} />);

  expect(screen.getByText(/finish/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/typing surface/i)).toBeInTheDocument();
  expect(screen.getByText(/wpm/i)).toBeInTheDocument();
});

test("speaks the lesson text when the typing surface is clicked", () => {
  render(<InputStage lesson={lesson} />);

  screen.getByLabelText(/typing surface/i).click();

  expect(speak).toHaveBeenCalledWith(lesson.text);
});
