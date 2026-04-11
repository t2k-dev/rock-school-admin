interface ColorLegend {
  id: number;
  desc: string;
  color: string;
}

const legendOFColors: ColorLegend[] = [
  {
    id: 1,
    desc: "Новое",
    color: "bg-accent",
  },
  {
    id: 2,
    desc: "Отмененно",
    color: "bg-secondary",
  },
  {
    id: 3,
    desc: "Завершено",
    color: "bg-success",
  },
  {
    id: 4,
    desc: "Пропущено",
    color: "bg-pink",
  },
  {
    id: 5,
    desc: "Пробное",
    color: "bg-warning",
  },
];

export const ColorLegend = () => {
  return (
    <div className="flex gap-10">
      {legendOFColors.map((col) => (
        <div className="flex gap-3 items-center">
          <div className={`w-3 h-3 rounded-[2px] ${col.color}`} />
          <span className="text-sm font-light">{col.desc}</span>
        </div>
      ))}
    </div>
  );
};
