import {
  createDefaultProgressProfile,
  deserializeProgress,
  serializeProgress
} from "./progressFile";

test("round-trips progress data", () => {
  const original = {
    username: "dong",
    passwordHash: "hash",
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

test("creates a default progress profile", () => {
  expect(createDefaultProgressProfile("dong", "hash")).toEqual({
    username: "dong",
    passwordHash: "hash",
    streak: 0,
    totalWordsTyped: 0,
    highestWpm: 0,
    averageAccuracy: 0,
    completedLessonIds: [],
    history: []
  });
});
