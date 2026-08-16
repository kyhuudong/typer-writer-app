import { useCallback, useRef, useState } from "react";

type TranslateResult = {
  translation: string | null;
  loading: boolean;
  error: string | null;
};

// Module-level cache shared across all hook instances so repeated words
// across lesson switches are never re-fetched.
const cache = new Map<string, string>();

export function useTranslate() {
  const [state, setState] = useState<TranslateResult>({
    translation: null,
    loading: false,
    error: null
  });

  // Stable abort controller ref so we can cancel in-flight requests.
  const controllerRef = useRef<AbortController | null>(null);

  const translate = useCallback(async (word: string) => {
    const key = word.toLowerCase().trim();
    if (!key) return;

    // Serve from cache immediately — no loading flash.
    if (cache.has(key)) {
      setState({ translation: cache.get(key)!, loading: false, error: null });
      return;
    }

    // Cancel any pending request.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ translation: null, loading: true, error: null });

    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(key)}&langpair=en|vi`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      const result: string = data?.responseData?.translatedText ?? "";
      cache.set(key, result);
      setState({ translation: result, loading: false, error: null });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setState({ translation: null, loading: false, error: "Translation unavailable" });
    }
  }, []);

  const clear = useCallback(() => {
    controllerRef.current?.abort();
    setState({ translation: null, loading: false, error: null });
  }, []);

  return { ...state, translate, clear };
}
