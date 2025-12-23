export const DISCIPLINES = [
  { id: 0, name: "Неизвестно" },
  { id: 1, name: "Гитара" },
  { id: 2, name: "Электро гитара" },
  { id: 3, name: "Бас гитара" },
  { id: 4, name: "Укулеле" },
  { id: 5, name: "Вокал" },
  { id: 6, name: "Барабаны" },
  { id: 7, name: "Фортепиано" },
  { id: 8, name: "Скрипка" },
  { id: 9, name: "Экстрим Вокал" },
];

// Available disciplines for selection (excluding "Unknown")
export const SELECTABLE_DISCIPLINES = DISCIPLINES.filter(discipline => discipline.id !== 0);

export function getDisciplineName(disciplineId) {
  const discipline = DISCIPLINES.find((discipline) => discipline.id === disciplineId);
  return discipline ? discipline.name : "Неизвестно";
}
