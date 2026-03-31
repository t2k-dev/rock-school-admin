import { Link } from "react-router-dom";

import AttendanceType, { getAttendanceTypeName } from "../../../constants/AttendanceType";
import { getDisciplineName } from "../../../constants/disciplines";
import { DisciplineIcon } from "../../disciplines/DisciplineIcon";

export function AttendanceHeaderInfo({ attendance }) {
  if (!attendance) {
    return null;
  }

  switch (attendance.attendanceType) {
    case AttendanceType.TRIAL_LESSON:
    case AttendanceType.LESSON:
    case AttendanceType.GROUP_LESSON: {
      const { teacher, disciplineId } = attendance;
      return (
        <div className="flex items-start gap-3 text-left">
          <div className="mt-2 shrink-0">
            <DisciplineIcon disciplineId={disciplineId} size="40px" />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <div className="text-[18px] font-semibold text-text-main">
              {getDisciplineName(disciplineId)}
            </div>
            <div>
              {teacher && (
                <Link
                  to={`/teacher/${teacher.teacherId}`}
                  className="text-[14px] text-accent no-underline transition hover:opacity-80"
                >
                  {teacher.firstName}
                </Link>
              )}
            </div>
          </div>
        </div>
      );
    }
    default:
      return (
        <div className="text-[18px] font-semibold text-text-main">
          {getAttendanceTypeName(attendance.attendanceType)}
        </div>
      );
  }
}
