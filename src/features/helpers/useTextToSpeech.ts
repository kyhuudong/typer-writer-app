import { useCallback } from "react";

function getSpeechSynthesis() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.speechSynthesis ?? null;
}

export function speakText(text: string) {
  const speech = getSpeechSynthesis();
  if (!speech) {
    return false;
  }

  speech.cancel();
  speech.speak(new SpeechSynthesisUtterance(text));
  return true;
}

export function useTextToSpeech() {
  const speak = useCallback((text: string) => speakText(text), []);
  const cancel = useCallback(() => {
    getSpeechSynthesis()?.cancel();
  }, []);

  return {
    supported: getSpeechSynthesis() !== null,
    speak,
    cancel
  };
}
