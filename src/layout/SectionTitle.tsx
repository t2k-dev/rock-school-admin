import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export const SectionTitle = ({ children, className = "", ...props }: Props) => {
  return (
    <h2
      className={`m-0 text-[28px] font-semibold text-text-main sm:text-[34px] mb-8 ${className}`.trim()}
      {...props}
    >
      {children}
    </h2>
  );
};

export default SectionTitle;