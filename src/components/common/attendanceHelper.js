
import { formatDate, formatTime } from "./DateTimeHelper";

export function getSlotDescription(teacherName, date) {
  const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(date);
  return `${teacherName}: ${dayName}, ${formatDate(date)} в ${formatTime(date)}`;
}
