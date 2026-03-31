import { ChevronDown, ChevronUp } from "lucide-react";
import { useTariffSelect } from "../model/useTariffSelect";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string | number;
  options: Option[];
  error?: string;
  onChange: (name: string, value: string | number) => void;
}

export const TariffSelect = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
}: SelectProps) => {
  const { isOpen, containerRef, toggleOpen, close } = useTariffSelect();

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "выберите...";

  return (
    <div className="w-full rounded-xl text-text-main" ref={containerRef}>
      <label className="block text-lg font-medium mb-3 text-text-muted">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={toggleOpen}
          className={`w-full bg-[#363B42] text-text-main text-left px-4 py-3 outline-none transition-all 
          flex justify-between
          border-none shadow-none
          ${!isOpen ? "rounded-2xl" : "rounded-t-2xl"}
          `}
        >
          <span className="text-xl font-medium">{selectedLabel}</span>
          <div className="ml-4 text-text-muted">
            {isOpen ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full">
            <ul className="space-y-3 list-none bg-[#363B42] rounded-b-2xl p-4">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(name, option.value);
                    close();
                  }}
                  className="px-4 py-1 bg-white/5 rounded-full hover:bg-white/20 cursor-pointer transition-colors"
                >
                  <span className="text-xl font-medium text-text-main">
                    {option.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-danger text-sm font-medium ml-2">{error}</p>
      )}
    </div>
  );
};
