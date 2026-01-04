import { Badge } from 'react-bootstrap';

import SubscriptionStatus, { getSubscriptionStatusName } from '../../../constants/SubscriptionStatus';

export const SubscriptionStatusBadge = ({ 
  status, 
  pill = true, 
  className = "", 
  style = {},
  size = "normal" 
}) => {

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case SubscriptionStatus.DRAFT:
        return "secondary";
      case SubscriptionStatus.ACTIVE:
        return "success";
      case SubscriptionStatus.CANCELED:
        return "danger";
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

  const statusName = getSubscriptionStatusName(status);
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
