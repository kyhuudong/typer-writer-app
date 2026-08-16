import type { ProgressProfile } from "../types/progress";
import { useAppStore } from "../store/useAppStore";
import { lessonCatalog } from "../lib/lessonCatalog";
import { EmptyState } from "./EmptyState";

type ProgressSummaryProps = {
  progress: ProgressProfile | null;
  onResumeLesson?: (lessonId: string) => void;
};

export function ProgressSummary({ progress, onResumeLesson }: ProgressSummaryProps) {
  const signOut = useAppStore((state) => state.signOut);
  const saveProgress = useAppStore((state) => state.saveProgress);
  const isBusy = useAppStore((state) => state.isBusy);
  const storeError = useAppStore((state) => state.error);

  if (!progress) {
    return (
      <EmptyState
        title="No saved progress yet"
        description="Sign in to save your streak or load your JSON progress file."
      />
    );
  }

  const lastLesson = progress.lastLessonId
    ? lessonCatalog.find((l) => l.id === progress.lastLessonId)
    : null;

  const lastSession = progress.history.at(-1);
  const lastDate = lastSession
    ? new Date(lastSession.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;

  return (
    <div className="space-y-3">
      {/* Stats */}
      <div className="space-y-1 text-sm text-zinc-300">
        <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
          {progress.username}
        </p>
        <p className="border-l border-white/10 pl-2">Streak: {progress.streak} days</p>
        <p className="border-l border-white/10 pl-2">Top WPM: {progress.highestWpm}</p>
        <p className="border-l border-white/10 pl-2">Accuracy: {progress.averageAccuracy}%</p>
        <p className="border-l border-white/10 pl-2">Words typed: {progress.totalWordsTyped}</p>
        <p className="border-l border-white/10 pl-2">
          Lessons done: {progress.completedLessonIds.length}
        </p>
        {lastDate && (
          <p className="border-l border-white/10 pl-2">Last session: {lastDate}</p>
        )}
      </div>

      {/* Resume card */}
      {lastLesson && onResumeLesson && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Continue</p>
          <p className="mt-0.5 truncate text-xs font-medium text-zinc-200">{lastLesson.title}</p>
          <button
            type="button"
            onClick={() => onResumeLesson(lastLesson.id)}
            className="mt-2 w-full rounded-lg bg-white/10 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-white/15"
          >
            Resume →
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void saveProgress()}
          disabled={isBusy}
          className="flex-1 rounded-xl border border-white/10 py-2 text-xs text-zinc-400 transition hover:bg-white/5 disabled:opacity-50"
        >
          {isBusy ? "Exporting…" : "Export JSON"}
        </button>
        <button
          type="button"
          onClick={signOut}
          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-500 transition hover:bg-white/5 hover:text-rose-400"
        >
          Sign out
        </button>
      </div>
      {storeError && (
        <p className="text-xs text-rose-400">{storeError}</p>
      )}
    </div>
  );
}
