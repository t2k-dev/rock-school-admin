import { format } from "date-fns";
import PropTypes from "prop-types";
import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getDisciplineName } from "../../../constants/disciplines";
import MyDateFormat from "../../../constants/formats";
import SubscriptionStatus, { getSubscriptionStatusName } from "../../../constants/SubscriptionStatus";
import { getTrialSubscriptionStatusName } from "../../../constants/SubscriptionTrialStatus";
import SubscriptionType from "../../../constants/SubscriptionType";
import { DisciplineIcon } from "../../shared/discipline/DisciplineIcon";
import { CalendarIcon } from "../../shared/icons/CalendarIcon";
import { CoinsIcon } from "../../shared/icons/CoinsIcon";
import { NextIcon } from "../../shared/icons/NextIcon";

export const SubscriptionCard = ({ 
  subscription, 
  onClick, 
  onPayClick, 
  onResubscribeClick 
}) => {
  const getStatusBadgeColor = (subscription) => {
    if (subscription.subscriptionType === SubscriptionType.TRIAL_LESSON) {
      if (subscription.trialStatus === 'completed') return "success";
      if (subscription.trialStatus === 'cancelled') return "danger";
      return "secondary";
    } else {
      if (subscription.status === SubscriptionStatus.ACTIVE) return "success";
      if (subscription.status === SubscriptionStatus.DRAFT) return "warning";
      return "secondary";
    }
  };

  const getStatusText = (subscription) => {
    if (subscription.subscriptionType === SubscriptionType.TRIAL_LESSON) {
      return getTrialSubscriptionStatusName(subscription.trialStatus);
    }
    return getSubscriptionStatusName(subscription.status);
  };

  const renderColumns = () => {
    const { subscriptionType } = subscription;
    
    if (subscriptionType === SubscriptionType.TRIAL_LESSON) {
      return (
        <>
          <Col md="2">
            <div className="text-muted small"><CalendarIcon color="gray"/>Дата</div>
            <div className="fw-bold">{format(subscription.startDate, MyDateFormat)}</div>
          </Col>
          <Col md="3">
            <div className="d-flex align-items-center">
              <DisciplineIcon disciplineId={subscription.disciplineId} />
              <span style={{ marginLeft: "10px" }}>{getDisciplineName(subscription.disciplineId)}</span>
            </div>
          </Col>
          <Col md="5">
            <div className="text-muted small">Преподаватель</div>
            <Link 
              to={`/teacher/${subscription.teacher.teacherId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-decoration-none"
            >
              {subscription.teacher.firstName} {subscription.teacher.lastName}
            </Link>
          </Col>
          <Col md="1">
            <div className="d-flex justify-content-start">
              <Badge bg={getStatusBadgeColor(subscription)}>
                {getStatusText(subscription)}
              </Badge>
            </div>
          </Col>
          <Col md="1">
            <div className="d-flex justify-content-end" onClick={(e) => e.stopPropagation()}>
              <NextIcon 
                size="20px"
                title="Продлить"
                onIconClick={() => onResubscribeClick(subscription)}
              />
            </div>
          </Col>
        </>
      );
    } else if (subscriptionType === SubscriptionType.RENT) {
      return (
        <>
          <Col md="8">
            <div className="text-muted small"><CalendarIcon color="gray"/>Начало</div>
            <div className="fw-bold">{format(subscription.startDate, MyDateFormat)}</div>
          </Col>
          <Col md="2">
            <div className="text-muted small">Осталось занятий</div>
            <div className="fw-bold">{subscription.attendancesLeft} из {subscription.attendanceCount}</div>
          </Col>
          <Col md="1">
            <div className="d-flex justify-content-start">
              <Badge bg={getStatusBadgeColor(subscription)}>
                {getStatusText(subscription)}
              </Badge>
            </div>
          </Col>
          <Col md="1">
            <div className="d-flex gap-2 justify-content-end" onClick={(e) => e.stopPropagation()}>
              {subscription.status === SubscriptionStatus.DRAFT && (
                <CoinsIcon
                  size="20px"
                  title="Оплатить"
                  onIconClick={() => onPayClick(subscription)}
                />
              )}
              <NextIcon 
                size="20px"
                title="Продлить"
                onIconClick={() => onResubscribeClick(subscription)}
              />
            </div>
          </Col>
        </>
      );
    } else {
      // Regular subscription (LESSON)
      return (
        <>
          <Col md="2">
            <div className="text-muted small"><CalendarIcon color="gray"/> Начало</div>
            <div className="fw-bold">{format(subscription.startDate, MyDateFormat)}</div>
          </Col>
          <Col md="3">
            <div className="d-flex align-items-center">
              <DisciplineIcon disciplineId={subscription.disciplineId} />
              <span style={{ marginLeft: "10px" }}>{getDisciplineName(subscription.disciplineId)}</span>
            </div>
          </Col>
          <Col md="3">
            <div className="text-muted small">Преподаватель</div>
            <Link 
              to={`/teacher/${subscription.teacher.teacherId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-decoration-none"
            >
              {subscription.teacher.firstName} {subscription.teacher.lastName}
            </Link>
          </Col>
          <Col md="2">
            <div className="text-muted small">Осталось занятий</div>
            <div className="fw-bold">{subscription.attendancesLeft} из {subscription.attendanceCount}</div>
          </Col>
          <Col md="1">
            <div className="d-flex justify-content-start">
              <Badge bg={getStatusBadgeColor(subscription)}>
                {getStatusText(subscription)}
              </Badge>
            </div>
          </Col>
          <Col md="1">
            <div className="d-flex gap-2 justify-content-end" onClick={(e) => e.stopPropagation()}>
              {subscription.status === SubscriptionStatus.DRAFT && (
                <CoinsIcon
                  size="20px"
                  title="Оплатить"
                  onIconClick={() => onPayClick(subscription)}
                />
              )}
              {(subscription.status === SubscriptionStatus.COMPLETED || subscription.status === SubscriptionStatus.ACTIVE) && 
              <NextIcon
                size="20px"
                title="Продлить"
                onIconClick={() => onResubscribeClick(subscription)}
              />
              }
            </div>
          </Col>
        </>
      );
    }
  };

  return (
    <Card 
      className="mb-3"
      style={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
      onClick={() => onClick(subscription)}
    >
      <Card.Body>
        <Row className="align-items-center">
          {renderColumns()}
        </Row>
      </Card.Body>
    </Card>
  );
};

SubscriptionCard.propTypes = {
  subscription: PropTypes.shape({
    subscriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subscriptionType: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    disciplineId: PropTypes.number,
    teacher: PropTypes.shape({
      teacherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }).isRequired,
    attendancesLeft: PropTypes.number,
    attendanceCount: PropTypes.number,
    status: PropTypes.number,
    trialStatus: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onPayClick: PropTypes.func,
  onResubscribeClick: PropTypes.func.isRequired,
};

SubscriptionCard.defaultProps = {
  onPayClick: () => {},
};