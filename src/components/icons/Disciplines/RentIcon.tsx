interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const RentalIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 31 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.3477 26.7533C23.8242 26.7533 30.6962 33.6245 30.6963 42.101C30.6963 50.5775 23.8242 57.4496 15.3477 57.4496C6.87134 57.4494 0 50.5774 0 42.101C4.07162e-05 33.6246 6.87136 26.7536 15.3477 26.7533ZM14.6143 33.1147V35.2875H9.4375V42.8588H19.6934V47.4008H10.8535V45.227H9.33984V48.9145H14.5166V51.0883H16.0312V48.9145H21.208V41.3441H10.9521V36.8022H19.791V38.976H21.3057V35.2875H16.1289V33.1147H14.6143Z"
        fill={color}
      />
      <path
        d="M19.2597 28.3965V4.36721L15.3425 0.975983L11.4253 4.36721L11.4253 7.56465L13.1228 9.67205L11.4253 11.7795L13.1228 14.3713L11.4253 16.9632L11.4253 28.3965"
        stroke={color}
        strokeWidth="1.47578"
      />
    </svg>
  );
};
