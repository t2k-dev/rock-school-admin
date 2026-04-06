import { ChevronDown, ChevronUp } from "lucide-react";
import { useTariffInstrumentSelect } from "../../features/tariffs/TariffForm/model/useTariffInstrumentSelect";
import { useState } from "react";

interface InstrumentIcon {
  id: number;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

interface Props {
  label: string;
  name: string;
  value: number[];
  instruments: InstrumentIcon[];
  onChange: (name: string, value: number[]) => void;
  error?: string;
}

export const DisciplineSelect = ({
  label,
  name,
  value,
  instruments,
  onChange,
  error,
}: Props) => {
  const [isHoverCard, setIsHoverCard] = useState(false);

  const { isOpen, containerRef, toggleOpen, toggleInstrument, deleteAll } =
    useTariffInstrumentSelect({ value, name, onChange });

  const selectedInstruments = instruments.filter((inst) =>
    value.includes(inst.id),
  );

  return (
    <div className="w-full text-text-main" ref={containerRef}>
      <div className="flex justify-between w-full items-center">
        <label className="block text-lg font-medium mb-3 text-text-muted ml-2">
          {label}
        </label>

        {value.length > 0 && (
          <button
            type="button"
            onClick={deleteAll}
            className="font-medium text-danger rounded-full px-2 transition-all outline-none border-none"
            style={{ backgroundColor: "transparent" }}
          >
            Очистить всё
          </button>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={toggleOpen}
          className={`w-full bg-[#363B42] flex items-center justify-between px-4 py-3 outline-none transition-all h-auto border-none
            ${!isOpen ? "rounded-2xl" : "rounded-t-2xl"}            
            `}
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-text-main">
            {selectedInstruments.length > 0 ? (
              selectedInstruments.map((inst) => (
                <div
                  key={inst.id}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <inst.icon className="w-6 h-6 text-white" />
                  <span className="text-xl font-semibold">{inst.name}</span>
                </div>
              ))
            ) : (
              <span className="text-xl font-light text-text-main">
                выберите...
              </span>
            )}
          </div>

          <div className="ml-4 text-text-muted flex-shrink-0">
            {isOpen ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-20 w-full bg-[#363B42] rounded-b-2xl p-6">
            <div className="grid grid-cols-3 gap-4 justify-items-center max-h-[420px] overflow-y-auto custom-scrollbar">
              {instruments.map((inst) => {
                const Icon = inst.icon;
                const isSelected = value.includes(inst.id);
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => toggleInstrument(inst.id)}
                    className={`transition-all w-full h-28 p-3 bg-white/5 rounded-2xl hover:bg-accent/20 
                      outline-none border-none 
                      flex flex-col items-center justify-center gap-2 
                      text-text-main
                      ${isSelected && "bg-accent"}`}
                  >
                    {Icon ? (
                      <Icon className="w-9 h-9 shrink-0" />
                    ) : (
                      <div className="w-9 h-9 bg-gray-500" />
                    )}
                    <p className="text-center text-xs break-words w-full px-1">
                      {inst.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-danger text-sm font-medium ml-2">{error}</p>
      )}
    </div>
  );
};
