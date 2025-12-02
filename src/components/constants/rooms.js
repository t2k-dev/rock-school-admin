export function getRoomName(id) {
  const roomsRu = [
    { id: 1, name: "Красная" },
    { id: 2, name: "Вокальная" },
    { id: 3, name: "ХЗ" },
    { id: 4, name: "Барабанная" },
    { id: 5, name: "Жёлтая" },
    { id: 6, name: "Зелёная" },
  ];

  var room = roomsRu.find((status) => status.id === parseInt(id));
  if (!room) {
    return `not found (id:${id})`;
  }

  return room.name;
}
