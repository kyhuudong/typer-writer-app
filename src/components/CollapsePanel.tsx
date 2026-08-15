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
        className="flex h-10 w-10 items-center justify-center rounded-2xl text-left transition hover:bg-white/5"
      >
        {icon ? <span className="text-zinc-400">{icon}</span> : <span className="text-zinc-500">{open ? "−" : "+"}</span>}
      </button>

      {open ? (
        <div id={id} className="px-2 pb-3 pt-2">
          {children}
        </div>
      ) : null}
    </section>
  );
}
