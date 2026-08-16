import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { lessonCatalog } from "./lib/lessonCatalog";

test("shows the typing stage first with slide sidebar hidden by default", () => {
  render(<App />);

  // Heading and typing surface are visible immediately.
  expect(
    screen.getByRole("heading", { name: /minimal typer/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/finish/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/typing surface/i)).toBeInTheDocument();

  // Stats sit above the typing surface.
  expect(
    screen.getByText(/wpm/i).compareDocumentPosition(
      screen.getByLabelText(/typing surface/i)
    ) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();

  // Hamburger button is always visible; sidebar is closed by default.
  expect(screen.getByRole("button", { name: /open sidebar/i })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /progress/i })).toBeNull();

  // Opening the sidebar reveals Progress and Lessons collapse panels.
  fireEvent.click(screen.getByRole("button", { name: /open sidebar/i }));
  expect(screen.getByRole("button", { name: /progress/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(screen.getByRole("button", { name: /lessons/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );

  // Cursor and long lesson sanity checks.
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
