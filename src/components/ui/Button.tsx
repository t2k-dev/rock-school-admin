import type { ButtonHTMLAttributes } from "react";

const VARIANT_CLASSES = {
  primary: "bg-accent text-text-main hover:opacity-90",
  outlineDanger:"border border-[var(--danger)] text-danger bg-[rgba(200,69,69,0.12)] hover:bg-[rgba(200,69,69,0.2)]",
  outlineSuccess: "border border-emerald-500/60 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20",
  ghost: "border border-white/10 text-text-main hover:bg-white/[0.04]",
} as const;

const SIZE_CLASSES = {
  md: "px-5 py-3 text-[15px]",
  sm: "px-4 py-2.5 text-[14px]",
  lg: "px-6 py-3.5 text-[16px]",
} as const;

type ButtonVariant = keyof typeof VARIANT_CLASSES;
type ButtonSize = keyof typeof SIZE_CLASSES;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export const Button = ({
  children,
  className = "",
  disabled = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: Props) => {
  const variantClass = VARIANT_CLASSES[variant];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-[14px] font-medium transition ${sizeClass} ${variantClass} ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;