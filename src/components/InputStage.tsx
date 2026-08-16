import { useState } from "react";
import type { Lesson } from "../types/lesson";
import { TypingViewport } from "../features/typing/TypingViewport";
import { TypingStats } from "../features/typing/TypingStats";
import type { TypingSessionSummary } from "../features/typing/useTypingSession";

type InputStageProps = {
  lesson: Lesson | null;
};

const emptySummary: TypingSessionSummary = {
  typedWords: 0,
  correctChars: 0,
  totalChars: 0,
  completionPercent: 0,
  elapsedMs: 0,
  wpm: 0,
  accuracy: 0
};

export function InputStage({ lesson }: InputStageProps) {
  const [summary, setSummary] = useState<TypingSessionSummary>(emptySummary);

  if (!lesson) {
    return (
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Input stage
        </p>
        <h2 className="text-2xl font-medium text-zinc-100">
          Choose a lesson to begin
        </h2>
      </section>
    );
  }

  return (
    <section className="space-y-4 xl:max-w-[1400px]">
      <TypingStats summary={summary} />
      <TypingViewport
        key={lesson.id}
        text={lesson.text}
        onSummaryChange={setSummary}
      />
    </section>
  );
}
