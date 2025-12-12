export function getDayName(dayId) {
    const dayNamesRu = [
      { id: 0, name: "воскресенье" },
      { id: 1, name: "понедельник" },
      { id: 2, name: "вторник" },
      { id: 3, name: "среда" },
      { id: 4, name: "четверг" },
      { id: 5, name: "пятница" },
      { id: 6, name: "суббота" },
    ];
  
    return dayNamesRu.find((item) => item.id === dayId)?.name;
  }