import { render, screen } from "@testing-library/react";
import { InputStage } from "./InputStage";

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

test("renders an empty state when no lesson is provided", () => {
  render(<InputStage lesson={null} />);

  expect(screen.getByText(/choose a lesson to begin/i)).toBeInTheDocument();
});
