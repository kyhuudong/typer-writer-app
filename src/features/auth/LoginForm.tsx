import { useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginCredentials } from "../../types/progress";
import { useAppStore } from "../../store/useAppStore";

type LoginFormProps = {
  onSubmit?: (credentials: LoginCredentials) => void | Promise<void>;
  onImportFile?: (file: File) => void | Promise<void>;
  onExportFile?: () => void | Promise<void>;
  isBusy?: boolean;
  error?: string | null;
};

export function LoginForm({
  onSubmit,
  onImportFile,
  onExportFile,
  isBusy,
  error
}: LoginFormProps) {
  const storeSubmit = useAppStore((state) => state.signIn);
  const storeImport = useAppStore((state) => state.importProgressFile);
  const storeExport = useAppStore((state) => state.saveProgress);
  const storeBusy = useAppStore((state) => state.isBusy);
  const storeError = useAppStore((state) => state.error);
  const progress = useAppStore((state) => state.progress);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const busy = isBusy ?? storeBusy;
  const message = error ?? storeError;
  const hasLoadedFile = progress !== null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const credentials = { username, password };
    if (onSubmit) {
      await onSubmit(credentials);
      return;
    }
    await storeSubmit(credentials);
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

  async function handleExport() {
    if (onExportFile) {
      await onExportFile();
      return;
    }
    await storeExport();
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

      {/* Context hint */}
      <p className="text-xs leading-5 text-zinc-500">
        {hasLoadedFile
          ? `File loaded as "${progress.username}" — sign in to continue.`
          : "First time? Any name + password creates a new profile."}
      </p>

      {/* Load JSON — most common first step */}
      <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10">
        <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 3v10M5 9l5 5 5-5" />
          <path d="M3 17h14" />
        </svg>
        Load JSON
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImport}
        />
      </label>

      {/* Sign-in form */}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          aria-label="Username"
          autoComplete="username"
          className="w-full rounded-xl bg-black/30 px-3 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 outline-none ring-1 ring-white/5 transition focus:ring-white/20"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Password"
          autoComplete="current-password"
          className="w-full rounded-xl bg-black/30 px-3 py-2.5 text-sm text-zinc-50 placeholder-zinc-600 outline-none ring-1 ring-white/5 transition focus:ring-white/20"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="flex-1 rounded-xl bg-white/10 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/15 disabled:opacity-50"
          >
            {busy ? "…" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={busy}
            className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-zinc-500 transition hover:bg-white/5 disabled:opacity-50"
          >
            Save
          </button>
        </div>

        {message ? (
          <p className="text-xs text-rose-400" role="alert">{message}</p>
        ) : null}
      </form>

      <p className="text-[10px] text-zinc-600">All data stays on your device.</p>
    </div>
  );
}
