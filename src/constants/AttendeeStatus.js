// Constants as frozen object for immutability
const AttendeeStatus = Object.freeze({
  NEW: 1,
  ATTENDED: 2,
  MISSED: 3,
  CANCELED: 4,
});

// Status names mapping
const AttendeeStatusNames = {
  [AttendeeStatus.NEW]: "Новое",
  [AttendeeStatus.ATTENDED]: "Посещено",
  [AttendeeStatus.MISSED]: "Пропущено",
  [AttendeeStatus.CANCELED]: "Отменено",
};

// Status colors for UI (optional)
const AttendeeStatusColors = {
  [AttendeeStatus.NEW]: "primary",
  [AttendeeStatus.ATTENDED]: "success",
  [AttendeeStatus.MISSED]: "danger",
  [AttendeeStatus.CANCELED]: "warning",
};

// Helper functions
export function getAttendeeStatusName(statusId) {
  if (!statusId) {
    return "(none)";
  }
  return AttendeeStatusNames[statusId] || "Неизвестный статус";
}

export function getAttendeeStatusColor(statusId) {
  if (!statusId) {
    return "secondary";
  }
  return AttendeeStatusColors[statusId] || "secondary";
}

export function isNewStatus(statusId) {
  return statusId === AttendeeStatus.NEW;
}

export function isAttendedStatus(statusId) {
  return statusId === AttendeeStatus.ATTENDED;
}

export function isMissedStatus(statusId) {
  return statusId === AttendeeStatus.MISSED;
}

export function isCanceledStatus(statusId) {
  return statusId === AttendeeStatus.CANCELED;
}

// Get all attendance statuses as array (useful for dropdowns)
export function getAllAttendeeStatuses() {
  return Object.entries(AttendeeStatusNames).map(([id, name]) => ({
    id: parseInt(id),
    name
  }));
}

export default AttendeeStatus;