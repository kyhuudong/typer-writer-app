import type { Lesson, LessonFilters } from "../../types/lesson";
import { filterLessons } from "../../lib/lessonCatalog";
import { LessonCard } from "./LessonCard";

type LessonGridProps = {
  lessons: Lesson[];
  filters?: LessonFilters;
  onSelectLesson?: (lesson: Lesson) => void;
  selectedLessonId?: string;
};

export function LessonGrid({
  lessons,
  filters,
  onSelectLesson,
  selectedLessonId
}: LessonGridProps) {
  const visibleLessons = filters ? filterLessons(lessons, filters) : lessons;

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {visibleLessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onSelect={onSelectLesson}
          selected={lesson.id === selectedLessonId}
        />
      ))}
    </div>
  );
}
