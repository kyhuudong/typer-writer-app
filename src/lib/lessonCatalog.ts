import lessonsData from "../../data/lessons.json";
import { buildLongPhilosophyLesson } from "./longPhilosophyLesson";
import type { Lesson, LessonFilters } from "../types/lesson";

export const lessonCatalog = loadLessons(lessonsData as Lesson[]);

export function loadLessons(input: Lesson[]): Lesson[] {
  return input.map((lesson) => {
    const raw =
      lesson.id === "philo_long_001"
        ? buildLongPhilosophyLesson()
        : lesson.text;
    // Keep every whitespace run at one character so indexes stay aligned.
    // Newlines are display-only; the typing target uses a normal space there.
    const displayText = raw.trim().replace(/\s+/g, (whitespace) =>
      whitespace.includes("\n") ? "\n" : " "
    );
    const text = displayText.replace(/\n/g, " ");
    return { ...lesson, text, displayText };
  });
}

export function filterLessons(lessons: Lesson[], filters: LessonFilters) {
  return lessons.filter((lesson) => {
    if (filters.category && lesson.category !== filters.category) {
      return false;
    }

    if (filters.difficulty && lesson.difficulty !== filters.difficulty) {
      return false;
    }

    return true;
  });
}

export function getLessonCategories(lessons: Lesson[]) {
  return Array.from(new Set(lessons.map((lesson) => lesson.category))).sort();
}
