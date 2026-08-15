import type { Lesson } from "../../types/lesson";

type LessonCardProps = {
  lesson: Lesson;
  onSelect?: (lesson: Lesson) => void;
  selected?: boolean;
};

export function LessonCard({ lesson, onSelect, selected = false }: LessonCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(lesson)}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/10 ${
        selected ? "bg-white/10" : "bg-transparent"
      }`}
    >
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium text-zinc-100">{lesson.title}</h3>
        <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          {lesson.category}
        </p>
      </div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {lesson.difficulty}
      </p>
    </button>
  );
}
