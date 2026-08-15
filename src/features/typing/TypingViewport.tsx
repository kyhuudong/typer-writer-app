import { useEffect, useRef } from "react";
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
      className="min-h-[38rem] max-h-[78vh] overflow-auto bg-transparent"
    >
      <div className="relative">
        <CharacterTape characters={session.characterStates} variant="layer" />
        <textarea
          ref={inputRef}
          value={session.typedText}
          onChange={(event) => session.setTypedText(event.target.value)}
          onClick={() => {
            onSpeak?.();
            inputRef.current?.focus();
          }}
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
          className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-8 text-transparent caret-white/80 outline-none"
        />
      </div>
    </div>
  );
}
