import { buildLongPhilosophyLesson } from "./longPhilosophyLesson";
import type { Lesson, LessonCollection, LessonFilters } from "../types/lesson";

const collectionModules = import.meta.glob("../../data/*.json", {
  eager: true,
  import: "default"
});

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

function isLessonCollection(value: unknown): value is LessonCollection {
  if (!value || typeof value !== "object") return false;
  const collection = value as Partial<LessonCollection>;
  return (
    typeof collection.id === "string" &&
    typeof collection.title === "string" &&
    typeof collection.description === "string" &&
    Array.isArray(collection.lessons)
  );
}

export function loadLessonCollections(input: unknown[]): LessonCollection[] {
  const lessonIds = new Set<string>();

  return input
    .map((collection) => {
      if (!isLessonCollection(collection)) {
        throw new Error("Invalid lesson collection: expected id, title, description, and lessons.");
      }

      const lessons = loadLessons(collection.lessons);
      for (const lesson of lessons) {
        if (lessonIds.has(lesson.id)) {
          throw new Error(`Duplicate lesson ID: ${lesson.id}`);
        }
        lessonIds.add(lesson.id);
      }
      return { ...collection, lessons };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export const lessonCollections = loadLessonCollections(Object.values(collectionModules));
export const lessonCatalog = lessonCollections.flatMap((collection) => collection.lessons);

export function findLessonCollection(
  collections: LessonCollection[],
  lessonId: string | null | undefined
) {
  return collections.find((collection) =>
    collection.lessons.some((lesson) => lesson.id === lessonId)
  );
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
