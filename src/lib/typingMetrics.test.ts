import {
  calculateAccuracy,
  calculateWpm,
  getCharacterStates
} from "./typingMetrics";

test("calculates wpm and accuracy from session data", () => {
  expect(calculateWpm({ typedWords: 60, elapsedMs: 60000 })).toBe(60);
  expect(calculateAccuracy({ correctChars: 96, totalChars: 100 })).toBe(96);
});

test("marks character states for typed and pending text", () => {
  expect(getCharacterStates("abc", "ab")).toEqual([
    { character: "a", state: "correct" },
    { character: "b", state: "correct" },
    { character: "c", state: "current" }
  ]);
});
