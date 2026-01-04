import { useState } from "react";

export function CancelIcon({ onIconClick, color = "#000000" }) {
  const [setColor] = useState("#000000"); // Default color

  const handleClick = (e) => {
    if (onIconClick) {
      onIconClick(e);
    }
  };

  return (
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 16 16"
        id="cancel"
        onClick={handleClick}
        width="20"
        height="20"
        viewBox="0 0 30 30"
        fill="none"
      >
        <circle cx="12" cy="12" r="9" stroke={color} stroke-width="2"/>
        <path d="M18 18L6 6" stroke={color} stroke-width="2"/>
      </svg>
    </span>
  );
}
