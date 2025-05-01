export function getAttendanceStatusName(statusId) {
  const attendanceStatusesRu = [
    { id: 1, name: "Новое" },
    { id: 2, name: "Посещено" },
    { id: 3, name: "Пропущено" },
    { id: 4, name: "Отменено студентом" },
    { id: 5, name: "Отменено админом" },
    { id: 6, name: "Отменено преподавателем" },
  ];

  return attendanceStatusesRu.find((item) => item.id === statusId).name;
}
