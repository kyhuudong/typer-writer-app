import { useEffect } from "react";
import { CharacterTape } from "./CharacterTape";
import { TypingStats } from "./TypingStats";
import { useTypingSession, type TypingSessionSummary } from "./useTypingSession";
import { useDictionaryLookup } from "../helpers/useDictionaryLookup";
import { useTextToSpeech } from "../helpers/useTextToSpeech";

type TypingSessionProps = {
  text: string;
  title?: string;
  onComplete?: (summary: TypingSessionSummary) => void;
};

export function TypingSession({ text, title = "Typing session", onComplete }: TypingSessionProps) {
  const session = useTypingSession(text);
  const speech = useTextToSpeech();
  const dictionary = useDictionaryLookup();
  const words = text.split(/\s+/).filter(Boolean);

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

      <div className="space-y-3 rounded-3xl border border-zinc-800 bg-surface-950 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => speech.speak(text)}
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500"
          >
            Listen
          </button>
          <p className="text-sm text-zinc-500">
            Double-click a word to open a dictionary lookup.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              onDoubleClick={() => void dictionary.lookupWord(word)}
              className="cursor-pointer rounded-full border border-zinc-800 bg-surface-900 px-3 py-1 text-sm text-zinc-300 transition hover:border-accent-400/50"
            >
              {word}
            </span>
          ))}
        </div>
        {dictionary.isLoading ? (
          <p className="text-sm text-zinc-500">Looking up word...</p>
        ) : null}
        {dictionary.entry ? (
          <dl className="grid gap-3 rounded-2xl border border-zinc-800 bg-surface-900 p-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Word
              </dt>
              <dd className="mt-1 text-zinc-100">{dictionary.entry.word}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Part of speech
              </dt>
              <dd className="mt-1 text-zinc-100">{dictionary.entry.partOfSpeech}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Definition
              </dt>
              <dd className="mt-1 leading-6 text-zinc-300">
                {dictionary.entry.definition}
              </dd>
            </div>
          </dl>
        ) : null}
        {dictionary.error ? (
          <p role="alert" className="text-sm text-rose-300">
            {dictionary.error}
          </p>
        ) : null}
      </div>

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
