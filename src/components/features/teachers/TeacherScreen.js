import { format } from "date-fns";
import React from "react";
import { Alert, Button, Col, Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getTeacherScreenDetails } from "../../../services/apiTeacherService";


import { getDisciplineName } from "../../../constants/disciplines";
import MyDateFormat from "../../../constants/formats";
import SubscriptionStatus, { getSubscriptionStatusName } from "../../../constants/SubscriptionStatus";
import { getTrialSubscriptionStatusName } from "../../../constants/SubscriptionTrialStatus";

import { CalendarWeek } from "../../shared/calendar/CalendarWeek";
import { DisciplineIcon } from "../../shared/discipline/DisciplineIcon";
import { CalendarIcon, EditIcon } from "../../shared/icons";
import { Loading } from "../../shared/Loading";
import { AttendanceModal } from "../../shared/modals/AttendanceModal";
import { NoRecords } from "../../shared/NoRecords";
import TeacherScreenCard from "./TeacherScreenCard";

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
    this.props.history.push("/teachers/edit/" + this.props.match.params.id);
  };
  
  handleSelectEvent = (slotInfo) => {
    const newSelectedAttendance = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];
    this.setState({ showAttendanceModal: true, selectedAttendance: newSelectedAttendance });
  };

  handleEditSubscriptionClick = (e, item) => {
    e.preventDefault();
    this.props.history.push(`/subscription/${item.subscriptionId}/edit`);
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

  renderSubscriptions(subscriptions){
    if (!subscriptions || subscriptions.length === 0) {
      return <NoRecords />;
    }

    return (
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="date-column">Начало</th>
              <th>Ученик</th>
              <th className="discipline-column">Направление</th>
              <th>Занятий осталось</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((item, idx) => (
              <tr 
                key={idx}
                onClick={() => this.handleViewSubscriptionAttendances(item)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <td>{format(item.startDate, MyDateFormat)}</td>
                <td>
                  {item.childSubscriptions && item.childSubscriptions.length > 0 
                    ? item.childSubscriptions.map((childItem, idx) => (
                        <Link 
                          key={idx} 
                          onClick={(e) => e.stopPropagation()}
                          to={"/student/" + childItem.student.studentId}>
                          {childItem.student.firstName} {childItem.student.lastName}
                          {idx < item.childSubscriptions.length - 1 && ", "}
                        </Link>
                      ))
                    : 
                    <Link 
                      key={idx} 
                      onClick={(e) => e.stopPropagation()}
                      to={"/student/" + item.student.studentId}>
                        {item.student.firstName} {item.student.lastName}
                    </Link>
                  }
                </td>
                <td>
                  <DisciplineIcon disciplineId={item.disciplineId} />
                  <span style={{ marginLeft: "10px" }}>{getDisciplineName(item.disciplineId)}</span>
                </td>
                <td>{item.attendancesLeft} из {item.attendanceCount}</td>
                <td>{getSubscriptionStatusName(item.status)}</td>
                <td>
                  <EditIcon onIconClick={(e, _item) => this.handleEditSubscriptionClick(e, item)} />
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
            checked={this.state.showCompleted}
            onChange={(e) => {
              this.setState({ showCompleted: e.target.checked });
            }}
          />
        </div>
        </>
      );
  };

  renderTrials(trialSubscriptions){
    if (!trialSubscriptions || trialSubscriptions.length === 0) {
      return <NoRecords />;
    }
    
    return (
      <Table striped bordered hover>
          <thead>
            <tr>
              <th className="date-column">Дата</th>
              <th>Ученик</th>
              <th className="discipline-column">Направление</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trialSubscriptions.map((item, index) => (
              <tr 
                key={index}
                onClick={() => this.handleTrialSubscriptionClick(item)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                >
                <td>{format(item.startDate, MyDateFormat)}</td>
                <td>
                  <Link 
                    onClick={(e) => e.stopPropagation()}
                    to={`/student/${item.student.studentId}`}>
                    {item.student.firstName} {item.student.lastName}
                  </Link>
                </td>
                <td>{getDisciplineName(item.disciplineId)}</td>
                <td>{getTrialSubscriptionStatusName(item.trialStatus)}</td>
                <td>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
    );

  }

  render() {
    const { isLoading, showCompleted, error, showAttendanceModal, selectedAttendance, teacher, backgroundEvents, subscriptions, attendances } = this.state;

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
        title: attendance.childAttendances !== null && attendance.childAttendances && attendance.childAttendances.length > 0
          ? attendance.childAttendances.map(childAttendance => childAttendance.student.firstName).join(", ")
          : `${attendance.student.firstName} ${attendance.student.lastName[0]}.`,
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        attendanceType: attendance.attendanceType,
        disciplineId: attendance.disciplineId,
      }));
    }

    // Subscriptions
    let nonTrialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus === null);
    nonTrialSubscriptions = showCompleted
      ? nonTrialSubscriptions
      : nonTrialSubscriptions.filter((s) => s.status !== SubscriptionStatus.COMPLETED);

    // Trials
    const trialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus !== null);

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <TeacherScreenCard item={teacher} history={this.props.history} />
        </Row>
        <Row>
          <h3><CalendarIcon />Расписание</h3>
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
              {this.renderSubscriptions(nonTrialSubscriptions)}
            </Tab>
            <Tab eventKey="trials" title="Пробные занятия">
              {this.renderTrials(trialSubscriptions)}

            </Tab>
            <Tab eventKey="rehearsals" title="Репетиции">
              <NoRecords />
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
