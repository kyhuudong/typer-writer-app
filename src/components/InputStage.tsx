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
  const [resetToken, setResetToken] = useState(0);
  const recordLessonComplete = useAppStore((state) => state.recordLessonComplete);
  const saveLessonProgress = useAppStore((state) => state.saveLessonProgress);
  const clearLessonProgress = useAppStore((state) => state.clearLessonProgress);
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
  const hasTypedText = typedTextRef.current.length > 0 || savedTypedText.length > 0;

  function handleClearTyped() {
    if (!lesson) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    typedTextRef.current = "";
    lastSavedTextRef.current = "";
    clearLessonProgress(lesson.id);
    setSummary(emptySummary);
    setSaveStatus("idle");
    setResetToken((value) => value + 1);
  }

  return (
    <section className="space-y-4 xl:max-w-[1400px]">
      <div className="flex items-end justify-between gap-4">
        <TypingStats summary={summary} />
        <div className="flex shrink-0 items-center gap-3 pb-2.5">
          <button
            type="button"
            onClick={handleClearTyped}
            disabled={!hasTypedText && !isCompleted}
            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition hover:border-fuchsia-400/40 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Clear typed
          </button>
          <p
            className={`text-[10px] uppercase tracking-[0.28em] transition-opacity duration-500 ${
              saveStatus === "saved" ? "text-emerald-500 opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            Saved ✓
          </p>
        </div>
      </div>
      <TypingViewport
        key={lesson.id}
        text={lesson.text}
        displayText={lesson.displayText}
        initialTypedText={savedTypedText}
        resetToken={resetToken}
        onSummaryChange={setSummary}
        onClearRequest={handleClearTyped}
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
