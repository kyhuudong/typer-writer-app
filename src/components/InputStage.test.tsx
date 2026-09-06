import { fireEvent, render, screen } from "@testing-library/react";
import { InputStage } from "./InputStage";
import { useAppStore } from "../store/useAppStore";

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

test("keeps typing stats and actions sticky while page content scrolls", () => {
  render(<InputStage lesson={lesson} />);

  expect(screen.getByTestId("typing-session-toolbar")).toHaveClass("sticky");
});

test("renders an empty state when no lesson is provided", () => {
  render(<InputStage lesson={null} />);

  expect(screen.getByText(/choose a lesson to begin/i)).toBeInTheDocument();
});

test("clears saved and completed progress for the current lesson only, keeping other lessons and history", () => {
  const otherLessonId = "stoic_002";
  useAppStore.setState({
    currentUser: "dong",
    authStatus: "signed-in",
    progress: {
      username: "dong",
      lastLessonId: lesson.id,
      lessonSaveStates: {
        [lesson.id]: { typedText: "You", savedAt: "now" },
        [otherLessonId]: { typedText: "Some other draft", savedAt: "now" }
      },
      streak: 3,
      totalWordsTyped: 200,
      highestWpm: 70,
      averageAccuracy: 95,
      completedLessonIds: [lesson.id, otherLessonId],
      history: [
        { lessonId: lesson.id, timestamp: "now", wpm: 70, accuracy: 95 },
        { lessonId: otherLessonId, timestamp: "earlier", wpm: 80, accuracy: 98 }
      ]
    }
  });

  render(<InputStage lesson={lesson} />);

  expect(screen.getByLabelText(/typing surface/i)).toHaveValue(lesson.text);

  const clearButton = screen.getByRole("button", { name: /delete/i });
  expect(clearButton).toHaveTextContent("⌘");
  expect(clearButton).toHaveTextContent("Delete");

  fireEvent.click(clearButton);

  expect(screen.getByLabelText(/typing surface/i)).toHaveValue("");

  const progress = useAppStore.getState().progress;
  // Current lesson draft and completion cleared
  expect(progress?.lessonSaveStates[lesson.id]).toBeUndefined();
  expect(progress?.completedLessonIds).not.toContain(lesson.id);

  // Other lesson draft and completion preserved
  expect(progress?.lessonSaveStates[otherLessonId]).toEqual({
    typedText: "Some other draft",
    savedAt: "now"
  });
  expect(progress?.completedLessonIds).toContain(otherLessonId);

  // Lifetime statistics and full history preserved
  expect(progress?.streak).toBe(3);
  expect(progress?.totalWordsTyped).toBe(200);
  expect(progress?.highestWpm).toBe(70);
  expect(progress?.averageAccuracy).toBe(95);
  expect(progress?.history).toHaveLength(2);
});
