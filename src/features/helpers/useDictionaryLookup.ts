import { useCallback, useState } from "react";

export type DictionaryEntry = {
  word: string;
  partOfSpeech: string;
  definition: string;
  phonetic?: string;
};

export function useDictionaryLookup() {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupWord = useCallback(async (word: string) => {
    const normalized = word.trim().replace(/^[^\w']+|[^\w']+$/g, "");
    if (!normalized) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`
      );

      if (!response.ok) {
        throw new Error("Dictionary lookup failed.");
      }

      const data = (await response.json()) as Array<{
        word: string;
        phonetic?: string;
        meanings?: Array<{
          partOfSpeech?: string;
          definitions?: Array<{ definition?: string }>;
        }>;
      }>;
      const first = data[0];
      const meaning = first?.meanings?.[0];
      const definition = meaning?.definitions?.[0]?.definition ?? "No definition found.";

      setEntry({
        word: first?.word ?? normalized,
        phonetic: first?.phonetic,
        partOfSpeech: meaning?.partOfSpeech ?? "noun",
        definition
      });
    } catch (lookupError) {
      setEntry(null);
      setError(lookupError instanceof Error ? lookupError.message : "Dictionary lookup failed.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    entry,
    isLoading,
    error,
    lookupWord,
    clear: () => setEntry(null)
  };
}
