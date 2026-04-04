import { useState } from "react";

export function RefreshIcon({
  onIconClick,
  color: initialColor = "#94a3b8", // Используем ваш стандартный серый
  title = "Обновить",
  size = "20px",
  isClickable = false,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Вычисляем цвет на лету
  const currentColor = isClickable && isHovered ? "#e2e7f6" : initialColor;

  return (
    <span title={title} style={{ display: "inline-block", lineHeight: 0 }}>
      <svg
        style={{
          cursor: isClickable ? "pointer" : "default",
          verticalAlign: "middle",
          marginBottom: "2px",
        }}
        onClick={(e) => isClickable && onIconClick && onIconClick(e)}
        onMouseEnter={() => isClickable && setIsHovered(true)}
        onMouseLeave={() => isClickable && setIsHovered(false)}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.9381 13C19.979 12.6724 20 12.3387 20 12C20 7.58172 16.4183 4 12 4C9.49942 4 7.26681 5.14727 5.7998 6.94416M4.06189 11C4.02104 11.3276 4 11.6613 4 12C4 16.4183 7.58172 20 12 20C14.3894 20 16.5341 18.9525 18 17.2916M15 17H18V17.2916M5.7998 4V6.94416M5.7998 6.94416V6.99993L8.7998 7M18 20V17.2916"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
