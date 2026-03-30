import { ToneBadge } from '../../components/ui';
import AttendanceStatus, { getAttendanceStatusName } from '../../constants/AttendanceStatus';

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
        return "primary";
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
    <ToneBadge
      label={statusName}
      tone={variant}
      className={className}
      style={finalStyle}
      aria-label={`Статус: ${statusName}`}
    />
  );
};
