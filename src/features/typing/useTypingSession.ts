import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calculateCompletionPercent,
  calculateAccuracy,
  calculateWpm,
  countCorrectCharacters,
  countTypedWords,
  getCharacterStates
} from "../../lib/typingMetrics";

export type TypingSessionSummary = {
  typedWords: number;
  correctChars: number;
  totalChars: number;
  completionPercent: number;
  elapsedMs: number;
  wpm: number;
  accuracy: number;
};

const WINDOW_RADIUS = 200; // kept for reference but windowing is disabled — see visibleCharacters

export function useTypingSession(targetText: string, initialTypedText = "") {
  // Guard: discard pre-normalization stale text (has \n) or text longer than
  // the target. Wrong characters from user mistakes are fine — we restore them
  // as-is (shown red) rather than wiping the user's progress.
  function safeInitial(initial: string) {
    if (initial.length === 0) return initial;
    if (initial.length > targetText.length) return "";
    if (initial.includes("\n")) return "";
    return initial;
  }

  const [typedText, setTypedText] = useState(() => safeInitial(initialTypedText));
  // Always start the timer as null — even when restoring from saved text.
  // The timer begins on the first new keystroke, not on mount.
  // This prevents WPM=0 when resuming a lesson that's close to completion.
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  useEffect(() => {
    setTypedText(safeInitial(initialTypedText));
    setStartedAt(null);
    setFinishedAt(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetText]);

  const summary = useMemo<TypingSessionSummary>(() => {
    const elapsedMs =
      startedAt === null
        ? 0
        : (finishedAt ?? Date.now()) - startedAt;
    const typedWords = countTypedWords(typedText);
    const correctChars = countCorrectCharacters(targetText, typedText);
    const totalChars = targetText.length;
    const completionPercent = calculateCompletionPercent({
      typedChars: typedText.length,
      totalChars
    });

    return {
      typedWords,
      correctChars,
      totalChars,
      completionPercent,
      elapsedMs,
      wpm: calculateWpm({ correctChars, elapsedMs }),
      accuracy: calculateAccuracy({ correctChars, totalChars })
    };
  }, [finishedAt, startedAt, targetText, typedText]);

  const isComplete = typedText === targetText && targetText.length > 0;

  useEffect(() => {
    if (typedText.length > 0 && startedAt === null) {
      setStartedAt(Date.now());
    }
  }, [startedAt, typedText.length]);

  useEffect(() => {
    if (isComplete && finishedAt === null) {
      setFinishedAt(Date.now());
    }
  }, [finishedAt, isComplete]);

  const reset = useCallback(() => {
    setTypedText("");
    setStartedAt(null);
    setFinishedAt(null);
  }, []);

  const allCharacterStates = useMemo(
    () => getCharacterStates(targetText, typedText),
    [targetText, typedText]
  );

  // Always expose the full array so CharacterTape never drops chars from the
  // top of the text — that caused line-count jumps during typing.
  // absoluteIndex equals the array index directly.
  const visibleCharacters = useMemo(
    () => allCharacterStates.map((entry, i) => ({ ...entry, absoluteIndex: i })),
    [allCharacterStates]
  );

  return {
    typedText,
    setTypedText,
    reset,
    characterStates: allCharacterStates,
    visibleCharacters,
    summary,
    status: isComplete ? "finished" : startedAt ? "typing" : "idle"
  } as const;
}
