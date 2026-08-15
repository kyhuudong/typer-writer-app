import type { TypingSessionSummary } from "./useTypingSession";

type TypingStatsProps = {
  summary: TypingSessionSummary;
};

export function TypingStats({ summary }: TypingStatsProps) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="WPM" value={summary.wpm.toString()} />
      <Stat label="Accuracy" value={`${summary.accuracy}%`} />
      <Stat label="Words typed" value={summary.typedWords.toString()} />
      <Stat label="Elapsed" value={`${Math.round(summary.elapsedMs / 1000)}s`} />
    </dl>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 px-4 py-3">
      <dt className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 text-xl font-medium text-zinc-50">{value}</dd>
    </div>
  );
}
