import React, { useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  isClickable?: boolean;
  hoverColor?: string;
}

export const UkuleleIcon: React.FC<IconProps> = ({
  size = 40,
  color = "currentColor",
  isClickable = false,
  hoverColor = "#455CC8",
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentColor = isClickable && isHovered ? hoverColor : color;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: isClickable ? "pointer" : "default",
        transition: "all 0.2s ease",
        transform: "rotate(30deg)",
        display: "inline-block",
        ...style,
      }}
      {...props}
    >
      <path
        d="M13.7793 7.50826C13.7793 7.86883 13.487 8.16113 13.1264 8.16113H13.1109C12.7503 8.16113 12.458 8.45343 12.458 8.814L12.458 24.1557C12.458 24.5163 12.1657 24.8086 11.8051 24.8086H9.19388C8.83331 24.8086 8.54102 24.5163 8.54102 24.1557L8.54102 8.80615C8.54102 8.44992 8.25223 8.16113 7.896 8.16113C7.53976 8.16113 7.25098 7.87235 7.25098 7.51611L7.25098 0.652869C7.25098 0.292299 7.54328 0 7.90385 0L13.1264 0C13.487 0 13.7793 0.292299 13.7793 0.652869V7.50826Z"
        fill={currentColor}
      />
      <path
        d="M13.4365 20.239C16.1407 20.239 18.3329 22.4312 18.333 25.1354C18.333 27.2281 18.4236 32.133 19.5322 33.9079C20.4646 35.4009 21 37.1449 21 39.0085C20.9998 44.5311 16.2987 49.0083 10.5 49.0085C4.70113 49.0085 0.000193063 44.5312 0 39.0085C-8.14354e-08 37.1455 0.535052 35.4018 1.4668 33.9089C2.57522 32.133 2.66504 27.2288 2.66504 25.1354C2.66514 22.4312 4.85731 20.239 7.56152 20.239C9.42804 20.2391 11.57 20.2391 13.4365 20.239ZM10.499 25.7888C7.97519 25.7888 5.92897 27.8343 5.92871 30.3581C5.92871 32.8821 7.97504 34.9284 10.499 34.9284C13.023 34.9284 15.0693 32.8821 15.0693 30.3581C15.0691 27.8343 13.0228 25.7888 10.499 25.7888Z"
        fill={currentColor}
      />
    </svg>
  );
};
