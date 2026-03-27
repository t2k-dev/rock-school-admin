import PropTypes from 'prop-types';
import { NoRecords } from '../../../../components/NoRecords';
import PaymentCard from './PaymentCard';

export const PaymentsList = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-4">
        <NoRecords />
      </div>
    );
  }

  return (
    <div className="mb-3">
      {payments.map((payment, index) => (
        <PaymentCard
          key={`${payment.paidOn || 'payment'}-${payment.amount || 0}-${index}`}
          payment={payment}
          index={index}
        />
      ))}
    </div>
  );
};

PaymentsList.propTypes = {
  payments: PropTypes.array.isRequired,
};