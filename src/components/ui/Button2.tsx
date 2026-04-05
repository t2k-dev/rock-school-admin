interface BtnI {
  type: "accent" | "danger" | "secondary" | "success" | "warning" | "pink";
  value: string;
  onClick: () => void;
}

const accent = "bg-accent/40 hover:bg-accent/70 active:bg-accent";
const danger = "bg-danger/40 hover:bg-danger/70 active:bg-danger";
const secondary = "bg-secondary/40 hover:bg-secondary/70 active:bg-secondary";
const success = "bg-success/40 hover:bg-success/70 active:bg-success";
const warning = "bg-warning/40 hover:bg-warning/70 active:bg-warning";
const pink = "bg-pink/40 hover:bg-pink/70 active:bg-pink";

export const Button2 = ({ type, value, onClick }: BtnI) => {
  return (
    <button
      className={`py-2.5 px-5 text-text-main rounded-2xl`}
      onClick={onClick}
    ></button>
  );
};
