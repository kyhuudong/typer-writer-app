type TopBarProps = {
  userName?: string | null;
  onMenuClick?: () => void;
};

export function TopBar({ userName, onMenuClick }: TopBarProps) {
  return (
    <div className="flex items-center justify-between bg-black/10 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200 transition"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>
        <h1 className="text-base font-medium text-zinc-100">Typer</h1>
      </div>
      {userName && (
        <p className="text-sm text-zinc-500">{userName}</p>
      )}
    </div>
  );
}
