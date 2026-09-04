import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { SessionRail } from "./SessionRail";
import type { Lesson, LessonCollection } from "../types/lesson";

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

const collections: LessonCollection[] = [
  {
    id: "stoicism",
    title: "Stoicism",
    description: "Practice Stoic ideas.",
    lessons
  },
  {
    id: "science",
    title: "Science",
    description: "Practice science ideas.",
    lessons: []
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
});

test("forwards a selected collection without changing lesson progress", () => {
  const onSelectCollection = vi.fn();
  render(
    <SessionRail
      progress={null}
      collections={collections}
      selectedCollectionId="stoicism"
      onSelectCollection={onSelectCollection}
      lessons={lessons}
      selectedLessonId="stoic_001"
      onSelectLesson={() => void 0}
      onResumeLesson={() => void 0}
    />
  );

  expect(screen.getByRole("button", { name: /collections/i }))
    .toHaveAttribute("aria-expanded", "true");
  fireEvent.click(screen.getByRole("button", { name: /science/i }));

  expect(onSelectCollection).toHaveBeenCalledWith("science");
});
