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
