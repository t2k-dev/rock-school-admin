interface InputProps {
  label: string;
  name: string;
  type?: "text" | "number" | "date";
  value: string | number;
  placeholder?: string;
  error?: string;
  step?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TariffInput = ({
  label,
  name,
  type = "text",
  value,
  placeholder,
  error,
  step,
  onChange,
}: InputProps) => {
  return (
    <div className="w-full text-text-main">
      <label className="block text-lg font-medium mb-3 text-text-muted">
        {label} :
      </label>

      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          step={step}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-main-bg text-text-main px-4 py-3 rounded-2xl outline-none appearance-none transition-all text-xl"
          style={{
            boxShadow: "none",
            border: "none",
          }}
        />
      </div>

      {error && (
        <p className="mt-2 text-danger text-sm font-medium ml-2">{error}</p>
      )}
    </div>
  );
};
