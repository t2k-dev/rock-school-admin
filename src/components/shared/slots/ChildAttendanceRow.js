import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import AttendanceStatus from '../../../constants/AttendanceStatus';
import { Avatar } from '../Avatar';

const ChildAttendanceRow = ({ 
  attendance, 
  onStatusChange, 
  disabled = false 
}) => {
  const handleAttendedClick = () => {
    onStatusChange(attendance.attendanceId, AttendanceStatus.ATTENDED);
  };

  const handleMissedClick = () => {
    onStatusChange(attendance.attendanceId, AttendanceStatus.MISSED);
  };

  const getAttendedButtonVariant = (targetStatus) => {
    return attendance.status === targetStatus ? 'success' : 'outline-success';
  };

  const getMissedButtonVariant = (targetStatus) => {
    return attendance.status === targetStatus ? 'danger' : 'outline-danger';
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          <Avatar 
            style={{ 
              width: "20px", 
              height: "20px", 
              marginRight: "8px" 
            }} 
          />
          <Link to={`/student/${attendance.student.studentId}`}>
            {attendance.student.firstName} {attendance.student.lastName}
          </Link>
        </div>
      </td>
      <td>
        <div className="d-flex gap-2">
          <Button
            onClick={handleAttendedClick}
            variant={getAttendedButtonVariant(AttendanceStatus.ATTENDED)}
            size="sm"
            disabled={disabled}
            style={{ minWidth: "100px" }}
          >
            Посещено
          </Button>
          <Button
            onClick={handleMissedClick}
            variant={getMissedButtonVariant(AttendanceStatus.MISSED)}
            size="sm"
            disabled={disabled}
            style={{ minWidth: "100px" }}
          >
            Пропущено
          </Button>
        </div>
      </td>
    </tr>
  );
};

ChildAttendanceRow.propTypes = {
  attendance: PropTypes.shape({
    attendanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.number,
    student: PropTypes.shape({
      studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ChildAttendanceRow;