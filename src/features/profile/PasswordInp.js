import { Colors } from "../../constants/Colors";
import { Eye, EyeOff } from "lucide-react";

export const PasswordInput = ({
  label,
  name,
  value,
  showState,
  fieldKey,
  placeholder,
  onChange,
  onToggle,
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label
      className="text-[14px] font-light ml-1"
      style={{ color: Colors.textMuted }}
    >
      {label}
    </label>
    <div className="relative">
      <input
        type={showState ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange} // Используем пропс
        placeholder={placeholder}
        className="w-full h-[60px] border-none rounded-[16px] px-6 text-[17px] focus:outline-none transition-all focus:ring-2 focus:ring-[#455CC8]/50"
        style={{ backgroundColor: Colors.mainBg, color: Colors.textMain }}
        required
      />
      <button
        type="button"
        onClick={() => onToggle(fieldKey)} // Используем пропс
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer opacity-30 hover:opacity-100 transition-opacity"
        style={{ color: Colors.textMain }}
      >
        {showState ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
);
