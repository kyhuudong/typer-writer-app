import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows the minimalist shell for a fresh user", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /minimal typer/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /choose a paragraph/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/sign in to save your streak/i)).toBeInTheDocument();
});
