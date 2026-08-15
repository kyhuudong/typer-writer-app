import {
  calculateAccuracy,
  calculateCompletionPercent,
  calculateWpm,
  getCharacterStates
} from "./typingMetrics";

test("calculates wpm and accuracy from session data", () => {
  expect(calculateWpm({ correctChars: 300, elapsedMs: 60000 })).toBe(60);
  expect(calculateAccuracy({ correctChars: 96, totalChars: 100 })).toBe(96);
  expect(calculateCompletionPercent({ typedChars: 45, totalChars: 60 })).toBe(75);
});

test("marks character states for typed and pending text", () => {
  expect(getCharacterStates("abc", "ab")).toEqual([
    { character: "a", state: "correct" },
    { character: "b", state: "correct" },
    { character: "c", state: "current" }
  ]);
});
