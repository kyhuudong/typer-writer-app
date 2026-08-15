import { useId, useState, type ReactNode } from "react";

type CollapsePanelProps = {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsePanel({
  title,
  description,
  defaultOpen = false,
  children
}: CollapsePanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <section className="rounded-2xl bg-black/20">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 rounded-2xl px-4 py-3 text-left transition hover:bg-white/5"
      >
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-zinc-100">{title}</h3>
          {description ? (
            <p className="text-xs text-zinc-500">{description}</p>
          ) : null}
        </div>
        <span className="mt-1 text-sm text-zinc-500">{open ? "−" : "+"}</span>
      </button>

      {open ? (
        <div id={id} className="px-4 pb-4 pt-1">
          {children}
        </div>
      ) : null}
    </section>
  );
}
