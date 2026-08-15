import lessonsData from "../../data/lessons.json";
import type { Lesson, LessonFilters } from "../types/lesson";

export const lessonCatalog = loadLessons(lessonsData as Lesson[]);

export function loadLessons(input: Lesson[]): Lesson[] {
  return input.map((lesson) => ({ ...lesson }));
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
