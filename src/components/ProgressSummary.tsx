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
    <div className="space-y-1 text-sm text-zinc-300">
      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
        {progress.username}
      </p>
      <p className="border-l border-white/10 pl-2">Streak: {progress.streak} days</p>
      <p className="border-l border-white/10 pl-2">Top WPM: {progress.highestWpm}</p>
      <p className="border-l border-white/10 pl-2">Accuracy: {progress.averageAccuracy}%</p>
      <p className="border-l border-white/10 pl-2">Words typed: {progress.totalWordsTyped}</p>
      <p className="border-l border-white/10 pl-2">Lessons done: {progress.completedLessonIds.length}</p>
      <p className="border-l border-white/10 pl-2">Sessions: {progress.history.length}</p>
    </div>
  );
}
