import type { ProgressProfile } from "../types/progress";
import { useAppStore } from "../store/useAppStore";
import { EmptyState } from "./EmptyState";

type ProgressSummaryProps = {
  progress: ProgressProfile | null;
};

export function ProgressSummary({ progress }: ProgressSummaryProps) {
  const signOut = useAppStore((state) => state.signOut);
  const saveProgress = useAppStore((state) => state.saveProgress);
  const isBusy = useAppStore((state) => state.isBusy);

  if (!progress) {
    return (
      <EmptyState
        title="No saved progress yet"
        description="Sign in to save your streak or load your JSON progress file."
      />
    );
  }

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
        <p className="border-l border-white/10 pl-2">Lessons done: {progress.completedLessonIds.length}</p>
        {lastDate && (
          <p className="border-l border-white/10 pl-2">Last session: {lastDate}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void saveProgress()}
          disabled={isBusy}
          className="flex-1 rounded-xl border border-white/10 py-2 text-xs text-zinc-400 transition hover:bg-white/5 disabled:opacity-50"
        >
          {isBusy ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={signOut}
          className="rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-500 transition hover:bg-white/5 hover:text-rose-400"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
