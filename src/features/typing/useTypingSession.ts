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

export function useTypingSession(targetText: string) {
  const [typedText, setTypedText] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);

  useEffect(() => {
    setTypedText("");
    setStartedAt(null);
    setFinishedAt(null);
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

  const characterStates = useMemo(
    () => getCharacterStates(targetText, typedText),
    [targetText, typedText]
  );

  return {
    typedText,
    setTypedText,
    reset,
    characterStates,
    summary,
    status: isComplete ? "finished" : startedAt ? "typing" : "idle"
  } as const;
}
