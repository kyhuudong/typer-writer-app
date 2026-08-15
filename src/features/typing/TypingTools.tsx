import { useDictionaryLookup } from "../helpers/useDictionaryLookup";
import { useTextToSpeech } from "../helpers/useTextToSpeech";
import { SecondaryButton } from "../../components/SecondaryButton";

type TypingToolsProps = {
  text: string;
};

export function TypingTools({ text }: TypingToolsProps) {
  const speech = useTextToSpeech();
  const dictionary = useDictionaryLookup();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <SecondaryButton onClick={() => speech.speak(text)} className="px-4 py-2">
          Listen
        </SecondaryButton>
        <p className="text-sm text-zinc-500">
          Double-click a word to open a dictionary lookup.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <button
            key={`${word}-${index}`}
            type="button"
            onDoubleClick={() => void dictionary.lookupWord(word)}
            className="rounded-full border border-zinc-800 bg-surface-950 px-3 py-1 text-sm text-zinc-300 transition hover:border-accent-400/50"
          >
            {word}
          </button>
        ))}
      </div>

      {dictionary.isLoading ? (
        <p className="text-sm text-zinc-500">Looking up word...</p>
      ) : null}

      {dictionary.entry ? (
        <dl className="grid gap-3 rounded-2xl border border-zinc-800 bg-surface-950 p-4 sm:grid-cols-2">
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
  );
}
