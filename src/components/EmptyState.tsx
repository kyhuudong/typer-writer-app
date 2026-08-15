import { PrimaryButton } from "./PrimaryButton";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <section className="rounded-3xl border border-dashed border-zinc-800 bg-surface-900/60 p-6 text-center">
      <div className="mx-auto max-w-sm space-y-3">
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-sm leading-6 text-zinc-400">{description}</p>
        {actionLabel && onAction ? (
          <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>
        ) : null}
      </div>
    </section>
  );
}
