import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { LessonNavigator } from "./LessonNavigator";

test("shows category position and disables navigation at the first lesson", () => {
  render(
    <LessonNavigator
      collectionTitle="English Practice"
      category="English"
      currentIndex={0}
      totalLessons={3}
      hasPrevious={false}
      hasNext
      isCurrentLessonComplete={false}
      onPrevious={vi.fn()}
      onNext={vi.fn()}
    />
  );

  expect(screen.getByText("English Practice · English · 1 of 3"))
    .toBeInTheDocument();
  expect(screen.getByRole("button", { name: /previous lesson/i }))
    .toBeDisabled();
  expect(screen.getByRole("button", { name: /next lesson/i }))
    .toBeEnabled();
});

test("emphasizes Next after completion without advancing automatically", () => {
  const onNext = vi.fn();
  render(
    <LessonNavigator
      collectionTitle="English Practice"
      category="English"
      currentIndex={1}
      totalLessons={3}
      hasPrevious
      hasNext
      isCurrentLessonComplete
      onPrevious={vi.fn()}
      onNext={onNext}
    />
  );

  const next = screen.getByRole("button", { name: /next lesson/i });
  expect(next).toHaveClass("bg-fuchsia-500");
  expect(onNext).not.toHaveBeenCalled();

  fireEvent.click(next);
  expect(onNext).toHaveBeenCalledTimes(1);
});
