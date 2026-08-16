import { fireEvent, render, screen } from "@testing-library/react";
import { LessonGrid } from "./LessonGrid";
import type { Lesson } from "../../types/lesson";

const lessons: Lesson[] = [
  {
    id: "stoic_001",
    title: "Control and Perception",
    category: "Stoicism",
    difficulty: "Easy",
    image: "/images/stoic.jpg",
    text: "You have power over your mind."
  },
  {
    id: "sci_001",
    title: "Orbital Mechanics",
    category: "Science",
    difficulty: "Medium",
    image: "/images/space.jpg",
    text: "Bodies move in stable paths."
  }
];

test("renders lesson cards after expanding category", () => {
  render(<LessonGrid lessons={lessons} />);

  // Categories are collapsed by default — expand Stoicism first.
  fireEvent.click(screen.getByRole("button", { name: /stoicism/i }));
  expect(
    screen.getByRole("button", { name: /control and perception/i })
  ).toBeInTheDocument();
  // Science category is still collapsed.
  expect(
    screen.queryByRole("button", { name: /orbital mechanics/i })
  ).not.toBeInTheDocument();
});

test("applies category filters", () => {
  render(<LessonGrid lessons={lessons} filters={{ category: "Science" }} />);

  // Stoicism is filtered out — its header should not be present.
  expect(
    screen.queryByRole("button", { name: /stoicism/i })
  ).not.toBeInTheDocument();
  // Science header exists; expand it to see the lesson.
  fireEvent.click(screen.getByRole("button", { name: /science/i }));
  expect(
    screen.getByRole("button", { name: /orbital mechanics/i })
  ).toBeInTheDocument();
});
