
import AttendanceStatus from "../constants/AttendanceStatus";
import { formatDate, formatTime } from "./DateTimeHelper";

export function getSlotDescription(teacherName, date) {
  const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(date);
  return `${teacherName}: ${dayName}, ${formatDate(date)} в ${formatTime(date)}`;
}

export function isCancelledAttendanceStatus(status){
  const cancelledStatuses = [AttendanceStatus.CANCELED_BY_ADMIN, AttendanceStatus.CANCELED_BY_STUDENT, AttendanceStatus.CANCELED_BY_TEACHER]
  return cancelledStatuses.includes(status);
}
