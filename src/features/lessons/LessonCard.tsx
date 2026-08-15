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
      className={`flex w-full flex-col gap-1 rounded-2xl px-3 py-3 text-left transition hover:bg-white/10 ${
        selected ? "bg-white/10" : "bg-transparent"
      }`}
    >
      <h3 className="text-sm font-medium text-zinc-100">{lesson.title}</h3>
      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
        {lesson.category} · {lesson.difficulty}
      </p>
    </button>
  );
}
