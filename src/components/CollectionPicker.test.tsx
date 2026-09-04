import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CollectionPicker } from "./CollectionPicker";

const collections = [
  {
    id: "science",
    title: "Science",
    description: "Practice science ideas.",
    lessons: []
  },
  {
    id: "stoicism",
    title: "Stoicism",
    description: "Practice Stoic ideas.",
    lessons: [{ id: "stoic_001" }]
  }
];

test("renders collection metadata and selects a collection", () => {
  const onSelect = vi.fn();
  render(
    <CollectionPicker
      collections={collections}
      selectedCollectionId="stoicism"
      onSelectCollection={onSelect}
    />
  );

  expect(screen.getByText("Practice Stoic ideas.")).toBeInTheDocument();
  expect(screen.getByText("1 lesson")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /stoicism/i }))
    .toHaveAttribute("aria-pressed", "true");

  fireEvent.click(screen.getByRole("button", { name: /science/i }));

  expect(onSelect).toHaveBeenCalledWith("science");
});
