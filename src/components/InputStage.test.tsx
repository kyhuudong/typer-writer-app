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

test("renders an empty state when no lesson is provided", () => {
  render(<InputStage lesson={null} />);

  expect(screen.getByText(/choose a lesson to begin/i)).toBeInTheDocument();
});

test("clears saved and completed progress for the current lesson", () => {
  useAppStore.setState({
    currentUser: "dong",
    authStatus: "signed-in",
    progress: {
      username: "dong",
      lastLessonId: lesson.id,
      lessonSaveStates: {
        [lesson.id]: { typedText: "You", savedAt: "now" }
      },
      streak: 3,
      totalWordsTyped: 200,
      highestWpm: 70,
      averageAccuracy: 95,
      completedLessonIds: [lesson.id],
      history: [{ lessonId: lesson.id, timestamp: "now", wpm: 70, accuracy: 95 }]
    }
  });

  render(<InputStage lesson={lesson} />);

  expect(screen.getByLabelText(/typing surface/i)).toHaveValue(lesson.text);

  fireEvent.click(screen.getByRole("button", { name: /clear typed/i }));

  expect(screen.getByLabelText(/typing surface/i)).toHaveValue("");
  expect(useAppStore.getState().progress?.lessonSaveStates[lesson.id]).toBeUndefined();
  expect(useAppStore.getState().progress?.completedLessonIds).not.toContain(lesson.id);
  expect(useAppStore.getState().progress?.totalWordsTyped).toBe(200);
  expect(useAppStore.getState().progress?.history).toHaveLength(1);
});
