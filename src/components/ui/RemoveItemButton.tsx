import type { ButtonHTMLAttributes } from "react";
import { Button } from "./Button";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export function RemoveItemButton({
  children = "X",
  label = "Удалить",
  type = "button",
  ...props
}: Props) {
  return (
    <Button
      variant="outlineDanger"
      size="sm"
      type={type}
      aria-label={label}
      {...props}
    >
      {children}
    </Button>
  );
}

export default RemoveItemButton;