import { format } from "date-fns";
import { ru } from "date-fns/locale";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import {
    CalendarIcon,
    DoorIcon,
    EditIcon,
    TimeIcon,
} from "../../../components/icons";
import { getRoomName } from "../../../constants/rooms";
import { isCancelledAttendanceStatus } from "../attendanceHelper";

export const AttendanceDateAndRoom = ({
  attendanceId,
  roomId,
  startDate,
  endDate,
  isCompleted = false,
  status = 0,
  showRescheduleLink = true,
  className = "",
  style = {},
  attendance,
  dateFormat = "d MMMM, EEEE",
  timeFormat = "HH:mm",
}) => {
  const history = useHistory();

  const formatDate = (date, formatStr = dateFormat) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return format(dateObj, formatStr, { locale: ru });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Некорректная дата";
    }
  };

  const formatTime = (date, formatStr = timeFormat) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return format(dateObj, formatStr);
    } catch (error) {
      console.error("Time formatting error:", error);
      return "--:--";
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();

    history.push({
      pathname: `/attendance/${attendanceId}/rescheduleForm`,
      state: { attendance },
    });
  };

  const shouldShowRescheduleLink = () => {
    return (
      showRescheduleLink &&
      !isCompleted &&
      !isCancelledAttendanceStatus(status) &&
      attendanceId
    );
  };

  return (
    <div
      className={`relative text-start ${className}`.trim()}
      style={style}
    >
      {shouldShowRescheduleLink() && (
        <div className="absolute right-0 top-0">
          <EditIcon
            onIconClick={handleEditClick}
            size="18px"
            title="Перенести урок"
          />
        </div>
      )}

      <div className="mb-1 flex items-center gap-1.5 text-[14px] text-text-main">
        <DoorIcon />
        <span>{getRoomName(roomId)}</span>
      </div>

      <div className="mb-1 flex items-center gap-1.5 text-[14px] text-text-main">
        <CalendarIcon />
        <span>{formatDate(startDate)}</span>
      </div>

      <div className="mb-2 flex items-center gap-1.5 text-[14px] text-text-main">
        <TimeIcon />
        <span>
          С {formatTime(startDate)} - {formatTime(endDate)}
        </span>
      </div>
    </div>
  );
};

AttendanceDateAndRoom.propTypes = {
  attendanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    .isRequired,
  isCompleted: PropTypes.bool,
  status: PropTypes.number,
  showRescheduleLink: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  attendance: PropTypes.object.isRequired, // Full attendance object for reschedule
  dateFormat: PropTypes.string,
  timeFormat: PropTypes.string,
};
