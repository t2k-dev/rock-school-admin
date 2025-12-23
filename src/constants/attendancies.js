export function getAttendanceStatusName(statusId) {
  if (!statusId) {
    return "(none)";
  }
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

export function getAttendanceLengthName(lengthId) {
  if (!lengthId) {
    return "(none)";
  }
  const attendanceLengthsRu = [
    { id: 1, name: "60 мин." },
    { id: 2, name: "90 мин." },
  ];

  return attendanceLengthsRu.find((item) => item.id === lengthId).name;
}
