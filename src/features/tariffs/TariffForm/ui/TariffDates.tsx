interface DatesProps {
  label: string;
  name: string;
  type?: "text" | "number" | "date";
  value: string | number;
  placeholder?: string;
  error?: string;
  step?: string;
  isEnd?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TariffDates = ({
  label,
  name,
  type = "date",
  value,
  placeholder,
  error,
  step,
  onChange,
  isEnd,
}: DatesProps) => {
  return (
    <div>
      <div
        className={`flex flex-col gap-3 p-4 rounded-2xl ${!isEnd ? "bg-blue-500/70" : "bg-red-500/70"}`}
      >
        <label className="text-text-main">{label} :</label>

        <input
          type={type}
          name={name}
          value={value}
          step={step}
          onChange={onChange}
          placeholder={placeholder}
          className="px-4 py-2 bg-black/40 outline-none text-text-main rounded-full"
          style={{
            boxShadow: "none",
            border: "none",
          }}
        />
      </div>
      {error && (
        <div className="max-w-40">
          <p className="mt-2 text-danger text-wrap text-sm font-medium ml-2">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};
