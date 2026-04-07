import { isCancelledAttendanceStatus } from "../../attendances/attendanceHelper";

export const HomeDataService = {
  // Подготовка ивентов для календаря
  prepareCalendarEvents: (
    attendances: any[] | null,
    showCanceled: boolean,
    getEventTitle: (a: any) => string,
  ) => {
    if (!attendances) return [];

    const filtered = showCanceled
      ? attendances
      : attendances.filter((a) => !isCancelledAttendanceStatus(a.status));

    return filtered.map((attendance) => ({
      id: attendance.attendanceId,
      title: getEventTitle(attendance),
      start: new Date(attendance.startDate),
      end: new Date(attendance.endDate),
      resourceId: attendance.roomId,
      status: attendance.status,
      attendanceType: attendance.attendanceType,
      disciplineId: attendance.disciplineId,
    }));
  },

  getGroupedNotes: (notes: any[] | null) => {
    if (!notes) return { active: [], completed: [] };

    const sorted = [...notes].sort(
      (a, b) =>
        new Date(b.completeDate).getTime() - new Date(a.completeDate).getTime(),
    );

    return {
      active: sorted.filter((n) => n.status === 1),
      completed: sorted.filter((n) => n.status === 2),
    };
  },
};
