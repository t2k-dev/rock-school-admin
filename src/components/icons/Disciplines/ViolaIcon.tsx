import React, { useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
  isClickable?: boolean;
  hoverColor?: string;
}

export const ViolaIcon: React.FC<IconProps> = ({
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
      viewBox="0 0 32 63"
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
        d="M15.999 0C17.6559 1.07372e-05 18.999 1.1193 18.999 2.5C18.999 2.59719 18.9905 2.69282 18.9775 2.78711C18.9912 2.88403 18.999 2.98302 18.999 3.08301C18.9988 4.02248 18.3711 4.8396 17.457 5.2666L17.9023 24.7852C24.278 25.4089 29.1768 29.1204 29.1768 33.6064C29.1768 33.7055 29.1737 33.8041 29.1689 33.9023C29.1734 33.9974 29.1768 34.0927 29.1768 34.1885C29.1767 34.9312 29.0412 35.6522 28.7881 36.3418C25.7751 36.6027 23.4073 38.5229 23.2275 40.9014C23.4191 43.4313 26.0864 45.4421 29.3721 45.4893C31.0331 47.1957 32 49.2388 32 51.4346C32 51.5427 31.9969 51.6504 31.9922 51.7578C31.9952 51.8439 32 51.9301 32 52.0166C31.9998 57.9945 24.8363 62.8407 16 62.8408C7.16361 62.8408 0.00016228 57.9945 0 52.0166C0 51.9301 0.00385241 51.8439 0.00683594 51.7578C0.00217193 51.6505 9.71495e-06 51.5427 0 51.4346C0 49.2392 0.965801 47.1956 2.62598 45.4893C5.91233 45.4427 8.57986 43.4316 8.77148 40.9014C8.59163 38.5227 6.22415 36.6025 3.21094 36.3418C2.95794 35.6522 2.82325 34.9311 2.82324 34.1885C2.82324 34.0927 2.82565 33.9974 2.83008 33.9023C2.82532 33.8041 2.82325 33.7055 2.82324 33.6064C2.82324 29.1211 7.72048 25.4108 14.0947 24.7861L14.541 5.2666C13.6218 4.83951 12.9992 4.02223 12.999 3.08301C12.999 2.98439 13.0062 2.88665 13.0195 2.79102C13.0062 2.69554 12.999 2.59847 12.999 2.5C12.999 1.11936 14.3423 0.000121971 15.999 0Z"
        fill={currentColor}
      />
    </svg>
  );
};
