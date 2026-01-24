// Constants as frozen object for immutability
const AttendanceType = Object.freeze({
  LESSON: 0,
  TRIAL_LESSON: 1,
  GROUP_LESSON: 2,
  RENT: 3,
  BAND_REHEARSAL: 4,
});

// Status names mapping
const AttendanceTypeNames = {
  [AttendanceType.LESSON]: "Урок",
  [AttendanceType.TRIAL_LESSON]: "Пробный урок",
  [AttendanceType.GROUP_LESSON]: "Групповой урок",
  [AttendanceType.RENT]: "Аренда",
  [AttendanceType.BAND_REHEARSAL]: "Репетиция группы",
};

// Helper functions
export function getAttendanceTypeName(typeId) {
  return AttendanceTypeNames[typeId] || "Неизвестный тип";
}

export default AttendanceType;