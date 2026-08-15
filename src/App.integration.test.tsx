import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { lessonCatalog } from "./lib/lessonCatalog";

test("shows the typing stage first and keeps sessions collapsed by default", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /minimal typer/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/wpm/i).compareDocumentPosition(
      screen.getByLabelText(/typing surface/i)
    ) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(screen.getByText(/finish/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/typing surface/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /progress/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(screen.getByRole("button", { name: /lessons/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );

  fireEvent.change(screen.getByLabelText(/typing surface/i), {
    target: { value: "You" }
  });

  const activeCharacter = screen.getAllByTestId("typing-char")[3];
  expect(activeCharacter).toHaveClass("underline");
  expect(activeCharacter).toHaveClass("decoration-fuchsia-400");
  expect(
    lessonCatalog.find((lesson) => lesson.id === "philo_long_001")
  ).toBeDefined();
});
