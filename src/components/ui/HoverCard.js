import PropTypes from "prop-types";
import { Colors } from "../../constants/Colors";

export const HoverCard = ({
  children,
  onClick,
  className = "",
  style = {},
  hoverTransform = "translateY(-2px)",
  transition = "transform 0.2s, box-shadow 0.2s",
  clickable = true,
  as: Component = "div",
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const baseTransform = style.transform || "translateY(0)";
  const baseShadow = style.boxShadow || "";

  const cardStyle = {
    cursor: clickable ? "pointer" : "default",
    transition,
    backgroundColor: Colors.innerBg,
    color: Colors.textMain,
    ...style,
  };

  const cardClassName = [
    "block overflow-hidden rounded-[10px] border-0 p-4 no-underline shadow-none",
    clickable ? "cursor-pointer" : "cursor-default",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleMouseEnter = (e) => {
    if (clickable) {
      e.currentTarget.style.transform = hoverTransform;
    }

    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e) => {
    if (clickable) {
      e.currentTarget.style.transform = baseTransform;
    }

    onMouseLeave?.(e);
  };

  const handleClick = (e) => {
    if (onClick && clickable) {
      onClick(e);
    }
  };

  return (
    <Component
      className={cardClassName}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Component>
  );
};

HoverCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  hoverTransform: PropTypes.string,
  hoverShadow: PropTypes.string,
  transition: PropTypes.string,
  clickable: PropTypes.bool,
  as: PropTypes.elementType,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};