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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const recordLessonComplete = useAppStore((state) => state.recordLessonComplete);
  const saveLessonProgress = useAppStore((state) => state.saveLessonProgress);
  const completedLessonIds = useAppStore((state) => state.progress?.completedLessonIds ?? []);
  const progress = useAppStore((state) => state.progress);
  const isCompleted = lesson ? completedLessonIds.includes(lesson.id) : false;

  const typedTextRef = useRef("");
  const lastSavedTextRef = useRef("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Save immediately if text has changed since last save. */
  function doSave(lessonId: string, text: string) {
    if (!lessonId || !text || text === lastSavedTextRef.current) return;
    saveLessonProgress(lessonId, text);
    lastSavedTextRef.current = text;
    setSaveStatus("saved");
    if (savedIndicatorTimerRef.current) clearTimeout(savedIndicatorTimerRef.current);
    savedIndicatorTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
  }

  /** Schedule a debounced save 1.5 s after the user stops typing. */
  function scheduleSave(lessonId: string) {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      doSave(lessonId, typedTextRef.current);
    }, 1500);
  }

  // Save when lesson changes or component unmounts.
  useEffect(() => {
    const lessonId = lesson?.id ?? null;
    // Reset tracking when switching lessons.
    lastSavedTextRef.current = "";
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (lessonId && typedTextRef.current) {
        doSave(lessonId, typedTextRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  // On F5 / tab close: flush pending save AND block accidental navigation.
  useEffect(() => {
    function handleUnload(e: BeforeUnloadEvent) {
      const lessonId = lesson?.id;
      if (lessonId && typedTextRef.current) {
        doSave(lessonId, typedTextRef.current);
        // Show "Leave site?" dialog only when there's unsaved progress.
        if (typedTextRef.current !== lastSavedTextRef.current) {
          e.preventDefault();
          e.returnValue = "";
        }
      }
    }
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
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

  const raw = progress?.lessonSaveStates[lesson.id]?.typedText ?? "";
  // Restore saved text capped to lesson length. Wrong chars show as red —
  // that is intentional. No content-based validation to avoid false discards.
  const savedTypedText = isCompleted ? lesson.text : raw.slice(0, lesson.text.length);

  return (
    <section className="space-y-4 xl:max-w-[1400px]">
      <div className="flex items-end justify-between gap-4">
        <TypingStats summary={summary} />
        <p
          className={`shrink-0 pb-2.5 text-[10px] uppercase tracking-[0.28em] transition-opacity duration-500 ${
            saveStatus === "saved" ? "text-emerald-500 opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          Saved ✓
        </p>
      </div>
      <TypingViewport
        key={lesson.id}
        text={lesson.text}
        initialTypedText={savedTypedText}
        onSummaryChange={setSummary}
        onTypedTextChange={(t) => {
          typedTextRef.current = t;
          if (lesson.id) scheduleSave(lesson.id);
        }}
        onComplete={(s) => {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          typedTextRef.current = "";
          lastSavedTextRef.current = "";
          recordLessonComplete(lesson.id, s);
        }}
      />
    </section>
  );
}
