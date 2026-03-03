export function getAttendanceLengthName(lengthId) {
  if (!lengthId) {
    return "(none)";
  }
  const attendanceLengthsRu = [
    { id: 60, name: "60 мин." },
    { id: 90, name: "90 мин." },
    { id: 120, name: "120 мин." },
  ];

  return attendanceLengthsRu.find((item) => item.id === lengthId).name;
}
