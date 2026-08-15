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
    <div className="space-y-2 text-sm text-zinc-300">
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
        {progress.username}
      </p>
      <p>Streak {progress.streak} days</p>
      <p>Top WPM {progress.highestWpm}</p>
      <p>Accuracy {progress.averageAccuracy}%</p>
      <p>Words typed {progress.totalWordsTyped}</p>
      <p>Completed lessons {progress.completedLessonIds.length}</p>
      <p>Sessions {progress.history.length}</p>
    </div>
  );
}
