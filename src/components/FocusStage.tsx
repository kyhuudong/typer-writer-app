import { useState } from "react";
import type { Lesson } from "../types/lesson";
import { useTextToSpeech } from "../features/helpers/useTextToSpeech";
import { TypingSession } from "../features/typing/TypingSession";
import { TypingStats } from "../features/typing/TypingStats";
import { TypingTools } from "../features/typing/TypingTools";
import type { TypingSessionSummary } from "../features/typing/useTypingSession";

type FocusStageProps = {
  lesson: Lesson | null;
};

const emptySummary: TypingSessionSummary = {
  typedWords: 0,
  correctChars: 0,
  totalChars: 0,
  elapsedMs: 0,
  wpm: 0,
  accuracy: 0
};

export function FocusStage({ lesson }: FocusStageProps) {
  const speech = useTextToSpeech();
  const [summary, setSummary] = useState<TypingSessionSummary>(emptySummary);

  if (!lesson) {
    return (
      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Focus stage
          </p>
          <h2 className="text-2xl font-medium text-zinc-50">
            Choose a lesson to begin
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Focus stage
        </p>
        <button
          type="button"
          onClick={() => speech.speak(lesson.text)}
          className="block w-full rounded-none border-0 bg-transparent p-0 text-left"
          aria-label="Speak lesson text"
        >
          <p className="text-3xl font-medium leading-[1.65] tracking-tight text-zinc-50/95 transition hover:text-zinc-50">
            {lesson.text}
          </p>
        </button>
      </div>

      <TypingSession text={lesson.text} onSummaryChange={setSummary} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <TypingStats summary={summary} />
        <TypingTools text={lesson.text} />
      </div>
    </section>
  );
}
