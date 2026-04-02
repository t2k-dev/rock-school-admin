import React, { useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  isClickable?: boolean;
  hoverColor?: string;
}

export const MicroIcon: React.FC<IconProps> = ({
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
      viewBox="0 0 27 47"
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
        d="M16.5105 45.5351C16.4641 45.8563 16.1887 46.0947 15.8643 46.0947H10.9102C10.5857 46.0947 10.3103 45.8563 10.2639 45.5351L7.38354 25.5714C7.33716 25.2501 7.06177 25.0117 6.7373 25.0117H0.652832C0.292236 25.0117 0 24.7194 0 24.3588V16.1569C0 15.753 0.363037 15.446 0.761475 15.5131L13.2781 17.6233C13.3501 17.6354 13.4233 17.6354 13.4954 17.6233L26.012 15.5131C26.4104 15.446 26.7734 15.753 26.7734 16.1569V24.3588C26.7734 24.7194 26.4812 25.0117 26.1206 25.0117H20.0371C19.7126 25.0117 19.4373 25.2501 19.3909 25.5714L16.5105 45.5351ZM19.1416 0C20.5837 8.39233e-05 21.7527 1.16926 21.7529 2.61133V11.6113C21.7529 13.0536 20.5837 14.2235 19.1416 14.2236H7.63184C6.18945 14.2236 5.02051 13.0536 5.02051 11.6113V2.61133C5.02075 1.16921 6.1897 0 7.63184 0H19.1416Z"
        fill={currentColor}
      />
    </svg>
  );
};
