import { format } from "date-fns";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

<<<<<<< HEAD:src/features/students/StudentScreen/SubscriptionCard/SubscriptionCard.js
import { CalendarIcon, CoinsIcon } from "../../../../components/icons";
import { NextIcon } from "../../../../components/icons/NextIcon";
import { HoverCard } from "../../../../components/ui";
import { Colors } from "../../../../constants/Colors";
import { getDisciplineName } from "../../../../constants/disciplines";
import MyDateFormat from "../../../../constants/formats";
import SubscriptionStatus, { getSubscriptionStatusColor, getSubscriptionStatusName } from "../../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../../constants/SubscriptionType";
import TrialDecision, { getTrialDecisionColor, getTrialDecisionName } from "../../../../constants/TrialDecision";
import { DisciplineIcon } from "../../../disciplines/DisciplineIcon";

=======
import { CalendarIcon, CoinsIcon } from "../../../components/icons/Icons";
import { NextIcon } from "../../../components/icons/Icons/NextIcon";
import { HoverCard } from "../../../components/ui";
import { getDisciplineName } from "../../../constants/disciplines";
import MyDateFormat from "../../../constants/formats";
import SubscriptionStatus, {
  getSubscriptionStatusColor,
  getSubscriptionStatusName,
} from "../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../constants/SubscriptionType";
import TrialDecision, {
  getTrialDecisionColor,
  getTrialDecisionName,
} from "../../../constants/TrialDecision";
import { DisciplineIcon } from "../../disciplines/DisciplineIcon";
>>>>>>> 995dbf5 (﻿add uqly icons, add ts, doing header):src/features/students/StudentScreen/SubscriptionCard.js

