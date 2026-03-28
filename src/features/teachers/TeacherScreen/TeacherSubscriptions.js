import { format } from "date-fns";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import { CalendarIcon } from "../../../components/icons";
import { NoRecords } from "../../../components/NoRecords";
import { ToneBadge } from "../../../components/ui";
import { Colors } from "../../../constants/Colors";
import { getDisciplineName } from "../../../constants/disciplines";
import MyDateFormat from "../../../constants/formats";
import {
  getSubscriptionStatusColor,
  getSubscriptionStatusName,
} from "../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../constants/SubscriptionType";
import {
  getTrialDecisionColor,
  getTrialDecisionName,
} from "../../../constants/TrialDecision";
import { DisciplineIcon } from "../../disciplines/DisciplineIcon";

export function TeacherSubscriptions({
  subscriptions,
  showCompleted,
  onShowCompletedChange,
  onViewAttendances,
  onEditSubscription,
}) {
  if (!subscriptions || subscriptions.length === 0) {
    return <NoRecords />;
  }

  const renderHeaders = (subscription) => {
    return (
      <tr>
        <th className="date-column px-4 py-3"><CalendarIcon/> Начало</th>
        <th className="px-4 py-3">Ученик</th>
        <th className="discipline-column px-4 py-3">Направление</th>
        <th className="px-4 py-3">
          {subscription.subscriptionType === SubscriptionType.TRIAL_LESSON
            ? "Решение"
            : "Осталось занятий"}
        </th>
        <th className="px-4 py-3">Статус</th>
      </tr>
    );
  };

  const renderSubscriptionInfo = (subscription) => {
    switch (subscription.subscriptionType) {
      case SubscriptionType.LESSON:
      case SubscriptionType.GROUP_LESSON:
      case SubscriptionType.TRIAL_LESSON:
        return (
          <>
            <DisciplineIcon disciplineId={subscription.disciplineId} />
            <span style={{ marginLeft: "10px" }}>
              {getDisciplineName(subscription.disciplineId)}
              {subscription.subscriptionType ===
                SubscriptionType.GROUP_LESSON && " (гр.)"}
            </span>
          </>
        );
      case SubscriptionType.REHEARSAL:
        return <></>;
      default:
        return (
          <>
            <DisciplineIcon disciplineId={subscription.disciplineId} />
            <span style={{ marginLeft: "10px" }}>
              {getDisciplineName(subscription.disciplineId)}
            </span>
          </>
        );
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-[10px]">
        <table className="min-w-full border-collapse text-sm">
          <thead
            className="text-left uppercase tracking-[0.08em] text-[var(--teacher-subscriptions-header)]"
            style={{ "--teacher-subscriptions-header": Colors.textMuted }}
          >
            {renderHeaders(subscriptions[0])}
          </thead>
          <tbody>
            {subscriptions.map((subscription, idx) => (
              <tr
                key={idx}
                onClick={() => onViewAttendances(subscription)}
                className="cursor-pointer border-t border-slate-700/60 transition-colors hover:bg-slate-800/40"
              >
                <td className="whitespace-nowrap px-4 py-3">{format(subscription.startDate, MyDateFormat)}</td>
                <td className="px-4 py-3">
                  <Link
                    key={idx}
                    onClick={(e) => e.stopPropagation()}
                    to={"/student/" + subscription.studentId}
                    className="text-slate-100 no-underline hover:text-blue-300"
                  >
                    {subscription.studentFullName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">{renderSubscriptionInfo(subscription)}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {subscription.subscriptionType ===
                  SubscriptionType.TRIAL_LESSON ? (
                    <ToneBadge
                      label={getTrialDecisionName(subscription.trialDecision)}
                      tone={getTrialDecisionColor(subscription.trialDecision)}
                    />
                  ) : (
                    `${subscription.attendancesLeft} из ${subscription.attendanceCount}`
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <ToneBadge
                    label={getSubscriptionStatusName(subscription.status)}
                    tone={getSubscriptionStatusColor(subscription.status)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex mt-2">
        <div className="flex-grow-1"></div>
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Показывать завершенные"
          checked={showCompleted}
          onChange={(e) => {
            onShowCompletedChange(e.target.checked);
          }}
        />
      </div>
    </>
  );
}
