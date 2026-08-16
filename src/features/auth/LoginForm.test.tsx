import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { LoginForm } from "./LoginForm";

test("renders the start form for new users", () => {
  render(<LoginForm onImportFile={vi.fn()} />);

  expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
});
