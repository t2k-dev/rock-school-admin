import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

const VARIANT_CLASSES = {
  primary: "bg-accent text-text-main hover:opacity-90",
  danger: "bg-danger text-text-main hover:opacity-90",
  secondary: "bg-secondary text-text-main hover:opacity-90",
  
  outlineDanger:"border border-[var(--danger)] text-danger bg-[rgba(200,69,69,0.12)] hover:bg-[rgba(200,69,69,0.2)]",
  outlineSuccess: "border border-emerald-500/60 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20",
} as const;

const SIZE_CLASSES = {
  md: "px-5 py-3 text-[15px]",
  sm: "px-4 py-2.5 text-[14px]",
  lg: "px-6 py-3.5 text-[16px]",
} as const;

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
  variant = "primary",
  ...props
}: Props<C>) => {
  const Component = as || "button";
  const variantClass = VARIANT_CLASSES[variant];
  const sizeClass = SIZE_CLASSES[size];
  const disabledClass = disabled ? "cursor-not-allowed opacity-60" : "";
  const isNativeButton = Component === "button";

  return (
    <Component
      className={`rounded-[14px] font-medium transition no-underline ${sizeClass} ${variantClass} ${disabledClass} ${className}`.trim()}
      {...(isNativeButton ? { type, disabled } : {})}
      {...(!isNativeButton && disabled ? { "aria-disabled": true } : {})}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;