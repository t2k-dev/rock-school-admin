import { useState } from "react";

export function CancelIcon({
  onIconClick,
  color: initialColor = "#94a3b8",
  title = "Отмена",
  size = "20px",
  isClickable = false,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const currentColor = isClickable && isHovered ? "#e2e7f6" : initialColor;

  return (
    <span title={title}>
      <svg
        style={{
          cursor: isClickable ? "pointer" : "default",
          marginBottom: "2px",
        }}
        onClick={(e) => isClickable && onIconClick && onIconClick(e)}
        onMouseEnter={() => isClickable && setIsHovered(true)}
        onMouseLeave={() => isClickable && setIsHovered(false)}
        width={size}
        height={size}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="9" stroke={currentColor} strokeWidth="2" />
        <path d="M18 18L6 6" stroke={currentColor} strokeWidth="2" />
      </svg>
    </span>
  );
}
