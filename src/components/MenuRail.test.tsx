import { render, screen } from "@testing-library/react";
import { SessionRail } from "./SessionRail";
import type { Lesson } from "../types/lesson";

const lessons: Lesson[] = [
  {
    id: "stoic_001",
    title: "Control and Perception",
    category: "Stoicism",
    difficulty: "Easy",
    image: "/images/stoic.jpg",
    text: "You have power over your mind."
  }
];

test("keeps menu items collapsed by default", () => {
  render(
    <SessionRail
      progress={null}
      lessons={lessons}
      selectedLessonId="stoic_001"
      onSelectLesson={() => void 0}
    />
  );

  const progressButton = screen.getByRole("button", { name: /progress/i });
  const lessonsButton = screen.getByRole("button", { name: /lessons/i });

  expect(progressButton).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(lessonsButton).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(progressButton).toHaveTextContent("");
  expect(lessonsButton).toHaveTextContent("");
});
