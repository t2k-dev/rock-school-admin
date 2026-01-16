import PropTypes from "prop-types";
import { NoRecords } from "../../shared/NoRecords";
import { SubscriptionCard } from "./SubscriptionCard";

export const SubscriptionList = ({ 
  subscriptions, 
  onSubscriptionClick, 
  onPayClick, 
  onResubscribeClick 
}) => {
  if (!subscriptions || subscriptions.length === 0) {
    return <NoRecords />;
  }

  return (
    <div className="mb-3">
      {subscriptions.map((subscription, index) => (
        <SubscriptionCard
          key={subscription.subscriptionId || index}
          subscription={subscription}
          onClick={onSubscriptionClick}
          onPayClick={onPayClick}
          onResubscribeClick={onResubscribeClick}
        />
      ))}
    </div>
  );
};

SubscriptionList.propTypes = {
  subscriptions: PropTypes.array.isRequired,
  onSubscriptionClick: PropTypes.func.isRequired,
  onPayClick: PropTypes.func,
  onResubscribeClick: PropTypes.func.isRequired,
};

SubscriptionList.defaultProps = {
  onPayClick: () => {},
};