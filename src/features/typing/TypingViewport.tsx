import { useDeferredValue, useEffect, useRef } from "react";
import { CharacterTape } from "./CharacterTape";
import { useTypingSession, type TypingSessionSummary } from "./useTypingSession";

type TypingViewportProps = {
  text: string;
  onSummaryChange?: (summary: TypingSessionSummary) => void;
  onComplete?: (summary: TypingSessionSummary) => void;
  onSpeak?: () => void;
};

export function TypingViewport({
  text,
  onSummaryChange,
  onComplete,
  onSpeak
}: TypingViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const session = useTypingSession(text);

  // Defer the character tape re-render so the textarea stays snappy.
  const deferredVisible = useDeferredValue(session.visibleCharacters);

  useEffect(() => {
    onSummaryChange?.(session.summary);
  }, [onSummaryChange, session.summary]);

  useEffect(() => {
    if (session.status === "finished") {
      onComplete?.(session.summary);
    }
  }, [onComplete, session.status, session.summary]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const current = viewport.querySelector<HTMLElement>('[data-state="current"]');
    if (current && typeof current.scrollIntoView === "function") {
      current.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: "smooth"
      });
    }
  }, [session.typedText, text]);

  return (
    <div
      ref={viewportRef}
      className="min-h-[52rem] max-h-[88vh] overflow-auto bg-transparent"
    >
      <div className="relative">
        <CharacterTape characters={deferredVisible} variant="layer" />
        <textarea
          ref={inputRef}
          value={session.typedText}
          onChange={(event) => session.setTypedText(event.target.value)}
          onClick={() => {
            onSpeak?.();
            inputRef.current?.focus();
          }}
          aria-label="Typing surface"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-10 text-transparent caret-transparent outline-none"
        />
      </div>
    </div>
  );
}
