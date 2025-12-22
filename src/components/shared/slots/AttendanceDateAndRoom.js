import { format } from "date-fns";
import { ru } from "date-fns/locale";
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";

import { isCancelledAttendanceStatus } from "../../common/attendanceHelper";
import { CalendarIcon } from "../icons/CalendarIcon";
import { DoorIcon } from "../icons/DoorIcon";
import { EditIcon } from "../icons/EditIcon";
import { TimeIcon } from "../icons/TimeIcon";

import { getRoomName } from "../../../constants/rooms";

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
      console.error('Date formatting error:', error);
      return 'Некорректная дата';
    }
  };

  const formatTime = (date, formatStr = timeFormat) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return format(dateObj, formatStr);
    } catch (error) {
      console.error('Time formatting error:', error);
      return '--:--';
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
    <div className={`text-start ${className}`} style={style}>
      {/* Room Information */}
      <div className="d-flex align-items-center mb-1">
        <DoorIcon />
        <span className="ms-1">{getRoomName(roomId)}</span>
      </div>

      {/* Date Information */}
      <div className="d-flex align-items-center mb-1">
        <CalendarIcon />
        <span className="ms-1" style={{ fontSize: "14px" }}>
          {formatDate(startDate)}
        </span>
      </div>

      {/* Time Information */}
      <div className="d-flex align-items-center mb-2">
        <TimeIcon />
        <span className="ms-1" style={{ marginRight: "30px" }}>
          С {formatTime(startDate)} - {formatTime(endDate)}
        </span>
        {/* Reschedule Link */}
        {shouldShowRescheduleLink() && (
          <EditIcon onIconClick={handleEditClick} />
        )}
      </div>
      
      
    </div>
  );
};

AttendanceDateAndRoom.propTypes = {
  attendanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  isCompleted: PropTypes.bool,
  status: PropTypes.number,
  showRescheduleLink: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  attendance: PropTypes.object.isRequired, // Full attendance object for reschedule
  dateFormat: PropTypes.string,
  timeFormat: PropTypes.string,
};