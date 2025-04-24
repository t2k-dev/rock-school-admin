export function getRoomName(id) {
    const roomsRu = [
      { id: 1, name: "Гитарная" },
      { id: 2, name: "Вокальная" },
      { id: 3, name: "ХЗ" },
      { id: 4, name: "Барабанная" },
      { id: 5, name: "Жёлтая" },
      { id: 6, name: "Зелёная" },
    ];
  
    return roomsRu.find((status) => status.id === id).name;
  }