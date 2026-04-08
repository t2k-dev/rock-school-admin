import type { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
} & Record<string, unknown>;

export function FormLabel({
  as: Component = "span",
  children,
  className = "",
  ...props
}: Props) {
  return (
    <Component
      className={`text-text-main mb-2 opacity-60 ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default FormLabel;