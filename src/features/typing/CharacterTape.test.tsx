import { render, screen } from "@testing-library/react";
import { CharacterTape } from "./CharacterTape";

test("wraps a selected phrase including spaces in one continuous marker", () => {
  render(
    <CharacterTape
      characters={[
        { character: "H", state: "correct", absoluteIndex: 0 },
        { character: "i", state: "correct", absoluteIndex: 1 },
        { character: " ", state: "pending", absoluteIndex: 2 },
        { character: "a", state: "pending", absoluteIndex: 3 },
        { character: "l", state: "pending", absoluteIndex: 4 },
        { character: "l", state: "pending", absoluteIndex: 5 }
      ]}
      selectionRange={{ start: 0, end: 3 }}
    />
  );

  const chars = screen.getAllByTestId("typing-char");
  const marker = chars[0].parentElement;

  expect(marker?.tagName).toBe("MARK");
  expect(marker).toHaveClass("bg-fuchsia-400/70");
  expect(chars[1].parentElement).toBe(marker);
  expect(chars[2].parentElement).toBe(marker);
  expect(chars[3].parentElement).toBe(marker);
  expect(chars[4].parentElement).not.toBe(marker);
});
