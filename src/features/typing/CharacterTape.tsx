import type { ReactNode } from "react";
import type { CharacterState } from "../../lib/typingMetrics";

type CharacterEntry = {
  character: string;
  state: CharacterState;
  absoluteIndex?: number;
};

type CharacterTapeProps = {
  characters: CharacterEntry[];
  variant?: "surface" | "layer";
  selectionRange?: { start: number; end: number } | null;
};

const stateClasses: Record<CharacterState, string> = {
  correct: "text-emerald-400",
  incorrect: "text-rose-400",
  current:
    "text-cyan-300 underline decoration-fuchsia-400 decoration-[3px] underline-offset-[0.28em] shadow-[0_0_12px_rgba(217,70,239,0.4)]",
  pending: "text-zinc-600"
};

export function CharacterTape({ characters, variant = "surface", selectionRange }: CharacterTapeProps) {
  const surfaceClassName =
    variant === "surface"
      ? "rounded-3xl bg-transparent p-6 text-2xl leading-10 tracking-wide text-zinc-200"
      : "p-10 text-3xl leading-[2.35] tracking-tight text-zinc-200 transition-colors duration-100";

  const renderedCharacters: ReactNode[] = [];
  let selectedCharacters: ReactNode[] = [];
  let selectedStartIndex: number | null = null;

  function flushSelection() {
    if (selectedCharacters.length === 0 || selectedStartIndex === null) return;
    renderedCharacters.push(
      <mark
        key={`selection-${selectedStartIndex}`}
        className="bg-fuchsia-400/70 px-0.5 text-white [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      >
        {selectedCharacters}
      </mark>
    );
    selectedCharacters = [];
    selectedStartIndex = null;
  }

  for (const [{ character, state, absoluteIndex }, localIndex] of characters.map(
    (entry, index) => [entry, index] as const
  )) {
    const key = absoluteIndex !== undefined ? absoluteIndex : localIndex;
    const isSelected =
      selectionRange !== null &&
      selectionRange !== undefined &&
      key >= selectionRange.start &&
      key <= selectionRange.end;
    const node =
      character === "\n" ? (
        <br key={key} />
      ) : (
        <span
          key={key}
          data-testid="typing-char"
          data-state={state}
          data-absolute-index={key}
          className={isSelected ? "!text-fuchsia-50" : stateClasses[state]}
        >
          {character}
        </span>
      );

    if (isSelected) {
      if (selectedCharacters.length === 0) selectedStartIndex = key;
      selectedCharacters.push(node);
    } else {
      flushSelection();
      renderedCharacters.push(node);
    }
  }
  flushSelection();

  return (
    <p className={surfaceClassName}>
      {renderedCharacters}
    </p>
  );
}
