import { useId, useState, type ReactNode } from "react";

type CollapsePanelProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsePanel({
  title,
  defaultOpen = false,
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
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-3 py-3 text-left transition hover:bg-white/5"
      >
        <h3 className="text-sm font-medium tracking-[0.18em] text-zinc-100 uppercase">
          {title}
        </h3>
        <span className="text-sm text-zinc-500">{open ? "−" : "+"}</span>
      </button>

      {open ? (
        <div id={id} className="px-3 pb-3 pt-1">
          {children}
        </div>
      ) : null}
    </section>
  );
}
