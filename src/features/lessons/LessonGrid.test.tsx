import { render, screen } from "@testing-library/react";
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

test("renders lesson cards", () => {
  render(<LessonGrid lessons={lessons} />);

  expect(
    screen.getByRole("heading", { name: /control and perception/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /orbital mechanics/i })
  ).toBeInTheDocument();
});

test("applies category filters", () => {
  render(<LessonGrid lessons={lessons} filters={{ category: "Science" }} />);

  expect(
    screen.queryByRole("heading", { name: /control and perception/i })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /orbital mechanics/i })
  ).toBeInTheDocument();
});
