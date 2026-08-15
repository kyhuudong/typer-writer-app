import { useEffect, useRef } from "react";
import { CharacterTape } from "./CharacterTape";
import { useTypingSession, type TypingSessionSummary } from "./useTypingSession";

type TypingViewportProps = {
  text: string;
  onSummaryChange?: (summary: TypingSessionSummary) => void;
  onComplete?: (summary: TypingSessionSummary) => void;
};

export function TypingViewport({
  text,
  onSummaryChange,
  onComplete
}: TypingViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const session = useTypingSession(text);

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

    viewport.scrollTop = viewport.scrollHeight;
  }, [session.typedText, text]);

  return (
    <div
      ref={viewportRef}
      className="max-h-[72vh] overflow-auto bg-transparent"
    >
      <div className="relative">
        <CharacterTape characters={session.characterStates} variant="layer" />
        <textarea
          value={session.typedText}
          onChange={(event) => session.setTypedText(event.target.value)}
          onScroll={(event) => {
            const textarea = event.currentTarget;
            const viewport = viewportRef.current;
            if (viewport) {
              viewport.scrollTop = textarea.scrollTop;
            }
          }}
          aria-label="Typing surface"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-6 text-transparent caret-accent-400 outline-none"
        />
      </div>
    </div>
  );
}
