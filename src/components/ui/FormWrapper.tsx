import type { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const FormWrapper = ({ children, className = "", ...props }: Props) => {
  return (
    <div
      className={`mx-auto max-w-3xl rounded-[32px] bg-card-bg p-6 shadow-2xl sm:p-8 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};

export default FormWrapper;