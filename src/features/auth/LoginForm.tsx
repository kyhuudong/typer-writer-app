import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppStore } from "../../store/useAppStore";

type LoginFormProps = {
  onImportFile?: (file: File) => void | Promise<void>;
  isBusy?: boolean;
  error?: string | null;
};

export function LoginForm({ onImportFile, isBusy, error }: LoginFormProps) {
  const signIn = useAppStore((state) => state.signIn);
  const storeImport = useAppStore((state) => state.importProgressFile);
  const storeBusy = useAppStore((state) => state.isBusy);
  const storeError = useAppStore((state) => state.error);
  const progress = useAppStore((state) => state.progress);

  const [username, setUsername] = useState("");

  const busy = isBusy ?? storeBusy;
  const message = error ?? storeError;
  const storedProfile = progress;

  function handleContinue() {
    if (storedProfile) {
      signIn(storedProfile.username);
    }
  }

  function handleStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = username.trim();
    if (!name) return;
    signIn(name);
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (onImportFile) {
      await onImportFile(file);
      return;
    }
    await storeImport(file);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500" aria-hidden="true">
          <circle cx="10" cy="7" r="3" />
          <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" />
        </svg>
        <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Local progress</p>
      </div>

      {storedProfile ? (
        /* Returning user — profile already loaded from localStorage or imported JSON */
        <div className="space-y-3">
          <p className="text-xs leading-5 text-zinc-400">
            Welcome back, <span className="text-zinc-200">{storedProfile.username}</span>.
          </p>
          <button
            type="button"
            onClick={handleContinue}
            disabled={busy}
            className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/15 disabled:opacity-50"
          >
            {busy ? "…" : `Continue as ${storedProfile.username}`}
          </button>
          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-zinc-400 transition hover:bg-white/10">
            <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3v10M5 9l5 5 5-5" />
              <path d="M3 17h14" />
            </svg>
            Import different JSON
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      ) : (
        /* New user — no profile in localStorage */
        <div className="space-y-3">
          <p className="text-xs leading-5 text-zinc-500">
            Enter any name to start tracking your progress.
          </p>
          <form className="space-y-3" onSubmit={handleStart}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              autoComplete="username"
              autoFocus
              className="w-full rounded-xl bg-black/30 px-3 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 outline-none ring-1 ring-white/5 transition focus:ring-white/20"
            />
            <button
              type="submit"
              disabled={busy || !username.trim()}
              className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/15 disabled:opacity-50"
            >
              {busy ? "…" : "Start"}
            </button>
          </form>
          <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-zinc-400 transition hover:bg-white/10">
            <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3v10M5 9l5 5 5-5" />
              <path d="M3 17h14" />
            </svg>
            Import progress JSON
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      )}

      {message ? (
        <p className="text-xs text-rose-400" role="alert">{message}</p>
      ) : null}

      <p className="text-[10px] text-zinc-600">All data stays on your device.</p>
    </div>
  );
}
