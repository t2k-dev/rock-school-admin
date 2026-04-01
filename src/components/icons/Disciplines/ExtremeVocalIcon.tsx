import React, { useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  isClickable?: boolean;
  hoverColor?: string;
}

export const ExtremeVocalIcon: React.FC<IconProps> = ({
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
      viewBox="0 0 25 55"
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
        d="M15.0312 54.0734C14.9928 54.4025 14.714 54.6507 14.3827 54.6507H10.4972C10.1659 54.6507 9.88709 54.4025 9.84873 54.0734L7.45987 33.5795C7.42151 33.2504 7.14272 33.0022 6.81139 33.0022H1.98881C1.62824 33.0022 1.33594 32.7099 1.33594 32.3494V23.9206C1.33594 23.5064 1.71666 23.1969 2.12213 23.2815L12.3071 25.4061C12.395 25.4244 12.4858 25.4244 12.5738 25.4061L22.7577 23.2815C23.1632 23.1969 23.5439 23.5064 23.5439 23.9206V32.3494C23.5439 32.7099 23.2516 33.0022 22.8911 33.0022H18.0685C17.7372 33.0022 17.4584 33.2504 17.42 33.5795L15.0312 54.0734ZM24.0195 0.265917C24.0933 -0.123476 24.666 -0.069849 24.666 0.326464V10.68C24.666 10.7736 24.6258 10.8632 24.5557 10.9251L20.0068 14.9349C19.796 15.1208 19.6758 15.3891 19.6758 15.6702V21.2112C19.6758 21.752 19.2371 22.1906 18.6963 22.1907H6.16211C5.62146 22.1905 5.18359 21.7519 5.18359 21.2112V15.8392C5.18359 15.558 5.06248 15.2897 4.85156 15.1038L0.110352 10.9251C0.040078 10.8632 2.99066e-05 10.7737 0 10.68V0.326464C0 -0.069849 0.572751 -0.123476 0.646484 0.265917L2.25977 8.78447C2.289 8.93833 2.42349 9.04987 2.58008 9.0501H22.085C22.2417 9.04994 22.3771 8.93846 22.4062 8.78447L24.0195 0.265917Z"
        fill={currentColor}
      />
    </svg>
  );
};
