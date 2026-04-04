import { useState } from "react";

export function LocationIcon({
  onIconClick,
  color: initialColor = "#94a3b8",
  title = "Местоположение",
  size = "18px",
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
        viewBox="-4 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={currentColor}
          d="M12,9 C10.343,9 9,10.343 9,12 C9,13.657 10.343,15 12,15 C13.657,15 15,13.657 15,12 C15,10.343 13.657,9 12,9 L12,9 Z M12,17 C9.239,17 7,14.762 7,12 C7,9.238 9.239,7 12,7 C14.761,7 17,9.238 17,12 C17,14.762 14.761,17 12,17 L12,17 Z M12,0 C5.373,0 0,5.373 0,12 C0,17.018 10.005,32.011 12,32 C13.964,32.011 24,16.95 24,12 C24,5.373 18.627,0 12,0 L12,0 Z"
        />
      </svg>
    </span>
  );
}
