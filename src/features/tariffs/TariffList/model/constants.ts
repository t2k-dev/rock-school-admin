interface Isort {
  id: number;
  sortBy: string;
  name: string;
}

export const SORTERED_BY: Isort[] = [
  {
    id: 1,
    sortBy: "attendanceCount",
    name: "Занятиям",
  },
  {
    id: 2,
    sortBy: "attendanceLength",
    name: "Длительности",
  },
  {
    id: 3,
    sortBy: "amount",
    name: "Сумме",
  },
];
