import { useEffect } from "react";
import { CharacterTape } from "./CharacterTape";
import { TypingStats } from "./TypingStats";
import { useTypingSession, type TypingSessionSummary } from "./useTypingSession";

type TypingSessionProps = {
  text: string;
  title?: string;
  onComplete?: (summary: TypingSessionSummary) => void;
};

export function TypingSession({ text, title = "Typing session", onComplete }: TypingSessionProps) {
  const session = useTypingSession(text);

  useEffect(() => {
    if (session.status === "finished") {
      onComplete?.(session.summary);
    }
  }, [onComplete, session.status, session.summary]);

  return (
    <section className="space-y-6 rounded-3xl border border-zinc-800 bg-surface-900 p-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
          Practice
        </p>
        <h2 className="text-2xl font-medium">{title}</h2>
      </header>

      <TypingStats summary={session.summary} />
      <CharacterTape characters={session.characterStates} />

      <label className="block space-y-2">
        <span className="text-sm text-zinc-300">Type here</span>
        <textarea
          value={session.typedText}
          onChange={(event) => session.setTypedText(event.target.value)}
          className="min-h-32 w-full rounded-3xl border border-zinc-800 bg-surface-950 px-5 py-4 text-zinc-50 outline-none transition focus:border-accent-400/60"
          placeholder="Start typing the paragraph..."
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={session.reset}
          className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500"
        >
          Reset
        </button>
        <p className="text-sm text-zinc-500">
          {session.status === "finished" ? "Completed" : "Keep typing"}
        </p>
      </div>
    </section>
  );
}