export const SubscriptionCard = ({
  subscription,
  onClick,
  onPayClick,
  onResubscribeClick,
}) => {
<<<<<<< HEAD
  const getToneColor = (tone) => {
    const toneMap = {
      primary: Colors.primary,
      success: Colors.success,
      warning: Colors.warning,
      danger: Colors.danger,
      secondary: Colors.secondary,
    };

    return toneMap[tone] || Colors.secondary;
  };

  const renderMeta = (label, value, className = "") => (
    <div className={className}>
      <div
        className="mb-1 text-sm"
        style={{ color: Colors.textMuted }}
      >
        {label}
      </div>
      <div className="font-semibold leading-5">{value}</div>
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

  const renderTeacherLink = (name) => (
    <Link
      to={`/teacher/${subscription.teacherId}`}
      onClick={(e) => e.stopPropagation()}
      className="no-underline transition-opacity hover:opacity-80"
      style={{ color: Colors.accent }}
    >
      {name}
    </Link>
  );

  const renderActions = (content) => (
    <div
      className="flex items-center justify-start gap-2 md:justify-end"
      onClick={(e) => e.stopPropagation()}
    >
      {content}
    </div>
  );

  const renderDisciplineColumn = () => (
      <div className="flex items-center gap-3 md:col-span-3">
        <DisciplineIcon disciplineId={subscription.disciplineId} />
        <span className="font-semibold leading-5">
          {getDisciplineName(subscription.disciplineId)}
        </span>
      </div>
  );

=======
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
  const renderColumns = () => {
    const { subscriptionType, teacherFullName } = subscription;

    if (subscriptionType === SubscriptionType.TRIAL_LESSON) {
      return (
        <>
<<<<<<< HEAD
          <div className="md:col-span-2">
            {renderMeta(
              <span className="inline-flex items-center gap-1">
                <CalendarIcon/>
                Дата
              </span>,
              format(subscription.startDate, MyDateFormat)
            )}
          </div>
          {renderDisciplineColumn()}
          <div className="md:col-span-3">
            {renderMeta("Преподаватель", renderTeacherLink(teacherFullName))}
          </div>
          <div className="md:col-span-1">
            {renderMeta(
              "Решение",
              renderBadge(
                getTrialDecisionName(subscription.trialDecision),
                getTrialDecisionColor(subscription.trialDecision)
              )
            )}
          </div>
          <div className="md:col-span-1">
            {renderMeta("Причина", subscription.statusReason || "—")}
          </div>
          <div className="md:col-span-1">
            {renderBadge(
              getSubscriptionStatusName(subscription.status),
              getSubscriptionStatusColor(subscription.status)
            )}
          </div>
          <div className="md:col-span-1">
            {renderActions(
              <>
                {subscription.trialStatus === TrialDecision.POSITIVE && (
                  <NextIcon
                    size="20px"
                    title="Продлить"
                    onIconClick={() => onResubscribeClick(subscription)}
                  />
                )}
                {subscription.status === SubscriptionStatus.DRAFT && (
                  <CoinsIcon
                    size="20px"
                    title="Оплатить"
                    onIconClick={() => onPayClick(subscription)}
                  />
                )}
              </>
            )}
          </div>
=======
          <Col md="2">
            <div className="text-muted small">
              <CalendarIcon color="gray" />
              Дата
            </div>
            <div className="fw-bold">
              {format(subscription.startDate, MyDateFormat)}
            </div>
          </Col>
          <Col md="3">
            <div className="d-flex align-items-center">
              <DisciplineIcon disciplineId={subscription.disciplineId} />
              <span style={{ marginLeft: "10px" }}>
                {getDisciplineName(subscription.disciplineId)}
              </span>
            </div>
          </Col>
          <Col md="3">
            <div className="text-muted small">Преподаватель</div>
            <Link
              to={`/teacher/${subscription.teacherId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-decoration-none"
            >
              {teacherFullName}
            </Link>
          </Col>
          <Col md="1">
            <div className="text-muted small">Решение</div>
            <Badge bg={getTrialDecisionColor(subscription.trialDecision)}>
              {getTrialDecisionName(subscription.trialDecision)}
            </Badge>
          </Col>
          <Col md="1">
            <div className="text-muted small">Причина</div>
            {subscription.statusReason}
          </Col>
          <Col md="1">
            <div className="d-flex justify-content-start">
              <Badge bg={getSubscriptionStatusColor(subscription.status)}>
                {getSubscriptionStatusName(subscription.status)}
              </Badge>
            </div>
          </Col>
          <Col md="1">
            {subscription.trialStatus === TrialDecision.POSITIVE && (
              <div
                className="d-flex justify-content-end"
                onClick={(e) => e.stopPropagation()}
              >
                <NextIcon
                  size="20px"
                  title="Продлить"
                  onIconClick={() => onResubscribeClick(subscription)}
                />
              </div>
            )}
            {subscription.status === SubscriptionStatus.DRAFT && (
              <div
                className="d-flex justify-content-end"
                onClick={(e) => e.stopPropagation()}
              >
                <CoinsIcon
                  size="20px"
                  title="Оплатить"
                  onIconClick={() => onPayClick(subscription)}
                />
              </div>
            )}
          </Col>
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
        </>
      );
    } else if (subscriptionType === SubscriptionType.RENT) {
      return (
        <>
<<<<<<< HEAD
          <div className="md:col-span-2">
            {renderMeta(
              <span className="inline-flex items-center gap-1">
                <CalendarIcon color={Colors.textMuted} />
                Начало
              </span>,
              format(subscription.startDate, MyDateFormat)
            )}
          </div>
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 text-sm font-semibold leading-5">
              <span>Аренда комнаты</span>
            </div>
          </div>
          <div className="md:col-span-2">
            {renderMeta(
              "Осталось уроков",
              `${subscription.attendancesLeft} из ${subscription.attendanceCount}`
            )}
          </div>
          <div className="md:col-span-1">
            {renderBadge(
              getSubscriptionStatusName(subscription.status),
              getSubscriptionStatusColor(subscription.status)
            )}
          </div>
          <div className="md:col-span-1">
            {renderActions(
              <>
                {subscription.status === SubscriptionStatus.DRAFT && (
                  <CoinsIcon
                    size="20px"
                    title="Оплатить"
                    onIconClick={() => onPayClick(subscription)}
                  />
                )}
                <NextIcon
=======
          <Col md="2">
            <div className="text-muted small">
              <CalendarIcon color="gray" />
              Начало
            </div>
            <div className="fw-bold">
              {format(subscription.startDate, MyDateFormat)}
            </div>
          </Col>
          <Col md="6">
            <div className="d-flex align-items-center">
              <span style={{ marginLeft: "10px" }}>Аренда комнаты</span>
            </div>
          </Col>
          <Col md="2">
            <div className="text-muted small">Осталось уроков</div>
            <div className="fw-bold">
              {subscription.attendancesLeft} из {subscription.attendanceCount}
            </div>
          </Col>
          <Col md="1">
            <div className="d-flex justify-content-start">
              <Badge bg={getSubscriptionStatusColor(subscription.status)}>
                {getSubscriptionStatusName(subscription.status)}
              </Badge>
            </div>
          </Col>
          <Col md="1">
            <div
              className="d-flex gap-2 justify-content-end"
              onClick={(e) => e.stopPropagation()}
            >
              {subscription.status === SubscriptionStatus.DRAFT && (
                <CoinsIcon
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
                  size="20px"
                  title="Продлить"
                  onIconClick={() => onResubscribeClick(subscription)}
                />
<<<<<<< HEAD
              </>
            )}
          </div>
=======
              )}
              <NextIcon
                size="20px"
                title="Продлить"
                onIconClick={() => onResubscribeClick(subscription)}
              />
            </div>
          </Col>
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
        </>
      );
    } else {
      return (
        <>
<<<<<<< HEAD
          <div className="md:col-span-2">
            {renderMeta(
              <span className="inline-flex items-center gap-1">
                <CalendarIcon color={Colors.textMuted} />
                Начало
              </span>,
              format(subscription.startDate, MyDateFormat)
            )}
          </div>
          {renderDisciplineColumn()}
          <div className="md:col-span-3">
            {renderMeta("Преподаватель", renderTeacherLink(subscription.teacherFullName))}
          </div>
          <div className="md:col-span-2">
            {renderMeta(
              "Осталось уроков",
              `${subscription.attendancesLeft} из ${subscription.attendanceCount}`
            )}
          </div>
          <div className="md:col-span-1">
            {renderBadge(
              getSubscriptionStatusName(subscription.status),
              getSubscriptionStatusColor(subscription.status)
            )}
          </div>
          <div className="md:col-span-1">
            {renderActions(
              <>
                {subscription.status === SubscriptionStatus.DRAFT && (
                  <CoinsIcon
                    size="20px"
                    title="Оплатить"
                    onIconClick={() => onPayClick(subscription)}
                  />
                )}
                {(subscription.status === SubscriptionStatus.COMPLETED ||
                  subscription.status === SubscriptionStatus.ACTIVE) && (
                  <NextIcon
                    size="20px"
                    title="Продлить"
                    onIconClick={() => onResubscribeClick(subscription)}
                  />
                )}
              </>
            )}
          </div>
=======
          <Col md="2">
            <div className="text-muted small">
              <CalendarIcon color="gray" /> Начало
            </div>
            <div className="fw-bold">
              {format(subscription.startDate, MyDateFormat)}
            </div>
          </Col>
          <Col md="3">
            <div className="d-flex align-items-center">
              <DisciplineIcon disciplineId={subscription.disciplineId} />
              <span style={{ marginLeft: "10px" }}>
                {getDisciplineName(subscription.disciplineId)}
              </span>
            </div>
          </Col>
          <Col md="3">
            <div className="text-muted small">Преподаватель</div>
            <Link
              to={`/teacher/${subscription.teacherId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-decoration-none"
            >
              {subscription.teacherFullName}
            </Link>
          </Col>
          <Col md="2">
            <div className="text-muted small">Осталось уроков</div>
            <div className="fw-bold">
              {subscription.attendancesLeft} из {subscription.attendanceCount}
            </div>
          </Col>
          <Col md="1">
            <div className="d-flex justify-content-start">
              <Badge bg={getSubscriptionStatusColor(subscription.status)}>
                {getSubscriptionStatusName(subscription.status)}
              </Badge>
            </div>
          </Col>
          <Col md="1">
            <div
              className="d-flex gap-2 justify-content-end"
              onClick={(e) => e.stopPropagation()}
            >
              {subscription.status === SubscriptionStatus.DRAFT && (
                <CoinsIcon
                  size="20px"
                  title="Оплатить"
                  onIconClick={() => onPayClick(subscription)}
                />
              )}
              {(subscription.status === SubscriptionStatus.COMPLETED ||
                subscription.status === SubscriptionStatus.ACTIVE) && (
                <NextIcon
                  size="20px"
                  title="Продлить"
                  onIconClick={() => onResubscribeClick(subscription)}
                />
              )}
            </div>
          </Col>
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
        </>
      );
    }
  };

  return (
<<<<<<< HEAD:src/features/students/StudentScreen/SubscriptionCard/SubscriptionCard.js
    <HoverCard 
      className="mb-3"
      onClick={() => onClick(subscription)}
    >
<<<<<<< HEAD
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
        {renderColumns()}
      </div>
=======
        <Card.Body>
          <Row className="align-items-center">
            {renderColumns()}
          </Row>
        </Card.Body>
=======
    <HoverCard className="mb-3" onClick={() => onClick(subscription)}>
      <Card.Body>
        <Row className="align-items-center">{renderColumns()}</Row>
      </Card.Body>
>>>>>>> 995dbf5 (﻿add uqly icons, add ts, doing header):src/features/students/StudentScreen/SubscriptionCard.js
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
    </HoverCard>
  );
};

SubscriptionCard.propTypes = {
  subscription: PropTypes.shape({
    subscriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    subscriptionType: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    disciplineId: PropTypes.number,
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
