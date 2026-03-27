import PropTypes from 'prop-types';
import { CalendarIcon } from '../../../../components/icons';
import { HoverCard } from '../../../../components/ui/HoverCard';
import { Colors } from '../../../../constants/Colors';
import PaymentType, { getPaymentTypeName } from '../../../../constants/PaymentType';
import { formatDateWithLetters } from '../../../../utils/dateTime';
import { toMoneyString } from '../../../../utils/moneyUtils';

const PaymentCard = ({ payment }) => {
  const getToneColor = (tone) => {
    const toneMap = {
      success: Colors.success,
      warning: Colors.warning,
      danger: Colors.danger,
      secondary: Colors.secondary,
    };

    return toneMap[tone] || Colors.secondary;
  };

  const getStatusConfig = () => {
    let tone = 'warning';
    let text = 'Не оплачено';

    if (payment.isPaid) {
      tone = 'success';
      text = 'Оплачено';
    } else if (payment.isOverdue) {
      tone = 'danger';
      text = 'Просрочено';
    }

    return { tone, text };
  };

  const renderMeta = (label, value, className = '') => (
    <div className={className}>
      <div
        className="mb-1 text-sm"
        style={{ color: Colors.textMuted }}
      >
        {label}
      </div>
      <div
        className="font-semibold leading-5"
        style={{ color: Colors.textMain }}
      >
        {value}
      </div>
    </div>
  );

  const renderBadge = (label, tone) => {
    const badgeColor = getToneColor(tone);

    return (
      <span
        className="inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.04em]"
        style={{
          borderColor: `${badgeColor}44`,
          backgroundColor: `${badgeColor}22`,
          color: badgeColor,
        }}
      >
        {label}
      </span>
    );
  };

  const renderComment = () => {
    if (!payment.comment) {
      return <span style={{ color: Colors.textMuted }}>-</span>;
    }

    return (
      <div
        title={payment.comment}
        className="max-w-full truncate text-sm leading-5"
        style={{ color: Colors.textMain }}
      >
        {payment.comment}
      </div>
    );
  };

  const statusConfig = getStatusConfig();

  return (
    <HoverCard className="mb-3">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
        <div className="md:col-span-2">
          {renderMeta(
            <span className="inline-flex items-center gap-1">
              <CalendarIcon size="16px" color={Colors.textMuted} />
              Дата
            </span>,
            payment.paidOn ? formatDateWithLetters(payment.paidOn) : '-'
          )}
        </div>
        <div className="md:col-span-2">
          {renderMeta('Сумма', toMoneyString(payment.amount || 0))}
        </div>
        <div className="md:col-span-2">
          {renderMeta('Тип', getPaymentTypeName(payment.paymentType))}
        </div>
        <div className="md:col-span-4">
          {renderMeta('Комментарий', renderComment())}
        </div>
        <div className="md:col-span-2 md:justify-self-end">
          {renderBadge(statusConfig.text, statusConfig.tone)}
        </div>
      </div>
    </HoverCard>
  );
};

PaymentCard.propTypes = {
  payment: PropTypes.shape({
    isPaid: PropTypes.bool,
    isOverdue: PropTypes.bool,
    amount: PropTypes.number,
    dueDate: PropTypes.string,
    paymentDate: PropTypes.string,
    description: PropTypes.string,
    paymentMethod: PropTypes.string,
    paymentType: PropTypes.oneOf([PaymentType.Cash, PaymentType.Bill, PaymentType.Card]),
    paidOn: PropTypes.string,
    comment: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

export default PaymentCard;