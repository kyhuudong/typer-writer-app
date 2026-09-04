type LessonNavigatorProps = {
  collectionTitle: string;
  category: string;
  currentIndex: number;
  totalLessons: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isCurrentLessonComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function LessonNavigator({
  collectionTitle,
  category,
  currentIndex,
  totalLessons,
  hasPrevious,
  hasNext,
  isCurrentLessonComplete,
  onPrevious,
  onNext
}: LessonNavigatorProps) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="flex items-center justify-between gap-3 border-b border-white/10 pb-3"
    >
      <button
        type="button"
        aria-label="Previous lesson"
        disabled={!hasPrevious}
        onClick={onPrevious}
        className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← Previous
      </button>
      <p className="min-w-0 truncate text-center text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        {collectionTitle} · {category} · {currentIndex + 1} of {totalLessons}
      </p>
      <button
        type="button"
        aria-label="Next lesson"
        disabled={!hasNext}
        onClick={onNext}
        className={`rounded-lg px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
          isCurrentLessonComplete && hasNext
            ? "bg-fuchsia-500 text-white hover:bg-fuchsia-400"
            : "text-zinc-300 hover:bg-white/10"
        }`}
      >
        Next →
      </button>
    </nav>
  );
}
