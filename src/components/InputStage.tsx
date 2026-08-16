import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../types/lesson";
import { TypingViewport } from "../features/typing/TypingViewport";
import { TypingStats } from "../features/typing/TypingStats";
import type { TypingSessionSummary } from "../features/typing/useTypingSession";
import { useAppStore } from "../store/useAppStore";

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
  const recordLessonComplete = useAppStore((state) => state.recordLessonComplete);
  const saveLessonProgress = useAppStore((state) => state.saveLessonProgress);
  const progress = useAppStore((state) => state.progress);

  // Keep a ref to the current typed text so we can save it when lesson changes.
  const typedTextRef = useRef("");

  // Save progress when lesson changes or component unmounts.
  const lessonIdRef = useRef<string | null>(null);
  useEffect(() => {
    const prevLessonId = lessonIdRef.current;
    lessonIdRef.current = lesson?.id ?? null;

    // When switching away from a lesson, save whatever was typed.
    return () => {
      if (prevLessonId && typedTextRef.current) {
        saveLessonProgress(prevLessonId, typedTextRef.current);
      }
    };
  // Only re-run when lesson changes (not saveLessonProgress which is stable).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

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

  const savedTypedText = progress?.lessonSaveStates[lesson.id]?.typedText ?? "";

  return (
    <section className="space-y-4 xl:max-w-[1400px]">
      <TypingStats summary={summary} />
      <TypingViewport
        key={lesson.id}
        text={lesson.text}
        initialTypedText={savedTypedText}
        onSummaryChange={setSummary}
        onTypedTextChange={(t) => { typedTextRef.current = t; }}
        onComplete={(s) => {
          typedTextRef.current = "";
          recordLessonComplete(lesson.id, s);
        }}
      />
    </section>
  );
}
