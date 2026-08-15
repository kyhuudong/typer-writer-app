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
    <section className="rounded-3xl border border-zinc-800 bg-surface-900">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-surface-800/60"
      >
        <div className="space-y-1">
          <h3 className="text-base font-medium text-zinc-50">{title}</h3>
          {description ? (
            <p className="text-sm text-zinc-400">{description}</p>
          ) : null}
        </div>
        <span className="mt-1 text-sm text-zinc-500">{open ? "−" : "+"}</span>
      </button>

      {open ? (
        <div id={id} className="border-t border-zinc-800 px-5 py-5">
          {children}
        </div>
      ) : null}
    </section>
  );
}
