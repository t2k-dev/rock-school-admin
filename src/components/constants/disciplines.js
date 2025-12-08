export function getDisciplineName(disciplineId) {
  const disciplinesRu = [
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
  
  return disciplinesRu.find((discipline) => discipline.id === disciplineId).name;
}
