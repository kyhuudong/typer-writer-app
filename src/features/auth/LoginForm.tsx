import { useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginCredentials } from "../../types/progress";
import { useAppStore } from "../../store/useAppStore";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SecondaryButton } from "../../components/SecondaryButton";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const busy = isBusy ?? storeBusy;
  const message = error ?? storeError;

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
    if (!file) {
      return;
    }

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
    <section className="rounded-3xl bg-white/5 p-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
          Sign in
        </p>
        <h2 className="text-2xl font-medium">Load your local progress file</h2>
        <p className="text-sm leading-6 text-zinc-400">
          Keep your typing streak, scores, and completed lessons on your device.
        </p>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Username</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="w-full rounded-2xl bg-black/25 px-4 py-3 text-zinc-50 outline-none ring-1 ring-white/5 transition focus:ring-white/15"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="w-full rounded-2xl bg-black/25 px-4 py-3 text-zinc-50 outline-none ring-1 ring-white/5 transition focus:ring-white/15"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <PrimaryButton type="submit" disabled={busy}>
            Sign in
          </PrimaryButton>
          <label className="cursor-pointer rounded-full bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10">
            Load JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          <SecondaryButton onClick={handleExport} disabled={busy}>
            Save JSON
          </SecondaryButton>
        </div>

        {message ? (
          <p className="text-sm text-rose-300" role="alert">
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
