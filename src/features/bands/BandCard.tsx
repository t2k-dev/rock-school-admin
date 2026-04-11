import React, { ReactNode, MouseEvent } from "react";
import { Colors } from "../../constants/Colors";

interface HoverCardProps<T extends React.ElementType> {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  hoverTransform?: string;
  transition?: string;
  clickable?: boolean;
  as?: T;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
}

type CombinedProps<T extends React.ElementType> = HoverCardProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof HoverCardProps<T>>;

export const HoverCard = <T extends React.ElementType = "div">({
  children,
  onClick,
  className = "",
  style = {},
  hoverTransform = "translateY(-4px)",
  transition = "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  clickable = true,
  as,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CombinedProps<T>) => {
  const Component = as || "div";

  const cardStyle: React.CSSProperties = {
    cursor: clickable ? "pointer" : "default",
    transition,
    backgroundColor: Colors.innerBg,
    color: Colors.textMain,
    display: "block",
    textDecoration: "none",
    ...style,
  };

  const cardClassName = [
    "overflow-hidden rounded-[20px] border-0 p-4 shadow-sm",
    clickable ? "hover:shadow-md" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
    if (clickable) {
      e.currentTarget.style.transform = hoverTransform;
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
    if (clickable) {
      e.currentTarget.style.transform = style.transform || "translateY(0)";
    }
    onMouseLeave?.(e);
  };

  return (
    <Component
      className={cardClassName}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};
