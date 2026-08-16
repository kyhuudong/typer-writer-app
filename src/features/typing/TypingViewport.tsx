import { useDeferredValue, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CharacterTape } from "./CharacterTape";
import { useTypingSession, type TypingSessionSummary } from "./useTypingSession";
import { useTranslate } from "./useTranslate";
import { TranslationTooltip } from "./TranslationTooltip";
import { speakText } from "../helpers/useTextToSpeech";

type TypingViewportProps = {
  text: string;
  initialTypedText?: string;
  onSummaryChange?: (summary: TypingSessionSummary) => void;
  onComplete?: (summary: TypingSessionSummary) => void;
  onTypedTextChange?: (typedText: string) => void;
  onSpeak?: () => void;
};

type TooltipState = {
  word: string;
  x: number;
  y: number;
} | null;

type SelectionRange = { start: number; end: number } | null;

/** Extract the word at a given character index (expands to word boundaries). */
function wordAt(text: string, index: number): string {
  if (index < 0 || index >= text.length) return "";
  const left = text.slice(0, index + 1).search(/\S+$/);
  const right = text.slice(index).search(/[\s\n,.;:!?]/);
  const end = right === -1 ? text.length : index + right;
  return text.slice(Math.max(0, left), end).replace(/[.,;:!?]+$/, "").trim();
}

/**
 * Get the absolute char index of the span under (clientX, clientY) by
 * briefly disabling pointer-events on the textarea overlay.
 */
function indexFromPoint(
  textarea: HTMLTextAreaElement,
  clientX: number,
  clientY: number
): number | null {
  const prev = textarea.style.pointerEvents;
  textarea.style.pointerEvents = "none";
  const el = document.elementFromPoint(clientX, clientY);
  textarea.style.pointerEvents = prev;
  if (!(el instanceof HTMLElement)) return null;
  const raw = el.getAttribute("data-absolute-index");
  return raw !== null ? parseInt(raw, 10) : null;
}

export function TypingViewport({
  text,
  initialTypedText = "",
  onSummaryChange,
  onComplete,
  onTypedTextChange
}: TypingViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const session = useTypingSession(text, initialTypedText);
  const { translation, loading, error, translate, clear } = useTranslate();

  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [selectionRange, setSelectionRange] = useState<SelectionRange>(null);
  const tooltipOpenAtLength = useRef<number | null>(null);
  const mousedownIndexRef = useRef<number | null>(null);
  const mousedownPosRef = useRef<{ x: number; y: number } | null>(null);
  // Ensure onComplete fires exactly once per session lifecycle.
  const completionFiredRef = useRef(false);

  const deferredVisible = useDeferredValue(session.visibleCharacters);

  // Move cursor to end of pre-filled text before first paint.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const len = el.value.length;
    if (len > 0) el.setSelectionRange(len, len);
  }, []);

  useEffect(() => {
    onSummaryChange?.(session.summary);
  }, [onSummaryChange, session.summary]);

  useEffect(() => {
    onTypedTextChange?.(session.typedText);
  }, [onTypedTextChange, session.typedText]);

  useEffect(() => {
    if (session.status === "finished" && !completionFiredRef.current && session.summary.elapsedMs > 0) {
      completionFiredRef.current = true;
      onComplete?.(session.summary);
    }
  }, [onComplete, session.status, session.summary]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const current = viewport.querySelector<HTMLElement>('[data-state="current"]');
    if (!current || typeof current.scrollIntoView !== "function") return;
    // Only scroll when the current char is near the edge of the visible area.
    // Firing scrollIntoView on every keystroke (even "instant") re-centers the
    // viewport constantly, causing visible up/down jitter.
    const rect = current.getBoundingClientRect();
    const containerRect = viewport.getBoundingClientRect();
    const margin = 120;
    const isVisible =
      rect.top >= containerRect.top + margin &&
      rect.bottom <= containerRect.bottom - margin;
    if (!isVisible) {
      current.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    }
  }, [session.typedText, text]);

  // Dismiss tooltip when user types new characters.
  useEffect(() => {
    if (tooltipOpenAtLength.current !== null && tooltip) {
      if (session.typedText.length > tooltipOpenAtLength.current) {
        setTooltip(null);
        clear();
        tooltipOpenAtLength.current = null;
      }
    }
  }, [session.typedText, tooltip, clear]);

  // Clear selection when user starts typing.
  useEffect(() => {
    if (selectionRange !== null) setSelectionRange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.typedText]);

  function handleMouseDown(e: React.MouseEvent<HTMLTextAreaElement>) {
    const idx = indexFromPoint(e.currentTarget, e.clientX, e.clientY);
    mousedownIndexRef.current = idx;
    mousedownPosRef.current = { x: e.clientX, y: e.clientY };
  }

  function handleMouseUp(e: React.MouseEvent<HTMLTextAreaElement>) {
    const textarea = e.currentTarget;
    const upIdx = indexFromPoint(textarea, e.clientX, e.clientY);
    const downIdx = mousedownIndexRef.current;
    const downPos = mousedownPosRef.current;
    mousedownIndexRef.current = null;
    mousedownPosRef.current = null;

    // Determine if this was a drag (moved ≥4px) or a click.
    const isDrag =
      downPos !== null &&
      (Math.abs(e.clientX - downPos.x) >= 4 || Math.abs(e.clientY - downPos.y) >= 4);

    if (isDrag && downIdx !== null && upIdx !== null && downIdx !== upIdx) {
      // Selection: translate the dragged phrase.
      const start = Math.min(downIdx, upIdx);
      const end = Math.max(downIdx, upIdx) + 1;
      const phrase = text.slice(start, end).trim();
      if (phrase) {
        setSelectionRange({ start, end: end - 1 });
        tooltipOpenAtLength.current = session.typedText.length;
        setTooltip({ word: phrase, x: e.clientX, y: e.clientY });
        translate(phrase);
        speakText(phrase);
      }
      textarea.focus();
      return;
    }

    // Single click: word lookup.
    if (upIdx === null) {
      tooltipOpenAtLength.current = null;
      setTooltip(null);
      setSelectionRange(null);
      clear();
      textarea.focus();
      return;
    }
    const word = wordAt(text, upIdx);
    if (word) {
      speakText(word);
      if (word !== tooltip?.word) {
        tooltipOpenAtLength.current = session.typedText.length;
        setTooltip({ word, x: e.clientX, y: e.clientY });
        translate(word);
      } else {
        tooltipOpenAtLength.current = null;
        setTooltip(null);
        setSelectionRange(null);
        clear();
      }
    } else {
      tooltipOpenAtLength.current = null;
      setTooltip(null);
      setSelectionRange(null);
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
        <CharacterTape characters={deferredVisible} variant="layer" selectionRange={selectionRange} />
        <textarea
          ref={inputRef}
          value={session.typedText}
          onChange={(event) => session.setTypedText(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              session.setTypedText((prev) => prev.slice(0, -1));
            }
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          aria-label="Typing surface"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="absolute inset-0 h-full w-full resize-none border-0 bg-transparent p-10 text-transparent caret-transparent outline-none select-none"
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
          onDismiss={() => { setTooltip(null); setSelectionRange(null); clear(); }}
        />
      )}
    </div>
  );
}
