import type { CharacterState } from "../../lib/typingMetrics";

type CharacterTapeProps = {
  characters: Array<{ character: string; state: CharacterState }>;
  variant?: "surface" | "layer";
};

const stateClasses: Record<CharacterState, string> = {
  correct: "text-emerald-400",
  incorrect: "text-rose-400",
  current: "text-zinc-100 underline decoration-white/20 decoration-2 underline-offset-4",
  pending: "text-zinc-600"
};

export function CharacterTape({ characters, variant = "surface" }: CharacterTapeProps) {
  const surfaceClassName =
    variant === "surface"
      ? "rounded-3xl bg-transparent p-6 text-2xl leading-10 tracking-wide text-zinc-200"
      : "p-10 text-3xl leading-[2.35] tracking-tight text-zinc-200 transition-colors duration-100";

  return (
    <p className={surfaceClassName}>
      {characters.map(({ character, state }, index) => (
        <span
          key={`${character}-${index}`}
          data-testid="typing-char"
          data-state={state}
          className={stateClasses[state]}
        >
          {character}
        </span>
      ))}
    </p>
  );
}
