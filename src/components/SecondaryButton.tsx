import type { ButtonHTMLAttributes } from "react";

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function SecondaryButton({
  className = "",
  type = "button",
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-full border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
