import type { Lesson, LessonFilters } from "../../types/lesson";
import { filterLessons, getLessonCategories } from "../../lib/lessonCatalog";
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
  const categories = getLessonCategories(visibleLessons);

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const group = visibleLessons.filter((l) => l.category === category);
        return (
          <div key={category}>
            <p className="mb-1.5 px-1 text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              {category}
            </p>
            <div className="space-y-0.5">
              {group.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onSelect={onSelectLesson}
                  selected={lesson.id === selectedLessonId}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
