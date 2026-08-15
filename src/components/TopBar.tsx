type TopBarProps = {
  userName?: string | null;
};

export function TopBar({ userName }: TopBarProps) {
  return (
    <div className="flex items-center justify-between bg-black/20 px-6 py-4 backdrop-blur">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Minimalism
        </p>
        <h1 className="text-lg font-medium text-zinc-100">Minimal Typer</h1>
      </div>
      <p className="text-sm text-zinc-400">
        {userName ? `Signed in as ${userName}` : "Local file mode"}
      </p>
    </div>
  );
}
