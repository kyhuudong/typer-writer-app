import { useDeferredValue, useEffect, useRef, useState } from "react";
import { CharacterTape } from "./CharacterTape";
import { useTypingSession, type TypingSessionSummary } from "./useTypingSession";
import { useTranslate } from "./useTranslate";
import { TranslationTooltip } from "./TranslationTooltip";
import { speakText } from "../helpers/useTextToSpeech";

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

/**
 * Find the word in `text` that the user physically clicked by briefly making
 * the textarea non-interactive and hit-testing the character span underneath.
 */
function wordFromPoint(
  textarea: HTMLTextAreaElement,
  clientX: number,
  clientY: number,
  text: string
): string {
  // Hide the textarea from pointer events so elementFromPoint reaches the span.
  const prev = textarea.style.pointerEvents;
  textarea.style.pointerEvents = "none";
  const el = document.elementFromPoint(clientX, clientY);
  textarea.style.pointerEvents = prev;

  const rawIndex = el instanceof HTMLElement
    ? el.getAttribute("data-absolute-index")
    : null;

  if (rawIndex === null) return "";
  return wordAt(text, parseInt(rawIndex, 10));
}

export function TypingViewport({
  text,
  onSummaryChange,
  onComplete
}: TypingViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const session = useTypingSession(text);
  const { translation, loading, error, translate, clear } = useTranslate();

  const [tooltip, setTooltip] = useState<TooltipState>(null);
  // Snapshot of typedText.length at the moment the tooltip was last shown.
  // We only auto-dismiss the tooltip when the user types NEW characters after
  // opening it — not just because tooltip state changed.
  const tooltipOpenAtLength = useRef<number | null>(null);

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

  // Dismiss tooltip only when the user types NEW characters after opening it.
  useEffect(() => {
    if (tooltipOpenAtLength.current !== null && tooltip) {
      if (session.typedText.length > tooltipOpenAtLength.current) {
        setTooltip(null);
        clear();
        tooltipOpenAtLength.current = null;
      }
    }
  }, [session.typedText, tooltip, clear]);

  function handleClick(e: React.MouseEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget;

    // Detect the actual word under the cursor by hit-testing the tape spans.
    const word = wordFromPoint(textarea, e.clientX, e.clientY, text);

    if (word) {
      // Speak only the clicked word, not the whole lesson.
      speakText(word);

      if (word !== tooltip?.word) {
        tooltipOpenAtLength.current = session.typedText.length;
        setTooltip({ word, x: e.clientX, y: e.clientY });
        translate(word);
      } else {
        // Same word clicked again — dismiss.
        tooltipOpenAtLength.current = null;
        setTooltip(null);
        clear();
      }
    } else {
      // Clicked on whitespace or outside text — dismiss tooltip.
      tooltipOpenAtLength.current = null;
      setTooltip(null);
      clear();
    }

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
