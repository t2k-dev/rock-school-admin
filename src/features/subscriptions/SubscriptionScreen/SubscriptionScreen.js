<<<<<<< HEAD
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Button, Container, Tab, Tabs } from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import { CalendarIcon, CancelIcon, CoinsIcon, CountIcon } from '../../../components/icons';
import { Loading } from '../../../components/Loading';
import ScreenHeader from '../../../components/screens/ScreenHeader';
import { getDisciplineName } from '../../../constants/disciplines';
import SubscriptionStatus from '../../../constants/SubscriptionStatus';
import SubscriptionType from '../../../constants/SubscriptionType';
import { getSubscriptionScreenData } from '../../../services/apiSubscriptionService';
import { formatDateWithLetters } from '../../../utils/dateTime';
import { toMoneyString } from '../../../utils/moneyUtils';
import { DisciplineIcon } from '../../disciplines/DisciplineIcon';
import { AttendanceList } from '../AttendanceList';
import { SubscriptionStatusBadge } from '../SubscriptionStatusBadge';
import { PaymentsList } from './payments/PaymentsList';
=======
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  CalendarIcon,
  CancelIcon,
  CoinsIcon,
  CountIcon,
} from "../../../components/icons/Icons";
import { Loading } from "../../../components/Loading";
import { NoRecords } from "../../../components/NoRecords";
import { getDisciplineName } from "../../../constants/disciplines";
import SubscriptionStatus from "../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../constants/SubscriptionType";
import { getSubscriptionScreenData } from "../../../services/apiSubscriptionService";
import { formatDateWithLetters } from "../../../utils/dateTime";
import { toMoneyString } from "../../../utils/moneyUtils";
import { DisciplineIcon } from "../../disciplines/DisciplineIcon";
import { AttendanceList } from "../AttendanceList";
import PaymentCard from "../PaymentCard";
import { SubscriptionStatusBadge } from "../SubscriptionStatusBadge";
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)

