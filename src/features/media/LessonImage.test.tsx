import { fireEvent, render, screen } from "@testing-library/react";
import { LessonImage } from "./LessonImage";

test("renders the provided image", () => {
  render(<LessonImage src="/cover.jpg" alt="Lesson cover" />);

  expect(screen.getByAltText("Lesson cover")).toBeInTheDocument();
});

test("falls back to a neutral card when the image errors", () => {
  render(<LessonImage src="/missing.jpg" alt="Lesson cover" />);

  fireEvent.error(screen.getByAltText("Lesson cover"));

  expect(screen.getByTestId("lesson-fallback")).toBeInTheDocument();
});
