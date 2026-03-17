import { format } from "date-fns";
import { Badge, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { DisciplineIcon } from "../../../components/shared/discipline/DisciplineIcon";
import { EditIcon } from "../../../components/shared/icons";
import { NoRecords } from "../../../components/shared/NoRecords";
import { getDisciplineName } from "../../../constants/disciplines";
import MyDateFormat from "../../../constants/formats";
import { getSubscriptionStatusColor, getSubscriptionStatusName } from "../../../constants/SubscriptionStatus";
import { getTrialSubscriptionStatusName } from "../../../constants/SubscriptionTrialStatus";
import SubscriptionType from "../../../constants/SubscriptionType";

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
    return(
        <tr>
            <th className="date-column">Начало</th>
            <th>Ученик</th>
            <th className="discipline-column">Направление</th>
            <th>{subscription.subscriptionType === SubscriptionType.TRIAL_LESSON ? "Результат пробного" : "Осталось занятий"}</th>
            <th>Статус</th>
            <th></th>
        </tr>
    )
}

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
              {subscription.subscriptionType === SubscriptionType.GROUP_LESSON && " (гр.)"}

            </span>
          </>
        );
      case SubscriptionType.REHEARSAL:
        return <></>;
      default:
        return (
          <>
            <DisciplineIcon disciplineId={subscription.disciplineId} />
            <span style={{ marginLeft: "10px" }}>{getDisciplineName(subscription.disciplineId)}</span>
          </>
        );
    }
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          {renderHeaders(subscriptions[0])}
        </thead>
        <tbody>
          {subscriptions.map((subscription, idx) => (
            <tr
              key={idx}
              onClick={() => onViewAttendances(subscription)}
              style={{
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
            >
              <td>{format(subscription.startDate, MyDateFormat)}</td>
              <td>
                <Link
                  key={idx}
                  onClick={(e) => e.stopPropagation()}
                  to={"/student/" + subscription.studentId}
                >
                  {subscription.studentFullName}
                </Link>
              </td>
              <td>{renderSubscriptionInfo(subscription)}</td>
              <td>
                {subscription.subscriptionType === SubscriptionType.TRIAL_LESSON
                  ? getTrialSubscriptionStatusName(subscription.trialDecision)
                  : `${subscription.attendancesLeft} из ${subscription.attendanceCount}`}
              </td>
              <td>
                <Badge bg={getSubscriptionStatusColor(subscription.status)}>
                  {getSubscriptionStatusName(subscription.status)}
                </Badge>
              </td>
              <td>
                <EditIcon
                  onIconClick={(e, _item) =>
                    onEditSubscription(e, subscription)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
