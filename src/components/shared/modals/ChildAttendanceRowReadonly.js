import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar } from '../Avatar';
import { AttendanceStatusBadge } from "../modals/AttendanceStatusBadge";

const ChildAttendanceRowReadonly = ({ 
  attendance, 
  onStatusChange, 
  disabled = false 
}) => {

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
          <AttendanceStatusBadge status={attendance.status} />
        </div>
      </td>
    </tr>
  );
};

ChildAttendanceRowReadonly.propTypes = {
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

export default ChildAttendanceRowReadonly;