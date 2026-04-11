import { CalendarIcon } from "../../components/icons";
import { HoverCard } from "../../components/ui";
import { formatDateWithLetters } from "../../utils/dateTime";
import { AttendanceStatusBadge } from "../attendances/AttendanceStatusBadge";

interface Attendance {
  startDate: string | Date;
  status: string;
  [key: string]: any; 
}

interface BandAttendanceCardProps {
  attendance: Attendance;
  onClick?: (attendance: Attendance) => void;
}

export const BandAttendanceCard = ({ 
  attendance, 
  onClick 
}: BandAttendanceCardProps) => {
  return (
    <HoverCard 
      className="mb-3 p-4"
      onClick={() => onClick && onClick(attendance)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <CalendarIcon size="16px" color="currentColor" />
            <span>Дата</span>
          </div>
          <div className="font-bold text-text-main">
            {formatDateWithLetters(attendance.startDate)}
          </div>
        </div>

        <div className="flex items-center">
          <AttendanceStatusBadge status={attendance.status} />
        </div>
      </div>
    </HoverCard>
  );
};

export default BandAttendanceCard;