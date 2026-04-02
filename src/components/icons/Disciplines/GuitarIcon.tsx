import React, { useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  isClickable?: boolean;
  hoverColor?: string;
}

export const GuitarIcon: React.FC<IconProps> = ({
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
      viewBox="0 0 32 55"
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
        d="M13.7583 8.26074C13.7583 8.01211 13.5567 7.81055 13.3081 7.81055C13.0595 7.81055 12.8579 7.60899 12.8579 7.36035L12.8579 0.652869C12.8579 0.2923 13.1502 0 13.5108 0L19.0576 0C19.4181 0 19.7104 0.292299 19.7104 0.652869V7.33447C19.7104 7.5974 19.4973 7.81055 19.2344 7.81055C18.9714 7.81055 18.7583 8.02369 18.7583 8.28662L18.7583 24.1577C18.7583 24.5182 18.466 24.8105 18.1054 24.8105H14.4112C14.0506 24.8105 13.7583 24.5182 13.7583 24.1577L13.7583 8.26074Z"
        fill={currentColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.4355 23.3137C23.8013 23.314 27.3406 26.2282 27.3408 29.8224C27.3409 31.6195 27.6762 33.6588 28.9297 34.9465C30.8598 36.9289 31.9999 39.3721 32 42.0148C31.9998 48.642 24.8362 54.0146 16 54.0148C7.16355 54.0148 0.000176309 48.6421 0 42.0148C6.77177e-05 39.4686 1.05688 37.1074 2.86035 35.1652C4.1252 33.8031 4.4404 31.6813 4.44043 29.8224C4.44062 26.228 7.97968 23.3138 12.3457 23.3137H19.4355ZM16.2637 30.0002C13.9305 30.0003 12.0391 31.9427 12.0391 34.3391C12.0391 36.7354 13.9305 38.6778 16.2637 38.6779C18.5969 38.6779 20.4883 36.7354 20.4883 34.3391C20.4883 31.9426 18.5969 30.0002 16.2637 30.0002Z"
        fill={currentColor}
      />
    </svg>
  );
};
