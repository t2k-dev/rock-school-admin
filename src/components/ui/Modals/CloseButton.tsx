import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export function CloseButton({
  className = "",
  label = "Закрыть",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-inner-bg text-[18px] text-text-main transition hover:border-white/20 hover:bg-white/[0.04] ${className}`.trim()}
      {...props}
    >
      ×
    </button>
  );
}

export default CloseButton;