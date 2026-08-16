import {
  createDefaultProgressProfile,
  deserializeProgress,
  serializeProgress
} from "./progressFile";

test("round-trips progress data", () => {
  const original = {
    username: "dong",
    lastLessonId: "stoic_001",
    streak: 5,
    totalWordsTyped: 1200,
    highestWpm: 68,
    averageAccuracy: 96.5,
    completedLessonIds: ["stoic_001"],
    history: [
      {
        lessonId: "stoic_001",
        timestamp: "2026-08-15T07:00:00.000Z",
        wpm: 62,
        accuracy: 98.2
      }
    ]
  };

  expect(deserializeProgress(serializeProgress(original))).toEqual(original);
});

test("old JSON with passwordHash imports cleanly", () => {
  // Backward compat: passwordHash field in old exports is ignored
  const oldJson = JSON.stringify({
    username: "dong",
    passwordHash: "someoldhash",
    streak: 3,
    totalWordsTyped: 0,
    highestWpm: 0,
    averageAccuracy: 0,
    completedLessonIds: [],
    history: []
  });
  const profile = deserializeProgress(oldJson);
  expect(profile.username).toBe("dong");
  expect(profile.streak).toBe(3);
  // passwordHash must not appear in the profile
  expect("passwordHash" in profile).toBe(false);
});

test("creates a default progress profile", () => {
  expect(createDefaultProgressProfile("dong")).toEqual({
    username: "dong",
    lastLessonId: null,
    streak: 0,
    totalWordsTyped: 0,
    highestWpm: 0,
    averageAccuracy: 0,
    completedLessonIds: [],
    history: []
  });
});