const SubscriptionScreen = ({
  onAttendanceClick,
  onEditSchedules,
  onPayClick,
  onCancelClick,
}) => {
  const [subscription, setSubscription] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("attendances");

  const history = useHistory();
  const { id } = useParams(); // Get subscription ID from URL

  // Load subscription data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Loading subscription data for ID:", id);
        const data = await getSubscriptionScreenData(id);

        console.log("Received subscription data:", data);

        if (data) {
          setSubscription(data.subscription || data);
          setAttendances(data.subscription.attendances || []);
        } else {
          setError("Subscription not found");
        }
      } catch (err) {
        console.error("Error loading subscription data:", err);
        setError("Failed to load subscription data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleAttendanceRowClick = (attendance) => {
    if (onAttendanceClick) {
      onAttendanceClick(attendance);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  const renderSubscriptionHeader = () => {
    switch (subscription.subscriptionType) {
<<<<<<< HEAD
      case SubscriptionType.LESSON:
        return {
          avatar: <DisciplineIcon disciplineId={subscription.disciplineId} size="56px" color="#E2E7F6" />,
          title: getDisciplineName(subscription.disciplineId),
          meta: <SubscriptionStatusBadge status={subscription.status} />,
        };
      case SubscriptionType.RENT:
        return {
          title: 'Аренда комнаты',
          meta: <SubscriptionStatusBadge status={subscription.status} />,
        };
      default:
        return {
          avatar: <DisciplineIcon disciplineId={subscription.disciplineId} size="56px" color="#E2E7F6" />,
          title: `Абонемент ${getDisciplineName(subscription.disciplineId)}`,
          meta: <SubscriptionStatusBadge status={subscription.status} />,
        };
    }
  };

=======
      case SubscriptionType.LESSON: // Regular subscription
        return (
          <>
            <div
              className="text-center mt-2"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              <DisciplineIcon
                disciplineId={subscription.disciplineId}
                size="32px"
              />
              <div className="mt-1">
                {getDisciplineName(subscription.disciplineId)}
              </div>
            </div>
            <div className="text-center mt-2">
              <SubscriptionStatusBadge status={subscription.status} />
            </div>
          </>
        );
        break;
      case SubscriptionType.RENT:
        return (
          <>
            <div
              className="text-center mt-2"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              Аренда Комнаты
            </div>
            <div className="text-center mt-2">
              <SubscriptionStatusBadge status={subscription.status} />
            </div>
          </>
        );
        break;
      default:
        return (
          <>
            <DisciplineIcon
              disciplineId={subscription.disciplineId}
              size="32px"
            />
            <span className="ms-2">
              Абонемент {getDisciplineName(subscription.disciplineId)}{" "}
              <SubscriptionStatusBadge status={subscription.status} />
            </span>
          </>
        );
    }
  };

  const renderTenders = () => {
    if (!subscription.payments || subscription.payments.length === 0) {
      return (
        <div className="text-center py-4">
          <NoRecords />
        </div>
      );
    }

    return (
      <div className="mb-3">
        {subscription.payments.map((payment, index) => (
          <PaymentCard payment={payment} index={index} />
        ))}
      </div>
    );
  };

>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
  // Loading state
  if (isLoading) {
    return (
      <Container style={{ marginTop: "40px" }}>
        <Loading message="Загрузка данных абонемента..." />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container style={{ marginTop: "40px" }}>
        <div className="alert alert-danger">
          <h4>Ошибка</h4>
          <p>{error}</p>
          <Button variant="secondary" onClick={handleBack}>
            Назад
          </Button>
        </div>
      </Container>
    );
  }

  // No subscription found
  if (!subscription) {
    return (
      <Container style={{ marginTop: "40px" }}>
        <div className="alert alert-warning">
          <h4>Абонемент не найден</h4>
          <Button variant="secondary" onClick={handleBack}>
            Назад
          </Button>
        </div>
      </Container>
    );
  }

  const sortedAttendances = attendances
    .filter((attendance) => showCompleted || !attendance.isCompleted)
    .sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA - dateB;
    });

  const headerConfig = renderSubscriptionHeader();

  return (
<<<<<<< HEAD
    <Container style={{ marginTop: "40px"}}>
      {/* Subscription Info Card */}
      <ScreenHeader
        avatar={headerConfig.avatar}
        title={headerConfig.title}
        titleClassName="text-[24px]"
        meta={headerConfig.meta}
        asideClassName="w-full lg:w-auto lg:min-w-[250px]"
        aside={
          <div className="flex w-full flex-col gap-2 lg:w-[250px]">
            <Button variant="primary" onClick={() => onPayClick && onPayClick(subscription)}>
              <CoinsIcon color="white" enableHover={false} />
              Оплатить
            </Button>

            <Button variant="secondary" onClick={() => onEditSchedules && onEditSchedules(subscription)}>
              <CalendarIcon color="white" />
              Расписание
            </Button>

            {(subscription.status === SubscriptionStatus.ACTIVE || subscription.status === SubscriptionStatus.DRAFT) && (
              <Button variant='danger' onClick={() => onCancelClick && onCancelClick(subscription)}>
                <CancelIcon color="white" />
                Отменить
              </Button>
            )}
          </div>
        }
      >
        
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-[#94A3B8] mb-1">Ученик</div>
              <Link
                to={`/student/${subscription.student.studentId}`}
                className="text-[#E2E7F6] no-underline transition-colors duration-200 hover:text-white"
              >
                {subscription.student.firstName} {subscription.student.lastName}
              </Link>

              {subscription.teacher && (
                <>
                  <div className="mt-4 text-sm text-[#94A3B8] mb-1">Преподаватель</div>
                  <Link
                    to={`/teacher/${subscription.teacher.teacherId}`}
                    className="text-[#E2E7F6] no-underline transition-colors duration-200 hover:text-white"
                  >
                    {subscription.teacher.firstName} {subscription.teacher.lastName}
                  </Link>
                </>
              )}
            </div>

            <div className="space-y-3 text-sm text-[#E2E7F6]">
              <div>
                <div className="flex items-center gap-2 text-[#94A3B8] mb-1">
                  <CalendarIcon />
                  <span>Начало</span>
                </div>
                <div>{formatDateWithLetters(subscription.startDate)}</div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[#94A3B8] mb-1 mt-4">
                  <CountIcon />
                  <span>Осталось уроков</span>
                </div>
                <div>
                  {subscription.attendancesLeft} из {subscription.attendanceCount}
=======
    <Container>
      {/* Header with back button */}
      <Row className="mb-3">
        <Col>
          {/*<div>
            <Button variant="outline-secondary" onClick={handleBack} className="me-3">
              Назад
            </Button>
          </div>*/}
        </Col>
      </Row>

      {/* Subscription Info Card */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ flexDirection: "row" }}
              >
                <div className="flex-grow-1">
                  <Row>
                    <Col size="md-6">{renderSubscriptionTitle()}</Col>
                    <Col size="md-3">
                      <div className="text-muted small">Ученик</div>
                      <Link to={`/student/${subscription.student.studentId}`}>
                        {subscription.student.firstName}{" "}
                        {subscription.student.lastName}
                      </Link>

                      {subscription.teacher && (
                        <>
                          <div className="text-muted small mt-3">
                            Преподаватель
                          </div>
                          <Link
                            to={`/teacher/${subscription.teacher.teacherId}`}
                          >
                            {subscription.teacher.firstName}{" "}
                            {subscription.teacher.lastName}
                          </Link>
                        </>
                      )}
                    </Col>
                    <Col size="md-3">
                      <div>
                        <span className="text-muted small">
                          <CalendarIcon color="gray" /> Начало{" "}
                        </span>
                        <span className="small">
                          {formatDateWithLetters(subscription.startDate)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-muted small">
                          <CountIcon color="gray" /> Осталось уроков{" "}
                        </span>
                        <span className="small">
                          {subscription.attendancesLeft} из{" "}
                          {subscription.attendanceCount}
                        </span>
                      </div>
                      <div className="mt-2">
                        <CoinsIcon color="gray" />
                        {subscription.amountOutstanding > 0 ? (
                          <span className="small">
                            Ожидает оплаты{" "}
                            {toMoneyString(subscription.amountOutstanding)}
                          </span>
                        ) : (
                          <span className="small"> Оплачено</span>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Stack gap={2} style={{ width: "250px" }}>
                    <Button
                      variant="primary"
                      onClick={() => onPayClick && onPayClick(subscription)}
                    >
                      <CoinsIcon color="white" enableHover={false} />
                      Оплатить
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        onEditSchedules && onEditSchedules(subscription)
                      }
                    >
                      <CalendarIcon color="white" />
                      Расписание
                    </Button>
                    {(subscription.status === SubscriptionStatus.ACTIVE ||
                      subscription.status === SubscriptionStatus.DRAFT) && (
                      <Button
                        variant="danger"
                        onClick={() =>
                          onCancelClick && onCancelClick(subscription)
                        }
                      >
                        <CancelIcon color="white" />
                        Отменить
                      </Button>
                    )}
                  </Stack>
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
                </div>
              </div>

            </div>
            <div>
              <div className="text-sm text-[#94A3B8] mb-1">
                <CoinsIcon  />
                <span>Оплата</span>
              </div>
              <div className="text-sm">
                {subscription.amountOutstanding > 0
                  ? `Осталось ${toMoneyString(subscription.amountOutstanding)}`
                  : 'Оплачено'}
              </div>
            </div>


          </div>
      </ScreenHeader>

      {/* Attendances Table */}
      <div className='mt-3'>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
        >
          <Tab eventKey="attendances" title="Уроки">
            <AttendanceList
              attendances={sortedAttendances}
              onAttendanceClick={handleAttendanceRowClick}
            />
          </Tab>
          <Tab eventKey="payments" title="Платежи">
            <PaymentsList payments={subscription.payments || []} />
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

SubscriptionScreen.propTypes = {
  onAttendanceClick: PropTypes.func,
  onEditSchedules: PropTypes.func,
  onPayClick: PropTypes.func,
  onCancelClick: PropTypes.func,
};

export default SubscriptionScreen;
