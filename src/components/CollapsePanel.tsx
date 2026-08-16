import { useId, useState, type ReactNode } from "react";

type CollapsePanelProps = {
  title: string;
  defaultOpen?: boolean;
  icon?: ReactNode;
  children: ReactNode;
};

export function CollapsePanel({
  title,
  defaultOpen = false,
  icon,
  children
}: CollapsePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <section className="rounded-2xl bg-black/10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={title}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left transition hover:bg-white/5"
      >
        {icon && <span className="shrink-0 text-zinc-400">{icon}</span>}
        <span className="flex-1 text-xs font-medium tracking-wide text-zinc-300">
          {title}
        </span>
        <svg
          viewBox="0 0 20 20"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 text-zinc-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>

      {open ? (
        <div id={id} className="px-2 pb-3 pt-1">
          {children}
        </div>
      ) : null}
    </section>
  );
}
