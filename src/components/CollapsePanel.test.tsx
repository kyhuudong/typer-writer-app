import { fireEvent, render, screen } from "@testing-library/react";
import { CollapsePanel } from "./CollapsePanel";

test("toggles collapsed content", () => {
  render(
    <CollapsePanel title="Progress" description="Saved stats">
      <p>Hidden content</p>
    </CollapsePanel>
  );

  expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /progress/i }));

  expect(screen.getByText("Hidden content")).toBeInTheDocument();
});
