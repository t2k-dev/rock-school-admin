import PropTypes from 'prop-types';
import { Card, Col, Row } from 'react-bootstrap';
import TenderType, { getTenderTypeName } from '../../../constants/TenderType';
import { formatDateWithLetters } from '../../../utils/dateTime';
import { CalendarIcon } from '../../shared/icons';
import { HoverCard } from '../../shared/ui/HoverCard';

const TenderCard = ({ tender, index }) => {
  const getStatusBadge = () => {
    let badgeClass = 'bg-warning';
    let statusText = 'Не оплачено';

    if (tender.isPaid) {
      badgeClass = 'bg-success';
      statusText = 'Оплачено';
    } else if (tender.isOverdue) {
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
    <HoverCard>
      <Card.Body>
        <Row className="align-items-center">
          <Col md="3">
            <div className="text-muted small"><CalendarIcon size="16px" color="gray"/> Дата</div>
            <div className="fw-bold">{formatDateWithLetters(tender.paidOn)}</div>
          </Col>
          <Col md="2">
            <div className="text-muted small">Сумма</div>
            <div className="fw-bold">
              {tender.amount?.toLocaleString('ru-RU')} ₸
            </div>
          </Col>
          <Col md="2">
            <div className="text-muted small">Тип</div>
            <div className="fw-bold">
              {getTenderTypeName(tender.tenderType)}
            </div>
          </Col>
          <Col md="3">
            <div className="text-muted small">Комментарий</div>
            {tender.comment ? (
              <div
                title={tender.comment}
                style={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {tender.comment}
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

TenderCard.propTypes = {
  tender: PropTypes.shape({
    isPaid: PropTypes.bool,
    isOverdue: PropTypes.bool,
    amount: PropTypes.number,
    dueDate: PropTypes.string,
    paymentDate: PropTypes.string,
    description: PropTypes.string,
    paymentMethod: PropTypes.string,
    tenderType: PropTypes.oneOf([TenderType.Cash, TenderType.Bill, TenderType.Card]),
    paidOn: PropTypes.string,
    comment: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default TenderCard;