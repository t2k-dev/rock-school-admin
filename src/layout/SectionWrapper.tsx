import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const SectionWrapper = ({ children, className = "", ...props }: Props) => {
  return (
    <div className={`px-4 pb-8 pt-10 sm:px-6 lg:px-8 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default SectionWrapper;