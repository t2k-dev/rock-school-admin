import { Badge } from 'react-bootstrap';

import AttendanceStatus from '../../../constants/AttendanceStatus';
import { getAttendanceStatusName } from '../../../constants/attendancies';

export const AttendanceStatusBadge = ({ 
  status, 
  pill = true, 
  className = "", 
  style = {},
  size = "normal" 
}) => {

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case AttendanceStatus.NEW:
      case AttendanceStatus.ATTENDED:
        return "success";
      case AttendanceStatus.MISSED:
        return "danger";
      case AttendanceStatus.CANCELED_BY_ADMIN:
      case AttendanceStatus.CANCELED_BY_TEACHER:
      case AttendanceStatus.CANCELED_BY_STUDENT:
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getSizeStyle = (size) => {
    switch (size) {
      case "small":
        return { fontSize: "0.75em" };
      case "large":
        return { fontSize: "1.1em" };
      default:
        return {};
    }
  };

  const statusName = getAttendanceStatusName(status);
  const variant = getStatusBadgeVariant(status);
  const sizeStyle = getSizeStyle(size);

  const finalStyle = {
    ...sizeStyle,
    ...style,
  };

  return (
    <Badge 
      pill={pill} 
      bg={variant}
      className={className}
      style={finalStyle}
      aria-label={`Статус: ${statusName}`}
    >
      {statusName}
    </Badge>
  );
};
