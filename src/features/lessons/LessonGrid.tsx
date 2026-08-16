import { useState } from "react";
import type { Lesson, LessonFilters } from "../../types/lesson";
import { filterLessons, getLessonCategories } from "../../lib/lessonCatalog";
import { LessonCard } from "./LessonCard";

type LessonGridProps = {
  lessons: Lesson[];
  filters?: LessonFilters;
  onSelectLesson?: (lesson: Lesson) => void;
  selectedLessonId?: string;
  completedIds?: string[];
  inProgressMap?: Record<string, number>;
};

export function LessonGrid({
  lessons,
  filters,
  onSelectLesson,
  selectedLessonId,
  completedIds = [],
  inProgressMap = {}
}: LessonGridProps) {
  const visibleLessons = filters ? filterLessons(lessons, filters) : lessons;
  const categories = getLessonCategories(visibleLessons);
  // All categories collapsed by default.
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  function toggleCategory(category: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const group = visibleLessons.filter((l) => l.category === category);
        const isExpanded = expandedCategories.has(category);
        const doneCount = group.filter((l) => completedIds.includes(l.id)).length;
        const allDone = group.length > 0 && doneCount === group.length;
        const inProgressCount = group.filter(
          (l) => !completedIds.includes(l.id) && (inProgressMap[l.id] ?? 0) > 0
        ).length;

        return (
          <div key={category}>
            <button
              type="button"
              onClick={() => toggleCategory(category)}
              className="flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-left transition hover:bg-white/5"
              aria-expanded={isExpanded}
            >
              <span className={`text-[10px] uppercase tracking-[0.28em] transition-colors ${allDone ? "text-emerald-400" : "text-zinc-500"}`}>
                {category}{allDone ? " ✓" : ""}
              </span>
              <div className="flex items-center gap-2">
                {/* mini status counts */}
                {doneCount > 0 && (
                  <span className="text-[9px] text-emerald-500">{doneCount}✓</span>
                )}
                {inProgressCount > 0 && (
                  <span className="text-[9px] text-amber-400">~{inProgressCount}</span>
                )}
                <svg
                  viewBox="0 0 12 12"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-zinc-600 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="space-y-0.5 pt-0.5">
                {group.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onSelect={onSelectLesson}
                    selected={lesson.id === selectedLessonId}
                    isCompleted={completedIds.includes(lesson.id)}
                    progressPercent={inProgressMap[lesson.id]}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
