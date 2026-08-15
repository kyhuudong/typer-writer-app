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

test("keeps secondary sessions collapsed by default", () => {
  render(
    <SessionRail
      progress={null}
      lessons={lessons}
      selectedLessonId="stoic_001"
      onSelectLesson={() => void 0}
    />
  );

  expect(screen.getByRole("button", { name: /progress/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(screen.getByRole("button", { name: /lessons/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(screen.getByRole("button", { name: /tools/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
});
