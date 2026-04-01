import React, { useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  isClickable?: boolean;
  hoverColor?: string;
}

export const ElectroGuitarIcon: React.FC<IconProps> = ({
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
      viewBox="0 0 32 61"
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.4363 47.0255C19.4504 47.3955 19.1542 47.7031 18.7839 47.7031H13.6676C13.2973 47.7031 13.0011 47.3955 13.0152 47.0255L14.4022 10.5468C14.4162 10.1768 14.1201 9.86914 13.7498 9.86914H12.3068C11.9088 9.86914 11.6034 9.51604 11.6608 9.12217L12.9081 0.558768C12.9548 0.237933 13.2299 0 13.5541 0H18.8965C19.2207 0 19.4958 0.237898 19.5426 0.558705L20.7907 9.12211C20.8481 9.516 20.5427 9.86914 20.1447 9.86914H18.7018C18.3315 9.86914 18.0353 10.1768 18.0494 10.5468L19.4363 47.0255Z"
        fill={currentColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.0821 43.6938C26.0268 43.8415 26.0268 44.0042 26.0821 44.1519L31.9431 59.7978C32.1574 60.3698 31.5389 60.8965 31.0083 60.5939L16.3159 52.2138C16.1154 52.0995 15.8694 52.0995 15.6689 52.2138L0.978472 60.5938C0.447872 60.8965 -0.170669 60.3698 0.0435909 59.7977L5.90372 44.1519C5.95902 44.0042 5.95902 43.8415 5.90372 43.6939L0.0435477 28.0479C-0.170707 27.4759 0.447801 26.9492 0.978402 27.2518L15.669 35.631C15.8694 35.7453 16.1154 35.7453 16.3159 35.631L31.0084 27.2517C31.539 26.9491 32.1574 27.4758 31.9432 28.0479L26.0821 43.6938Z"
        fill={currentColor}
      />
    </svg>
  );
};
