import React from "react";
import { format } from "date-fns";
import { CalendarIcon, DoorIcon, TimeIcon } from "../../components/icons";
import { HoverCard } from "../../components/ui";
import { getRoomName } from "../../constants/rooms";
import { formatDateWithLetters } from "../../utils/dateTime";
import { AttendanceStatusBadge } from "../attendances/AttendanceStatusBadge";

interface Attendance {
  attendanceId: string | number;
  startDate: string | Date;
  endDate: string | Date;
  roomId: string | number;
  status: number;
  comment?: string;
}

interface AttendanceCardProps {
  attendance: Attendance;
  onClick?: (attendance: Attendance) => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  attendance,
  onClick,
}) => {
  const formatTime = (date: string | Date) => {
    try {
      return format(new Date(date), "HH:mm");
    } catch (error) {
      return "--:--";
    }
  };

  return (
    <HoverCard
      className="mb-3 p-4"
      onClick={() => onClick && onClick(attendance)}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-[140px]">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <CalendarIcon size="14px" />
            <span>Дата</span>
          </div>
          <div className="font-bold text-[#2D3748]">
            {formatDateWithLetters(attendance.startDate)}
          </div>
        </div>

        <div className="min-w-[120px]">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <TimeIcon size="14px" />
            <span>Время</span>
          </div>
          <div className="font-bold text-[#2D3748]">
            {formatTime(attendance.startDate)} —{" "}
            {formatTime(attendance.endDate)}
          </div>
        </div>

        <div className="min-w-[100px]">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <DoorIcon size="14px" />
            <span>Комната</span>
          </div>
          <div className="font-bold text-[#2D3748]">
            {getRoomName(attendance.roomId)}
          </div>
        </div>

        <div className="flex-1 min-w-0 md:max-w-[200px]">
          <div className="text-sm text-gray-500">Комментарий</div>
          <div
            className="truncate font-medium text-[#4A5568]"
            title={attendance.comment || ""}
          >
            {attendance.comment || <span className="text-gray-400">—</span>}
          </div>
        </div>

        {/* Статус */}
        <div className="flex md:justify-end">
          <AttendanceStatusBadge status={attendance.status} />
        </div>
      </div>
    </HoverCard>
  );
};
