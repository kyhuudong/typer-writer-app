import type { Lesson } from "../../types/lesson";
import { LessonImage } from "../media/LessonImage";

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
      className={`group flex h-full w-full flex-col overflow-hidden rounded-3xl border text-left transition hover:border-accent-400/60 hover:bg-surface-800 ${
        selected
          ? "border-accent-400 bg-surface-900 ring-1 ring-accent-400/30"
          : "border-zinc-800 bg-surface-900"
      }`}
    >
      <LessonImage
        src={lesson.image}
        alt={lesson.title}
        className="h-44 w-full object-cover opacity-90 transition group-hover:opacity-100"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-400">
          <span>{lesson.category}</span>
          <span className="text-zinc-600">•</span>
          <span>{lesson.difficulty}</span>
        </div>
        <h3 className="text-lg font-medium text-zinc-50">{lesson.title}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-zinc-400">
          {lesson.text}
        </p>
      </div>
    </button>
  );
}
