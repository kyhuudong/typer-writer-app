import { TypingViewport } from "./TypingViewport";
import type { TypingSessionSummary } from "./useTypingSession";

type TypingSessionProps = {
  text: string;
  onSummaryChange?: (summary: TypingSessionSummary) => void;
  onComplete?: (summary: TypingSessionSummary) => void;
};

export function TypingSession({
  text,
  onSummaryChange,
  onComplete
}: TypingSessionProps) {
  return (
    <section className="space-y-4">
      <TypingViewport
        text={text}
        onSummaryChange={onSummaryChange}
        onComplete={onComplete}
      />
    </section>
  );
}
