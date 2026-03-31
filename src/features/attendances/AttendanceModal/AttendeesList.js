import { Link } from "react-router-dom";

import { Avatar } from "../../../components/Avatar";
import { Button, ToneBadge } from "../../../components/ui";
import AttendeeStatus, { getAttendeeStatusColor, getAttendeeStatusName } from "../../../constants/AttendeeStatus";

export function AttendeesList({ attendance, onAttendeeStatusChange }) {
  if (!attendance || !attendance.attendees || attendance.attendees.length === 0) {
    return <p className="text-center text-[14px] text-text-muted">Нет учеников</p>;
  }

  return (
    <div className="mb-3 flex flex-col gap-3">
      {attendance.attendees.map((attendee) => (
        <div
          key={attendee.attendeeId}
          className="flex flex-col gap-4 rounded-[20px] border border-white/10 bg-inner-bg p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Avatar style={{ width: "40px", height: "40px" }} />
            <div>
              <Link
                to={`/student/${attendee.studentId}`}
                className="text-[16px] font-medium text-text-main no-underline transition hover:text-accent"
              >
                {attendee.student.firstName} {attendee.student.lastName}
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {attendee.status === AttendeeStatus.NEW ? (
              <>
                <Button
                  variant="outlineDanger"
                  size="sm"
                  onClick={() => onAttendeeStatusChange(attendance.attendanceId, attendee.attendeeId, AttendeeStatus.MISSED)}
                >
                  Пропущено
                </Button>
                <Button
                  variant="outlineSuccess"
                  size="sm"
                  onClick={() => onAttendeeStatusChange(attendance.attendanceId, attendee.attendeeId, AttendeeStatus.ATTENDED)}
                >
                  Посещено
                </Button>
              </>
            ) : (
              <ToneBadge
                label={getAttendeeStatusName(attendee.status)}
                tone={getAttendeeStatusColor(attendee.status)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
