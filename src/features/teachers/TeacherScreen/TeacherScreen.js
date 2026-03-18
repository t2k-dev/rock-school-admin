import React from "react";
import { Alert, Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { getTeacherScreenDetails } from "../../../services/apiTeacherService";

import SubscriptionStatus from "../../../constants/SubscriptionStatus";

import { CalendarWeek } from "../../../components/calendar/CalendarWeek";
import { CalendarIcon, EditIcon } from "../../../components/icons";
import { Loading } from "../../../components/Loading";
import SubscriptionType from "../../../constants/SubscriptionType";
import { AttendanceModal } from "../../attendances/AttendanceModal/AttendanceModal";
import TeacherScreenCard from "./TeacherScreenCard";
import { TeacherSubscriptions } from "./TeacherSubscriptions";

// Constants
const ERROR_MESSAGES = {
  LOAD_FAILED: "Не удалось загрузить данные преподавателя",
  TEACHER_NOT_FOUND: "Преподаватель не найден",
  NO_TEACHER_ID: "Не указан ID преподавателя",
};

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
    this.handleEditSubscriptionClick = this.handleEditSubscriptionClick.bind(this);
    this.handleScheduleClick = this.handleScheduleClick.bind(this);
  }

  componentDidMount() {
    this.loadTeacherData();
  }

  async loadTeacherData() {
    try{
      this.setState({ isLoading: true, error: null });

      const details = await getTeacherScreenDetails(this.props.match.params.id);

      const backgroundEvents = details.teacher.scheduledWorkingPeriods.map((item) => ({
        start: item.startDate,
        end: item.endDate,
      }));

      this.setState({
        teacher: details.teacher,
        subscriptions: details.subscriptions,
        attendances: details.attendances,
        backgroundEvents: backgroundEvents,
        bands: details.bands,
        isLoading: false,
    });

    } catch (error){
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

  handleSelectEvent = (slotInfo) => {
    const newSelectedAttendance = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];
    this.setState({ showAttendanceModal: true, selectedAttendance: newSelectedAttendance });
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
        attendances: this.state.attendances?.filter(
          attendance => attendance.subscriptionId === subscription.subscriptionId
        ) || []
      }
    });
  };

  handleTrialSubscriptionClick = (subscription) => {
    const selectedAttendance = this.state.attendances.find(a => a.subscriptionId === subscription.subscriptionId);
    this.setState({
      selectedAttendance: selectedAttendance,
      showAttendanceModal: true
    });
  }

  handleCloseModal = () => {
    this.setState({ 
      showAttendanceModal: false,
      selectedAttendance: null
    });
  };

  handleAttendanceUpdate = (updatedData) => {
    const attendanceId = updatedData.attendanceId;
    
    // Update the main attendances array
    this.setState(prevState => ({
      attendances: prevState.attendances?.map(attendance => 
        attendance.attendanceId === attendanceId 
          ? { ...attendance, ...updatedData }
          : attendance
      ) || [],
      
      // Update selected attendance if it matches
      selectedAttendance: prevState.selectedAttendance?.attendanceId === attendanceId
        ? { ...prevState.selectedAttendance, ...updatedData }
        : prevState.selectedAttendance
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
    const { isLoading, showCompleted, error, showAttendanceModal, selectedAttendance, teacher, backgroundEvents, subscriptions, attendances, bands } = this.state;

    if (isLoading) {
      return <Loading
        message="Загрузка данных преподавателя..."
      />
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
        title: attendance.attendees !== null && attendance.attendees && attendance.attendees.length > 0
          ? attendance.attendees.map(attendee => attendee?.student?.firstName).join(", ")
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
    let nonTrialSubscriptions = sortedSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.LESSON 
      || s.subscriptionType === SubscriptionType.GROUP_LESSON );

    nonTrialSubscriptions = showCompleted
      ? nonTrialSubscriptions
      : nonTrialSubscriptions.filter((s) => s.status !== SubscriptionStatus.COMPLETED);

    // Trials
    const trialSubscriptions = sortedSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.TRIAL_LESSON);

    // Rehearsals
    const rehearsalSubscriptions = sortedSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.REHEARSAL);

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <TeacherScreenCard item={teacher} bands={bands} history={this.props.history} />
        </Row>
        <Row>
          <h3>
            <CalendarIcon />Расписание 
            <EditIcon onIconClick={this.handleScheduleClick}/>
          
          </h3>
          <CalendarWeek 
            events={events} 
            backgroundEvents={backgroundEvents} 
            onSelectEvent={(slotInfo) => {this.handleSelectEvent(slotInfo);}}
            />

          <AttendanceModal
            attendance={selectedAttendance}
            show={showAttendanceModal}
            handleClose={this.handleCloseModal}
            onAttendanceUpdate={this.handleAttendanceUpdate}
            history={this.props.history}
          />
        </Row>
        <Row className="mt-3">
          <Tabs defaultActiveKey="subscriptions" id="uncontrolled-tab-example" className="mb-3">
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
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col md="12"></Col>
        </Row>
      </Container>
    );
  }
}

export default TeacherScreen;
