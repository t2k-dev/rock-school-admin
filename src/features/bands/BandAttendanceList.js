import PropTypes from "prop-types";
import { NoRecords } from "../../components/NoRecords";
import { BandAttendanceCard } from "./BandAttendanceCard";

export const BandAttendanceList = ({ 
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
        <BandAttendanceCard
          key={attendance.attendanceId}
          attendance={attendance}
          onClick={onAttendanceClick}
        />
      ))}
    </div>
  );
};

BandAttendanceList.propTypes = {
  attendances: PropTypes.array.isRequired,
  onAttendanceClick: PropTypes.func,
};

BandAttendanceList.defaultProps = {
  onAttendanceClick: () => {},
};
