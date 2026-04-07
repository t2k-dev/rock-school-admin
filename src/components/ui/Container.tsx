import {
  ElementType,
  ReactNode,
  ComponentPropsWithoutRef,
  CSSProperties,
} from "react";
import { Colors } from "../../constants/Colors";

interface CustomCSS extends CSSProperties {
  "--container-bg"?: string;
}

interface ContainerOwnProps<C extends ElementType> {
  children?: ReactNode;
  className?: string;
  as?: C;
  style?: CustomCSS;
}

type ContainerProps<C extends ElementType> = ContainerOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof ContainerOwnProps<C>>;

export const Container = <C extends ElementType = "div">({
  children,
  className = "",
  style = {},
  as,
  ...props
}: ContainerProps<C>) => {
  const Component = as || "div";

  const containerClassName = [
    "bg-[var(--container-bg)] p-10 rounded-[30px]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle = {
    "--container-bg": Colors.cardBg,
    ...style,
  } as React.CSSProperties;

  return (
    <Component className={containerClassName} style={containerStyle} {...props}>
      {children}
    </Component>
  );
};
