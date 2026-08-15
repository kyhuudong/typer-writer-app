export function AppShell() {
  return (
    <main className="min-h-screen bg-surface-950 text-zinc-50">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            Minimalism
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Minimal Typer</h1>
          <p className="max-w-2xl text-zinc-300">
            A calm, local-first English typing practice app.
          </p>
        </header>
      </section>
    </main>
  );
}
