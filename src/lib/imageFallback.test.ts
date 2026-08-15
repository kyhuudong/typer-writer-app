import { getLessonImageSrc } from "./imageFallback";

test("returns the fallback image when the lesson image is empty", () => {
  expect(getLessonImageSrc("")).toBe("/images/fallback-card.jpg");
});
