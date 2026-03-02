import PropTypes from 'prop-types';
import { Card, Col, Row } from 'react-bootstrap';
import PaymentType, { getPaymentTypeName } from '../../../constants/PaymentType';
import { formatDateWithLetters } from '../../../utils/dateTime';
import { toMoneyString } from '../../../utils/moneyUtils';
import { CalendarIcon } from '../../shared/icons';
import { HoverCard } from '../../shared/ui/HoverCard';

const PaymentCard = ({ payment, index }) => {
  const getStatusBadge = () => {
    let badgeClass = 'bg-warning';
    let statusText = 'Не оплачено';

    if (payment.isPaid) {
      badgeClass = 'bg-success';
      statusText = 'Оплачено';
    } else if (payment.isOverdue) {
      badgeClass = 'bg-danger';
      statusText = 'Просрочено';
    }

    return (
      <div className={`badge ${badgeClass}`}>
        {statusText}
      </div>
    );
  };

  return (
    <HoverCard
        className='mb-3'
    >
      <Card.Body>
        <Row className="align-items-center">
          <Col md="3">
            <div className="text-muted small"><CalendarIcon size="16px" color="gray"/> Дата</div>
            <div className="fw-bold">{formatDateWithLetters(payment.paidOn)}</div>
          </Col>
          <Col md="2">
            <div className="text-muted small">Сумма</div>
            <div className="fw-bold">
              {toMoneyString(payment.amount)}
            </div>
          </Col>
          <Col md="2">
            <div className="text-muted small">Тип</div>
            <div className="fw-bold">
              {getPaymentTypeName(payment.paymentType)}
            </div>
          </Col>
          <Col md="3">
            <div className="text-muted small">Комментарий</div>
            {payment.comment ? (
              <div
                title={payment.comment}
                style={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {payment.comment}
              </div>
            ) : (
              <div className="text-muted">—</div>
            )}
          </Col>
          <Col md="2">
            <div className="d-flex justify-content-end">
              
            </div>
          </Col>
        </Row>
      </Card.Body>
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
  index: PropTypes.number.isRequired,
};

export default PaymentCard;