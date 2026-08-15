import { useDictionaryLookup } from "../helpers/useDictionaryLookup";
import { useTextToSpeech } from "../helpers/useTextToSpeech";

type TypingToolsProps = {
  text: string;
};

export function TypingTools({ text }: TypingToolsProps) {
  const speech = useTextToSpeech();
  const dictionary = useDictionaryLookup();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => speech.speak(text)}
        className="block w-full rounded-none border-0 bg-transparent p-0 text-left"
        aria-label="Speak study text"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Study tools
        </p>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          Click the text to hear it. Double-click any word below for a definition.
        </p>
      </button>

      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <button
            key={`${word}-${index}`}
            type="button"
            onDoubleClick={() => void dictionary.lookupWord(word)}
            className="rounded-full bg-white/5 px-3 py-1 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            {word}
          </button>
        ))}
      </div>

      {dictionary.isLoading ? (
        <p className="text-sm text-zinc-500">Looking up word...</p>
      ) : null}

      {dictionary.entry ? (
        <dl className="grid gap-3 sm:grid-cols-2">
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
