import { format } from "date-fns";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  CoinsIcon,
  NextIcon,
} from "../../../../components/icons";
import { HoverCard, ToneBadge } from "../../../../components/ui";
import { Colors } from "../../../../constants/Colors";
import { getDisciplineName } from "../../../../constants/disciplines";
import MyDateFormat from "../../../../constants/formats";
import SubscriptionStatus, {
  getSubscriptionStatusColor,
  getSubscriptionStatusName,
} from "../../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../../constants/SubscriptionType";
import TrialDecision, {
  getTrialDecisionColor,
  getTrialDecisionName,
} from "../../../../constants/TrialDecision";
import { DisciplineIcon } from "../../../disciplines/DisciplineIcon";

export const SubscriptionCard = ({
  subscription,
  onClick,
  onPayClick,
  onResubscribeClick,
}) => {
  const renderMeta = (label, value, className = "") => (
    <div className={className}>
      <div className="mb-1 text-sm" style={{ color: Colors.textMuted }}>
        {label}
      </div>
      <div className="font-semibold leading-5">{value}</div>
    </div>
  );

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
    const { subscriptionType, teacherFullName, status, trialStatus } =
      subscription;

    if (subscriptionType === SubscriptionType.TRIAL_LESSON) {
      return (
        <>
          <div className="md:col-span-2">
            {renderMeta(
              <span className="inline-flex items-center gap-1">
                <CalendarIcon />
                Дата
              </span>,
              format(new Date(subscription.startDate), MyDateFormat),
            )}
          </div>
          {renderDisciplineColumn()}
          <div className="md:col-span-3">
            {renderMeta("Преподаватель", renderTeacherLink(teacherFullName))}
          </div>
          <div className="md:col-span-1">
            {renderMeta(
              "Решение",
              <ToneBadge
                label={getTrialDecisionName(subscription.trialDecision)}
                tone={getTrialDecisionColor(subscription.trialDecision)}
              />,
            )}
          </div>
          <div className="md:col-span-1">
            {renderMeta("Причина", subscription.statusReason || "—")}
          </div>
          <div className="md:col-span-1">
            <ToneBadge
              label={getSubscriptionStatusName(status)}
              tone={getSubscriptionStatusColor(status)}
            />
          </div>
          <div className="md:col-span-1">
            {renderActions(
              <>
                {trialStatus === TrialDecision.POSITIVE && (
                  <NextIcon
                    size="20px"
                    title="Продлить"
                    onClick={() => onResubscribeClick(subscription)}
                  />
                )}
                {status === SubscriptionStatus.DRAFT && (
                  <CoinsIcon
                    size="20px"
                    title="Оплатить"
                    onClick={() => onPayClick(subscription)}
                  />
                )}
              </>,
            )}
          </div>
        </>
      );
    }

    // Рендер для обычных абонементов и аренды
    const isRent = subscriptionType === SubscriptionType.RENT;

    return (
      <>
        <div className="md:col-span-2">
          {renderMeta(
            <span className="inline-flex items-center gap-1">
              <CalendarIcon color={Colors.textMuted} />
              Начало
            </span>,
            format(new Date(subscription.startDate), MyDateFormat),
          )}
        </div>
        {isRent ? (
          <div className="md:col-span-6 font-semibold">Аренда комнаты</div>
        ) : (
          <>
            {renderDisciplineColumn()}
            <div className="md:col-span-3">
              {renderMeta("Преподаватель", renderTeacherLink(teacherFullName))}
            </div>
          </>
        )}
        <div className="md:col-span-2">
          {renderMeta(
            "Осталось уроков",
            `${subscription.attendancesLeft} из ${subscription.attendanceCount}`,
          )}
        </div>
        <div className="md:col-span-1">
          <ToneBadge
            label={getSubscriptionStatusName(status)}
            tone={getSubscriptionStatusColor(status)}
          />
        </div>
        <div className="md:col-span-1">
          {renderActions(
            <>
              {status === SubscriptionStatus.DRAFT && (
                <CoinsIcon
                  size="20px"
                  title="Оплатить"
                  onIconClick={() => onPayClick(subscription)}
                  isClickable={true}
                />
              )}
              {(status === SubscriptionStatus.COMPLETED ||
                status === SubscriptionStatus.ACTIVE ||
                isRent) && (
                <NextIcon
                  size="20px"
                  title="Продлить"
                  onClick={() => onResubscribeClick(subscription)}
                />
              )}
            </>,
          )}
        </div>
      </>
    );
  };

  return (
    <HoverCard className="mb-3" onClick={() => onClick(subscription)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
        {renderColumns()}
      </div>
    </HoverCard>
  );
};
