import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import React from "react";
import { Alert, Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";

import { Avatar } from "../../../components/Avatar";
import ScreenHeader from "../../../components/screens/ScreenHeader";
import { Button as UiButton } from "../../../components/ui";
import { activateTeacher, deactivateTeacher, getTeacherScreenDetails } from "../../../services/apiTeacherService";

import { CalendarWeek } from "../../../components/calendar/CalendarWeek";
import { CalendarIcon, EditIcon } from "../../../components/icons";
import { Loading } from "../../../components/Loading";
import SubscriptionStatus from "../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../constants/SubscriptionType";
import { SectionTitle, SectionWrapper } from "../../../layout";
import { AttendanceModal } from "../../attendances/AttendanceModal/AttendanceModal";
import { DisciplineIcon } from "../../disciplines/DisciplineIcon";
import BandList from "../../students/BandList";
import { TeacherSubscriptions } from "./TeacherSubscriptions";

// Constants
const ERROR_MESSAGES = {
  LOAD_FAILED: "Не удалось загрузить данные преподавателя",
  TEACHER_NOT_FOUND: "Преподаватель не найден",
  NO_TEACHER_ID: "Не указан ID преподавателя",
};

ChartJS.register(ArcElement, Tooltip, Legend);

class TeacherScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherId: "",
      teacher: {
        firstName: "",
        phone: "",
      },
      showCompleted: false,
      subscriptions: [],
      showAttendanceModal: false,
      selectedAttendance: null,
    };

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleEditSubscriptionClick =
      this.handleEditSubscriptionClick.bind(this);
    this.handleScheduleClick = this.handleScheduleClick.bind(this);
    this.handleDeactivateTeacher = this.handleDeactivateTeacher.bind(this);
    this.handleActivateTeacher = this.handleActivateTeacher.bind(this);
  }

  componentDidMount() {
    this.loadTeacherData();
  }

  async loadTeacherData() {
    try {
      this.setState({ isLoading: true, error: null });

      const details = await getTeacherScreenDetails(this.props.match.params.id);

      const backgroundEvents = details.teacher.scheduledWorkingPeriods.map(
        (item) => ({
          start: item.startDate,
          end: item.endDate,
        }),
      );

      this.setState({
        teacher: details.teacher,
        subscriptions: details.subscriptions,
        attendances: details.attendances,
        backgroundEvents: backgroundEvents,
        bands: details.bands,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message || ERROR_MESSAGES.LOAD_FAILED,
        isLoading: false,
      });
    }
  }

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push(`/teacher/${this.props.match.params.id}/edit`);
  };

  handleScheduleClick = (e) => {
    e.preventDefault();
    this.props.history.push(`/teacher/${this.props.match.params.id}/schedule`);
  };

  handleDeactivateTeacher = async (e) => {
    e.preventDefault();
    await deactivateTeacher(this.props.match.params.id);
    this.loadTeacherData();
  };

  handleActivateTeacher = async (e) => {
    e.preventDefault();
    await activateTeacher(this.props.match.params.id);
    this.loadTeacherData();
  };

  handleSelectEvent = (slotInfo) => {
    const newSelectedAttendance = this.state.attendances.filter(
      (a) => a.attendanceId === slotInfo.id,
    )[0];
    this.setState({
      showAttendanceModal: true,
      selectedAttendance: newSelectedAttendance,
    });
  };

  handleEditSubscriptionClick = (e, item) => {
    e.preventDefault();
    this.props.history.push(`/subscription/${item.subscriptionId}/schedule`);
  };

  handleViewSubscriptionAttendances = async (subscription) => {
    subscription.teacher = this.state.teacher;

    // Navigate to the subscription attendances page
    this.props.history.push({
      pathname: `/subscription/${subscription.subscriptionId}/attendances`,
      state: {
        subscription: subscription,
        attendances:
          this.state.attendances?.filter(
            (attendance) =>
              attendance.subscriptionId === subscription.subscriptionId,
          ) || [],
      },
    });
  };

  handleTrialSubscriptionClick = (subscription) => {
    const selectedAttendance = this.state.attendances.find(
      (a) => a.subscriptionId === subscription.subscriptionId,
    );
    this.setState({
      selectedAttendance: selectedAttendance,
      showAttendanceModal: true,
    });
  };

  handleCloseModal = () => {
    this.setState({
      showAttendanceModal: false,
      selectedAttendance: null,
    });
  };

  handleAttendanceUpdate = (updatedData) => {
    const attendanceId = updatedData.attendanceId;

    // Update the main attendances array
    this.setState((prevState) => ({
      attendances:
        prevState.attendances?.map((attendance) =>
          attendance.attendanceId === attendanceId
            ? { ...attendance, ...updatedData }
            : attendance,
        ) || [],

      // Update selected attendance if it matches
      selectedAttendance:
        prevState.selectedAttendance?.attendanceId === attendanceId
          ? { ...prevState.selectedAttendance, ...updatedData }
          : prevState.selectedAttendance,
    }));
  };

  renderErrorState = () => (
    <Container style={{ marginTop: "40px" }}>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Alert variant="danger">
            <Alert.Heading>Ошибка</Alert.Heading>
            <p>{this.state.error}</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button
                onClick={this.handleRetry}
                variant="outline-danger"
                disabled={this.state.isLoading}
              >
                Попробовать снова
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );

  handleShowCompletedChange = (showCompleted) => {
    this.setState({ showCompleted });
  };

  render() {
    const {
      isLoading,
      showCompleted,
      error,
      showAttendanceModal,
      selectedAttendance,
      teacher,
      backgroundEvents,
      subscriptions,
      attendances,
      bands,
    } = this.state;

    if (isLoading) {
      return <Loading message="Загрузка данных преподавателя..." />;
    }

    if (error) {
      return this.renderErrorState();
    }

    const sortedSubscriptions = subscriptions.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA; // Descending order
    });

    // Events
    let events;
    if (attendances) {
      events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title:
          attendance.attendees !== null &&
          attendance.attendees &&
          attendance.attendees.length > 0
            ? attendance.attendees
                .map((attendee) => attendee?.student?.firstName)
                .join(", ")
            : attendance.student
              ? `${attendance.student.firstName} ${attendance.student.lastName[0]}.`
              : "",
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        attendanceType: attendance.attendanceType,
        disciplineId: attendance.disciplineId,
      }));
    }

    // Subscriptions
    let nonTrialSubscriptions = sortedSubscriptions.filter(
      (s) =>
        s.subscriptionType === SubscriptionType.LESSON ||
        s.subscriptionType === SubscriptionType.GROUP_LESSON,
    );

    nonTrialSubscriptions = showCompleted
      ? nonTrialSubscriptions
      : nonTrialSubscriptions.filter(
          (s) => s.status !== SubscriptionStatus.COMPLETED,
        );

    // Trials
    const trialSubscriptions = sortedSubscriptions.filter(
      (s) => s.subscriptionType === SubscriptionType.TRIAL_LESSON,
    );

    // Rehearsals
    const rehearsalSubscriptions = sortedSubscriptions.filter(
      (s) => s.subscriptionType === SubscriptionType.REHEARSAL,
    );

    const metrics = [
      {
        title: "Загрузка",
        datasets: [
          {
            data: [20, 3],
            color: ["rgb(254, 106, 1)", "#0dc2fd"],
            backgroundColor: ["rgb(204, 223, 243)", "#0dc2fd"],
            borderWidth: 3,
            radius: "100%",
          },
        ],
      },
      {
        title: "Посещаемость",
        datasets: [
          {
            data: [16, 84],
            backgroundColor: ["rgb(204, 223, 243)", "#0dc2fd"],
            borderWidth: 3,
            radius: "100%",
          },
        ],
      },
      {
        title: "Пробные",
        datasets: [
          {
            data: [60, 40],
            backgroundColor: ["rgb(204, 223, 243)", "#0dc2fd"],
            borderWidth: 3,
            radius: "100%",
          },
        ],
      },
    ];

    return (
      <SectionWrapper>
        <SectionTitle>Преподаватель</SectionTitle>
          <ScreenHeader
            className="mb-4"
            avatar={<Avatar type="teacher" size={90} />}
            title={
              <>
                {teacher.firstName} {teacher.lastName}
                {teacher.isActive ? null : (
                  <span className="ml-2 text-lg font-medium text-[#94A3B8]">
                    (Отключен)
                  </span>
                )}
              </>
            }
            subtitle={<>
              Преподаватель
              <div className="flex flex-wrap gap-2 mt-2">
                {teacher.disciplines &&
                  teacher.disciplines.map((id) => (
                    <DisciplineIcon key={id} disciplineId={id} />
                  ))}
              </div>
            </>

            }
            onEdit={this.handleEditClick}
            asideClassName="w-full xl:w-auto xl:min-w-[560px]"
            aside={
              <div className="flex flex-wrap items-start gap-3 xl:flex-nowrap xl:justify-end">
                <div className="shrink-0">
                  <BandList bands={bands} />
                </div>

                <div className="flex flex-nowrap gap-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.title}
                      className="w-[112px] shrink-0 rounded-xl px-2 py-2"
                    >
                      <div className="mb-2 text-center font-medium text-[#94A3B8]">
                        {metric.title}
                      </div>
                      <div className="mx-auto h-[96px] w-[96px]">
                        <Doughnut
                          data={{
                            datasets: metric.datasets,
                            options: {},
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 md:items-stretch">
                  {teacher.isActive ? (
                    <UiButton variant="outlineDanger" onClick={this.handleDeactivateTeacher}>
                      Отключить
                    </UiButton>
                  ) : (
                    <UiButton variant="outlineSuccess" onClick={this.handleActivateTeacher}>
                      Включить
                    </UiButton>
                  )}
              </div>
              </div>
            }
          >

          </ScreenHeader>
          <div className="mb-5">
            <h3>
              <CalendarIcon />
              Расписание
              <EditIcon onIconClick={this.handleScheduleClick} />
            </h3>
            <div className="mt-3 rounded-[10px] bg-[var(--card-bg)] p-5">
              <CalendarWeek
                events={events}
                backgroundEvents={backgroundEvents}
                onSelectEvent={(slotInfo) => {
                  this.handleSelectEvent(slotInfo);
                }}
              />
            </div>

            <AttendanceModal
              attendance={selectedAttendance}
              show={showAttendanceModal}
              handleClose={this.handleCloseModal}
              onAttendanceUpdate={this.handleAttendanceUpdate}
              history={this.props.history}
            />
          </div>
          <div>
            <Tabs
              defaultActiveKey="subscriptions"
              id="uncontrolled-tab-example"
            >
              <Tab eventKey="subscriptions" title="Абонементы">
                <TeacherSubscriptions
                  subscriptions={nonTrialSubscriptions}
                  showCompleted={this.state.showCompleted}
                  onShowCompletedChange={this.handleShowCompletedChange}
                  onViewAttendances={this.handleViewSubscriptionAttendances}
                  onEditSubscription={this.handleEditSubscriptionClick}
                />
              </Tab>
              <Tab eventKey="trials" title="Пробные уроки">
                <TeacherSubscriptions
                  subscriptions={trialSubscriptions}
                  showCompleted={this.state.showCompleted}
                  onShowCompletedChange={this.handleShowCompletedChange}
                  onViewAttendances={this.handleViewSubscriptionAttendances}
                  onEditSubscription={this.handleEditSubscriptionClick}
                />
              </Tab>
              <Tab eventKey="rehearsals" title="Репетиции">
                <TeacherSubscriptions
                  subscriptions={rehearsalSubscriptions}
                  showCompleted={this.state.showCompleted}
                  onShowCompletedChange={this.handleShowCompletedChange}
                  onViewAttendances={this.handleViewSubscriptionAttendances}
                  onEditSubscription={this.handleEditSubscriptionClick}
                />
              </Tab>
            </Tabs>
          </div>
      </SectionWrapper>
    );
  }
}

export default TeacherScreen;
