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

  return (
    <p className={surfaceClassName}>
      {characters.map(({ character, state, absoluteIndex }, localIndex) => {
        const key = absoluteIndex !== undefined ? absoluteIndex : localIndex;
        const idx = absoluteIndex !== undefined ? absoluteIndex : localIndex;
        const isSelected =
          selectionRange !== null &&
          selectionRange !== undefined &&
          idx >= selectionRange.start &&
          idx <= selectionRange.end;

        if (character === "\n") {
          return <br key={key} />;
        }

        return (
          <span
            key={key}
            data-testid="typing-char"
            data-state={state}
            data-absolute-index={key}
            className={`${stateClasses[state]} ${isSelected ? "rounded bg-fuchsia-500/30" : ""}`}
          >
            {character}
          </span>
        );
      })}
    </p>
  );
}
