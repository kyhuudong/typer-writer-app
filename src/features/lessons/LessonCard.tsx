import type { Lesson } from "../../types/lesson";

type LessonCardProps = {
  lesson: Lesson;
  onSelect?: (lesson: Lesson) => void;
  selected?: boolean;
};

function lengthLabel(text: string): string {
  const words = text.trim().split(/\s+/).length;
  if (words < 80) return "Short";
  if (words < 200) return "Medium";
  if (words < 500) return "Long";
  return "Epic";
}

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
      <h3 className="text-sm font-medium text-zinc-100">{lesson.title}</h3>
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
