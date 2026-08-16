import { fireEvent, render, screen } from "@testing-library/react";
import { ProgressSummary } from "./ProgressSummary";
import { LessonGrid } from "../features/lessons/LessonGrid";
import { lessonCatalog } from "../lib/lessonCatalog";
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

test("renders progress as plain text rows", () => {
  render(
    <ProgressSummary
      progress={{
        username: "dong",
        lastLessonId: null,
        lessonSaveStates: {},
        streak: 5,
        totalWordsTyped: 1200,
        highestWpm: 68,
        averageAccuracy: 96.5,
        completedLessonIds: ["stoic_001"],
        history: [{ lessonId: "stoic_001", timestamp: "now", wpm: 60, accuracy: 95 }]
      }}
    />
  );

  expect(screen.getByText(/streak:/i)).toBeInTheDocument();
  expect(screen.getByText(/top wpm:/i)).toBeInTheDocument();
});

test("renders lessons as plain text rows", () => {
  render(
    <LessonGrid
      lessons={lessons}
      selectedLessonId="stoic_001"
      onSelectLesson={() => void 0}
    />
  );

  // Category header is always visible; expand it to see lesson cards.
  expect(screen.getAllByText(/stoicism/i).length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole("button", { name: /stoicism/i }));
  expect(screen.getByRole("button", { name: /control and perception/i })).toBeInTheDocument();
});

test("includes the long philosophy lesson in the catalog and list", () => {
  const longLesson = lessonCatalog.find((lesson) => lesson.id === "philo_long_001");

  expect(longLesson).toBeDefined();
  expect(longLesson?.text.split(/\s+/).length).toBeGreaterThan(3000);

  render(
    <LessonGrid
      lessons={lessonCatalog}
      selectedLessonId="philo_long_001"
      onSelectLesson={() => void 0}
    />
  );

  // Expand the Philosophy category to find the lesson card.
  fireEvent.click(screen.getByRole("button", { name: /philosophy/i }));
  expect(screen.getByRole("button", { name: /the long argument/i })).toBeInTheDocument();
});
