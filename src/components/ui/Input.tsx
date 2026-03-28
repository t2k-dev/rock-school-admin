import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "md" | "sm";
}

const SIZE_CLASSES = {
  md: "px-4 py-3 text-[16px]",
  sm: "px-3 py-2 text-[14px]",
} as const;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className = "", inputSize = "md", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-[14px] border border-white/10 bg-input-bg text-text-main outline-none transition placeholder:text-text-muted/30 focus:border-white/20 focus:ring-2 focus:ring-accent ${SIZE_CLASSES[inputSize]} ${className}`.trim()}
      {...props}
    />
  );
});

export default Input;