import type { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  className = "",
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-full bg-accent-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
