import { useState } from "react";

export function DoorIcon({
  onIconClick,
  color: initialColor = "#94a3b8",
  title = "Выход",
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
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fillRule="evenodd">
          <path d="m0 0h32v32h-32z" />
          <path
            d="m0 32v-2h5v-30h22v30h5v2zm25-30h-18v28h18zm-3 11v8h-2v-8z"
            fill={currentColor}
            fillRule="nonzero"
          />
        </g>
      </svg>
    </span>
  );
}
