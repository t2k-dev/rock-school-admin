import { useState, useEffect, useRef } from "react";

interface UseInstrumentSelectProps {
  value: number[];
  name: string;
  onChange: (name: string, value: number[]) => void;
}

export const useTariffInstrumentSelect = ({
  value,
  name,
  onChange,
}: UseInstrumentSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const toggleInstrument = (id: number) => {
    const newValue = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id];
    onChange(name, newValue);
  };

  const deleteAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(name, []);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return {
    isOpen,
    containerRef,
    toggleOpen,
    toggleInstrument,
    deleteAll,
  };
};
