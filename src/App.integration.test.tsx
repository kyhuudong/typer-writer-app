import { render, screen } from "@testing-library/react";
import App from "./App";

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
  expect(screen.getByLabelText(/typing surface/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /progress/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  expect(screen.getByRole("button", { name: /lessons/i })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
});
