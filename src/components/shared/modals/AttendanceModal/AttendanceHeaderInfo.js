import { Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import AttendanceType, { getAttendanceTypeName } from "../../../../constants/AttendanceType";
import { getDisciplineName } from "../../../../constants/disciplines";
import { DisciplineIcon } from "../../discipline/DisciplineIcon";

export function AttendanceHeaderInfo({ attendance }) {
  if (!attendance) {
    return null;
  }

  switch (attendance.attendanceType) {
    case AttendanceType.LESSON:
    case AttendanceType.GROUP_LESSON: {
      const { teacher, disciplineId } = attendance;
      return (
        <div className="d-flex mb-3">
          <div style={{ marginTop: "10px" }}>
            <DisciplineIcon disciplineId={disciplineId} size="40px" />
          </div>
          <Stack direction="vertical" gap={0} className="mb-2 text-center">
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>{getDisciplineName(disciplineId)}</div>
            <div>
              {teacher && <Link to={`/teacher/${teacher.teacherId}`}>{teacher.firstName}</Link>}
            </div>
          </Stack>
        </div>
      );
    }
    default:
      return (
        <div style={{ fontWeight: "bold", fontSize: "18px" }}>
          {getAttendanceTypeName(attendance.attendanceType)}
        </div>
      );
  }
}
