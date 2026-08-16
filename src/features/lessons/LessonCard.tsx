import type { Lesson } from "../../types/lesson";

type LessonCardProps = {
  lesson: Lesson;
  onSelect?: (lesson: Lesson) => void;
  selected?: boolean;
  isCompleted?: boolean;
  progressPercent?: number;
};

function lengthLabel(text: string): string {
  const words = text.trim().split(/\s+/).length;
  if (words < 80) return "Short";
  if (words < 200) return "Medium";
  if (words < 500) return "Long";
  return "Epic";
}

export function LessonCard({
  lesson,
  onSelect,
  selected = false,
  isCompleted = false,
  progressPercent
}: LessonCardProps) {
  const inProgress = !isCompleted && progressPercent !== undefined && progressPercent > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(lesson)}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/10 ${
        selected ? "bg-white/10" : "bg-transparent"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {isCompleted && (
          <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-emerald-400" aria-label="Completed">
            <path d="M1.5 6l3 3 6-6" />
          </svg>
        )}
        {inProgress && (
          <span className="shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400">
            {progressPercent}%
          </span>
        )}
        <h3 className={`truncate text-sm font-medium ${isCompleted ? "text-zinc-400" : "text-zinc-100"}`}>
          {lesson.title}
        </h3>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-2">
        <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-600">
          {lengthLabel(lesson.text)}
        </span>
        <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          {lesson.difficulty}
        </span>
      </div>
    </button>
  );
}
