import React, { useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  isClickable?: boolean;
  hoverColor?: string;
}

export const BassGuitarIcon: React.FC<IconProps> = ({
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
      viewBox="0 0 29 61"
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
        d="M18.5337 48.2434C18.5506 48.6151 18.2537 48.9258 17.8815 48.9258H11.2243C10.8522 48.9258 10.5553 48.6151 10.5721 48.2434L12.2935 10.2615C12.3103 9.88974 12.0135 9.5791 11.6413 9.5791H9.69602C9.28887 9.5791 8.98103 9.21049 9.05361 8.80985L10.5524 0.536489C10.6087 0.225866 10.8791 0 11.1948 0H17.9179C18.2336 0 18.504 0.225832 18.5603 0.536426L20.06 8.80979C20.1326 9.21045 19.8247 9.5791 19.4176 9.5791H17.4646C17.0924 9.5791 16.7955 9.88974 16.8124 10.2615L18.5337 48.2434Z"
        fill={currentColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.958008 31.7535C0.639818 30.1918 2.95908 29.6114 4.51367 30.8639L11.9551 36.8593C12.5934 37.3735 13.3883 37.6539 14.2079 37.6539H14.9073C15.239 37.6539 15.5691 37.608 15.8881 37.5174L25.502 34.7877C26.6547 34.4603 27.8076 35.0199 27.5518 35.7828L25.8497 40.8553C25.3613 42.3108 25.9045 43.8759 26.8929 45.0506C28.2293 46.6387 28.9999 48.5034 29 50.4996C29 56.2986 22.5081 60.9996 14.5 60.9996C6.4921 60.9996 0.000364823 56.2994 0 50.5006C-1.80803e-07 47.965 1.24233 45.6402 3.30872 43.8257C3.36715 43.7744 3.39052 43.694 3.375 43.6178L0.958008 31.7535Z"
        fill={currentColor}
      />
    </svg>
  );
};
