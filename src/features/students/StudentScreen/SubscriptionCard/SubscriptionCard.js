import { format } from "date-fns";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";


import { CalendarIcon, CoinsIcon } from "../../../../components/icons";
import { NextIcon } from "../../../../components/icons/Icons/NextIcon";
import { HoverCard } from "../../../../components/ui";
import { Colors } from "../../../../constants/Colors";
import { getDisciplineName } from "../../../../constants/disciplines";
import MyDateFormat from "../../../../constants/formats";
import SubscriptionStatus, { getSubscriptionStatusColor, getSubscriptionStatusName } from "../../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../../constants/SubscriptionType";
import TrialDecision, { getTrialDecisionColor, getTrialDecisionName } from "../../../../constants/TrialDecision";
import { DisciplineIcon } from "../../../disciplines/DisciplineIcon";


export const SubscriptionCard = ({
  subscription,
  onClick,
  onPayClick,
  onResubscribeClick,
}) => {

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

  const renderColumns = () => {
    const { subscriptionType, teacherFullName } = subscription;

    if (subscriptionType === SubscriptionType.TRIAL_LESSON) {
      return (
        <>

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
        </>
      );
    } else if (subscriptionType === SubscriptionType.RENT) {
      return (
        <>

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
                  size="20px"
                  title="Продлить"
                  onIconClick={() => onResubscribeClick(subscription)}
                />

              </>
            )}
          </div>
        </>
      );
    } else {
      return (
        <>

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
        </>
      );
    }
  };

  return (

    <HoverCard 
      className="mb-3"
      onClick={() => onClick(subscription)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
        {renderColumns()}
      </div>
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
