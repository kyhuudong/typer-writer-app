import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { LoginForm } from "./LoginForm";

test("renders the sign in form", () => {
  render(<LoginForm onSubmit={vi.fn()} />);

  expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test("submits username and password", async () => {
  const onSubmit = vi.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: "dong" }
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "secret" }
  });
  fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    username: "dong",
    password: "secret"
  });
});
