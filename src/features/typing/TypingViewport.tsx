import { useDeferredValue, useEffect, useRef, useState } from "react";
import { CharacterTape } from "./CharacterTape";
import { useTypingSession, type TypingSessionSummary } from "./useTypingSession";
import { useTranslate } from "./useTranslate";
import { TranslationTooltip } from "./TranslationTooltip";

type TypingViewportProps = {
  text: string;
  onSummaryChange?: (summary: TypingSessionSummary) => void;
  onComplete?: (summary: TypingSessionSummary) => void;
  onSpeak?: () => void;
};

type TooltipState = {
  word: string;
  x: number;
  y: number;
} | null;

/** Extract the word at a given character index (expands to word boundaries). */
function wordAt(text: string, index: number): string {
  if (index < 0 || index >= text.length) return "";
  const left = text.slice(0, index + 1).search(/\S+$/);
  const right = text.slice(index).search(/[\s\n,.;:!?]/);
  const end = right === -1 ? text.length : index + right;
  return text.slice(Math.max(0, left), end).replace(/[.,;:!?]+$/, "").trim();
}

export function TypingViewport({
  text,
  onSummaryChange,
  onComplete,
  onSpeak
}: TypingViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const session = useTypingSession(text);
  const { translation, loading, error, translate, clear } = useTranslate();

  const [tooltip, setTooltip] = useState<TooltipState>(null);

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
    if (!viewport) return;

    const current = viewport.querySelector<HTMLElement>('[data-state="current"]');
    if (current && typeof current.scrollIntoView === "function") {
      current.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
    }
  }, [session.typedText, text]);

  // Dismiss tooltip when the user starts typing.
  useEffect(() => {
    if (session.typedText && tooltip) {
      setTooltip(null);
      clear();
    }
  }, [session.typedText, tooltip, clear]);

  function handleClick(e: React.MouseEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget;
    const charIndex = textarea.selectionStart ?? 0;
    const word = wordAt(text, charIndex);

    if (word && word !== tooltip?.word) {
      setTooltip({ word, x: e.clientX, y: e.clientY });
      translate(word);
    } else {
      // Second click on the same word or click on whitespace — dismiss.
      setTooltip(null);
      clear();
    }

    onSpeak?.();
    textarea.focus();
  }

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
          onClick={handleClick}
          aria-label="Typing surface"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-10 text-transparent caret-transparent outline-none"
        />
      </div>

      {tooltip && (
        <TranslationTooltip
          word={tooltip.word}
          translation={translation}
          loading={loading}
          error={error}
          x={tooltip.x}
          y={tooltip.y}
          onDismiss={() => { setTooltip(null); clear(); }}
        />
      )}
    </div>
  );
}
