import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const VARIANT_CLASSES = {
  accent: "bg-accent/40 text-text-main hover:bg-accent/70 active:bg-accent",
  primary: "bg-accent/40 text-text-main hover:bg-accent/70 active:bg-accent",
  danger: "bg-danger/40 text-text-main hover:bg-danger/70 active:bg-danger",
  secondary:
    "bg-secondary/40 text-text-main hover:bg-secondary/70 active:bg-secondary",
  success: "bg-success/40 text-text-main hover:bg-success/70 active:bg-success",

  outlineDanger:
    "border border-[var(--danger)] text-danger bg-[rgba(200,69,69,0.12)] hover:bg-[rgba(200,69,69,0.2)]",
  outlineSuccess:
    "border border-emerald-500/60 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20",
  ghost: "border border-white/10 text-text-main hover:bg-white/[0.04]",
} as const;

const SIZE_CLASSES = {
  md: "px-5 py-3 text-[15px]",
  sm: "px-4 py-2.5 text-[14px]",
  lg: "px-6 py-3.5 text-[16px]",
} as const;

const DISABLED_CLASSES =
  "bg-gray-600 text-text-muted border-gray-600 cursor-not-allowed";

type ButtonVariant = keyof typeof VARIANT_CLASSES;
type ButtonSize = keyof typeof SIZE_CLASSES;

type ButtonOwnProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
};

type Props<C extends ElementType> = ButtonOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps<C>>;

export const Button = <C extends ElementType = "button">({
  as,
  children,
  className = "",
  disabled = false,
  size = "md",
  type = "button",
  variant = "accent",
  ...props
}: Props<C>) => {
  const Component = as || "button";

  const variantClass = disabled ? DISABLED_CLASSES : VARIANT_CLASSES[variant];
  const sizeClass = SIZE_CLASSES[size];
  const isNativeButton = Component === "button";

  return (
    <Component
      className={`rounded-[12px] font-medium transition no-underline flex items-center justify-center ${sizeClass} ${variantClass} ${className}`.trim()}
      {...(isNativeButton ? { type, disabled } : {})}
      {...(!isNativeButton && disabled
        ? { "aria-disabled": true, tabIndex: -1 }
        : {})}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
