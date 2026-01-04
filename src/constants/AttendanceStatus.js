// Constants as frozen object for immutability
const AttendanceStatus = Object.freeze({
  NEW: 1,
  ATTENDED: 2,
  MISSED: 3,
  CANCELED_BY_STUDENT: 4,
  CANCELED_BY_TEACHER: 5,
  CANCELED_BY_ADMIN: 6,
});

// Status names mapping
const AttendanceStatusNames = {
  [AttendanceStatus.NEW]: "Новое",
  [AttendanceStatus.ATTENDED]: "Посещено",
  [AttendanceStatus.MISSED]: "Пропущено",
  [AttendanceStatus.CANCELED_BY_STUDENT]: "Отменено студентом",
  [AttendanceStatus.CANCELED_BY_TEACHER]: "Отменено преподавателем",
  [AttendanceStatus.CANCELED_BY_ADMIN]: "Отменено админом",
};

// Status colors for UI (optional)
const AttendanceStatusColors = {
  [AttendanceStatus.NEW]: "primary",
  [AttendanceStatus.ATTENDED]: "success",
  [AttendanceStatus.MISSED]: "danger",
  [AttendanceStatus.CANCELED_BY_STUDENT]: "warning",
  [AttendanceStatus.CANCELED_BY_TEACHER]: "secondary",
  [AttendanceStatus.CANCELED_BY_ADMIN]: "info",
};

// Helper functions
export function getAttendanceStatusName(statusId) {
  if (!statusId) {
    return "(none)";
  }
  return AttendanceStatusNames[statusId] || "Неизвестный статус";
}

export function getAttendanceStatusColor(statusId) {
  if (!statusId) {
    return "secondary";
  }
  return AttendanceStatusColors[statusId] || "secondary";
}

export function isNewStatus(statusId) {
  return statusId === AttendanceStatus.NEW;
}

export function isAttendedStatus(statusId) {
  return statusId === AttendanceStatus.ATTENDED;
}

export function isMissedStatus(statusId) {
  return statusId === AttendanceStatus.MISSED;
}

export function isCanceledStatus(statusId) {
  return statusId === AttendanceStatus.CANCELED_BY_STUDENT ||
         statusId === AttendanceStatus.CANCELED_BY_TEACHER ||
         statusId === AttendanceStatus.CANCELED_BY_ADMIN;
}

export function isCanceledByStudent(statusId) {
  return statusId === AttendanceStatus.CANCELED_BY_STUDENT;
}

export function isCanceledByTeacher(statusId) {
  return statusId === AttendanceStatus.CANCELED_BY_TEACHER;
}

export function isCanceledByAdmin(statusId) {
  return statusId === AttendanceStatus.CANCELED_BY_ADMIN;
}

export function isCompleted(statusId) {
  return statusId === AttendanceStatus.ATTENDED || 
         statusId === AttendanceStatus.MISSED ||
         isCanceledStatus(statusId);
}

export function isPending(statusId) {
  return statusId === AttendanceStatus.NEW;
}

// Get all attendance statuses as array (useful for dropdowns)
export function getAllAttendanceStatuses() {
  return Object.entries(AttendanceStatusNames).map(([id, name]) => ({
    id: parseInt(id),
    name
  }));
}

export default AttendanceStatus;