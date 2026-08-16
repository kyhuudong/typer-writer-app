import { useEffect, useRef } from "react";

type TranslationTooltipProps = {
  word: string;
  translation: string | null;
  loading: boolean;
  error: string | null;
  x: number;
  y: number;
  onDismiss: () => void;
};

export function TranslationTooltip({
  word,
  translation,
  loading,
  error,
  x,
  y,
  onDismiss
}: TranslationTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Dismiss on Escape key.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onDismiss]);

  // Keep tooltip inside the viewport horizontally.
  const tooltipWidth = 180;
  const clampedX = Math.min(x, window.innerWidth - tooltipWidth - 12);

  return (
    <div
      ref={ref}
      role="tooltip"
      style={{ left: clampedX, top: y - 8 }}
      className="pointer-events-none fixed z-[200] -translate-y-full"
    >
      <div className="rounded-xl border border-white/10 bg-zinc-900/95 px-3 py-2 shadow-xl backdrop-blur-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
          {word}
        </p>
        {loading && (
          <p className="mt-0.5 text-sm text-zinc-500 italic">translating…</p>
        )}
        {!loading && translation && (
          <p className="mt-0.5 text-sm font-medium text-cyan-300">{translation}</p>
        )}
        {!loading && error && (
          <p className="mt-0.5 text-xs text-rose-400">{error}</p>
        )}
        {/* Small arrow */}
        <div className="absolute left-4 top-full h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-zinc-900/95" />
      </div>
    </div>
  );
}
