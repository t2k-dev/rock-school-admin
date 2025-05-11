
import AttendanceStatus from "../constants/AttendanceStatus";
import { getRoomName } from "../constants/rooms";

import { formatDate, formatTime } from "./DateTimeHelper";

export function getSlotDescriptionWithTeacherName(slot) {
  const date = slot.start;
  const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(date);
  return `${slot.teacherFullName}: ${dayName}, ${formatDate(date)} в ${formatTime(date)} (${getRoomName(slot.roomId)})`;
}

export function getSlotDescription(slot) {
  const date = slot.start;
  const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(date);
  return `${dayName}, ${formatDate(date)} в ${formatTime(date)} (${getRoomName(slot.roomId)})`;
}

export function isCancelledAttendanceStatus(status){
  const cancelledStatuses = [AttendanceStatus.CANCELED_BY_ADMIN, AttendanceStatus.CANCELED_BY_STUDENT, AttendanceStatus.CANCELED_BY_TEACHER]
  return cancelledStatuses.includes(status);
}
