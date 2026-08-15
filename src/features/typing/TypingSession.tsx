import { TypingViewport } from "./TypingViewport";
import type { TypingSessionSummary } from "./useTypingSession";

type TypingSessionProps = {
  text: string;
  title?: string;
  onSummaryChange?: (summary: TypingSessionSummary) => void;
  onComplete?: (summary: TypingSessionSummary) => void;
};

export function TypingSession({
  text,
  title = "Typing session",
  onSummaryChange,
  onComplete
}: TypingSessionProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-zinc-800 bg-surface-900 p-5">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Focus stage
        </p>
        <h2 className="text-xl font-medium text-zinc-50">{title}</h2>
      </header>

      <TypingViewport
        text={text}
        onSummaryChange={onSummaryChange}
        onComplete={onComplete}
      />
    </section>
  );
}
