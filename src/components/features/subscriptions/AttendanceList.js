import PropTypes from "prop-types";
import { NoRecords } from "../../shared/NoRecords";
import { AttendanceCard } from "./AttendanceCard";

export const AttendanceList = ({ 
  attendances, 
  onAttendanceClick
}) => {
  if (!attendances || attendances.length === 0) {
    return (
      <div className="text-center py-4">
        <NoRecords />
      </div>
    );
  }

  return (
    <div className="mb-3">
      {attendances.map((attendance) => (
        <AttendanceCard
          key={attendance.attendanceId}
          attendance={attendance}
          onClick={onAttendanceClick}
        />
      ))}
    </div>
  );
};

AttendanceList.propTypes = {
  attendances: PropTypes.array.isRequired,
  onAttendanceClick: PropTypes.func,
};

AttendanceList.defaultProps = {
  onAttendanceClick: () => {},
};