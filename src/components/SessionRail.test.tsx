import { render, screen } from "@testing-library/react";
import { SessionRail } from "./SessionRail";
import type { Lesson } from "../types/lesson";
import type { TypingSessionSummary } from "../features/typing/useTypingSession";

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

const summary: TypingSessionSummary = {
  typedWords: 0,
  correctChars: 0,
  totalChars: 31,
  elapsedMs: 0,
  wpm: 0,
  accuracy: 0
};

test("keeps secondary sessions collapsed by default", () => {
  render(
    <SessionRail
      progress={null}
      lessons={lessons}
      selectedLessonId="stoic_001"
      onSelectLesson={() => void 0}
      typingSummary={summary}
      lessonText={lessons[0].text}
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
  expect(screen.getByRole("button", { name: /live stats/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(screen.getByRole("button", { name: /study tools/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
});
