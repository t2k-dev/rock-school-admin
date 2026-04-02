import { SORTERED_BY } from "../model/constants";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";

interface SortingI {
  handleSorting: (sortBy: string) => void;
  sortByMarker: string;
}

export const Sorting = ({ handleSorting, sortByMarker }: SortingI) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex gap-4 items-center">
      <button
        className={`
    ${isOpen ? "bg-danger/40 hover:bg-danger/70" : "bg-accent/40 hover:bg-accent/70"} 
    transition-all rounded-2xl py-2 px-4
    cursor-pointer flex items-center justify-center text-text-main
    w-[170px]
    text-sm font-semibold
  `}
        style={{ backgroundColor: isOpen ? "" : "transparent", border: "none" }}
        onClick={() => {
          setIsOpen((prev) => !prev);
          handleSorting("none");
        }}
      >
        <div className="flex items-center gap-2">
          <span>{!isOpen ? "Сортировка по" : "Отменить"}</span>
          <div className="shrink-0">
            {!isOpen ? <ChevronRight size={18} /> : <X size={18} />}
          </div>
        </div>
      </button>
      <div
        className={`${!isOpen && "-translate-x-10 opacity-0 pointer-events-none"} flex gap-2 transition-all`}
      >
        {SORTERED_BY.map((sort) => (
          <button
            key={sort.id}
            onClick={() => handleSorting(sort.sortBy)}
            className={`
                ${sortByMarker === sort.sortBy ? "bg-accent" : "bg-accent/40"}
                px-6 py-2 hover:bg-accent text-text-main text-sm font-semibold rounded-2xl`}
            style={{ border: "none" }}
          >
            {sort.name}
          </button>
        ))}
      </div>
    </div>
  );
};
