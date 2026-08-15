import type { ProgressProfile } from "../types/progress";
import { EmptyState } from "./EmptyState";

type ProgressSummaryProps = {
  progress: ProgressProfile | null;
};

export function ProgressSummary({ progress }: ProgressSummaryProps) {
  if (!progress) {
    return (
      <EmptyState
        title="No saved progress yet"
        description="Sign in to save your streak or load your JSON progress file."
      />
    );
  }

  return (
    <section className="space-y-4 rounded-3xl border border-zinc-800 bg-surface-900 p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
          Progress
        </p>
        <h2 className="text-2xl font-medium">Welcome back, {progress.username}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Streak" value={`${progress.streak} days`} />
        <Stat label="Top WPM" value={progress.highestWpm.toString()} />
        <Stat label="Accuracy" value={`${progress.averageAccuracy}%`} />
        <Stat label="Words typed" value={progress.totalWordsTyped.toString()} />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-surface-950 p-4 text-sm text-zinc-400">
        <p>
          Completed lessons:{" "}
          <span className="text-zinc-100">{progress.completedLessonIds.length}</span>
        </p>
        <p className="mt-2">
          Session history entries:{" "}
          <span className="text-zinc-100">{progress.history.length}</span>
        </p>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-surface-950 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-medium text-zinc-50">{value}</p>
    </div>
  );
}
