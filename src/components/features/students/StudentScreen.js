import { format } from "date-fns";
import React from "react";
import { Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getDisciplineName } from "../../../constants/disciplines";
import { getSubscriptionStatusName, getTrialSubscriptionStatusName } from "../../../constants/subscriptions";
import { getStudentScreenDetails } from "../../../services/apiStudentService";
import { DisciplineIcon } from "../../common/DisciplineIcon";
import { CalendarWeek } from "../../shared/calendar/CalendarWeek";
import { EditIcon } from "../../shared/icons/EditIcon";

import SubscriptionAttendancesModal from "../../shared/modals/SubscriptionAttendancesModal";
import { AttendanceModal } from "../../shared/slots/AttendanceModal";
import StudentScreenCard from "./StudentScreenCard";

class StudentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {
        firstName: "",
        phone: "",
        level: "Начинающий",
      },
      subscriptions: [],

      // Attendance Details
      showAttendanceDetailsModal: false,
      selectedAttendance: null,
      
      // Subscription Attendances Modal
      showSubscriptionAttendancesModal: false,
      selectedSubscription: null,
      subscriptionAttendances: [],
      isLoadingAttendances: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    const details = await getStudentScreenDetails(this.props.match.params.id);

    this.setState({
      student: details.student,
      subscriptions: details.subscriptions,
      attendances: details.attendances,
    });
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push(`/student/edit/${this.props.match.params.id}`);
  };

  handleSelectEvent = (slotInfo) => {
    console.log(slotInfo);
    const newSelectedAttendance = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];
    this.setState({ showAttendanceDetailsModal: true, selectedAttendance: newSelectedAttendance });
  };

  handleCloseModal = () => {
    this.setState({ 
      showAttendanceDetailsModal: false,
      selectedAttendance: null
    });
  };

  handleEditSubscriptionClick = (e, item) => {
    e.preventDefault();
    this.props.history.push(`/subscription/${item.subscriptionId}/edit`);
  };

  handleViewSubscriptionAttendances = async (subscription) => {
    this.setState({
      showSubscriptionAttendancesModal: true,
      selectedSubscription: subscription,
      isLoadingAttendances: true,
      subscriptionAttendances: []
    });

    try {
      // You'll need to implement this API call
      // const attendances = await getSubscriptionAttendances(subscription.subscriptionId);
      
      // For now, filter from existing attendances (you can improve this later)
      const filteredAttendances = this.state.attendances?.filter(
        attendance => attendance.subscriptionId === subscription.subscriptionId
      ) || [];
      
      this.setState({
        subscriptionAttendances: filteredAttendances,
        isLoadingAttendances: false
      });
    } catch (error) {
      console.error('Failed to load subscription attendances:', error);
      this.setState({
        isLoadingAttendances: false,
        subscriptionAttendances: []
      });
    }
  };

  handleCloseSubscriptionAttendancesModal = () => {
    this.setState({
      showSubscriptionAttendancesModal: false,
      selectedSubscription: null,
      subscriptionAttendances: [],
      isLoadingAttendances: false
    });
  };

  handleAttendanceClick = (attendance) => {
    // Open the attendance modal when clicking on an attendance in the list
    this.setState({
      selectedAttendance: attendance,
      showAttendanceDetailsModal: true
    });
  };

  renderSubscriptionsTable(subscriptions) {
    let subscriptionsTable;

    if (subscriptions && subscriptions.length > 0) {
      subscriptionsTable = (
        subscriptions.map((item, index) => (
          <tr key={index}>
            <td>{format(item.startDate, "yyyy-MM-dd")}</td>
            <td>
              <DisciplineIcon disciplineId={item.disciplineId} />
              <span style={{ marginLeft: "10px" }}>{getDisciplineName(item.disciplineId)}</span>
            </td>
            <td>
              <Link to={`/teacher/${item.teacher.teacherId}`}>
                {item.teacher.firstName} {item.teacher.lastName}
              </Link>
            </td>
            <td>{item.attendancesLeft} из {item.attendanceCount}</td>
            <td>{getSubscriptionStatusName(item.status)}</td>
            <td>
              <div className="d-flex gap-2">
                <EditIcon onIconClick={(e, _item) => this.handleEditSubscriptionClick(e, item)} />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => this.handleViewSubscriptionAttendances(item)}
                  title="Просмотреть занятия"
                >
                  Занятия
                </button>
              </div>
            </td>
          </tr>
        ))
      );
    } else {
      subscriptionsTable = (
          <tr key={1}>
            <td colSpan="6" style={{ textAlign: "center" }}>
              Нет записей
            </td>
          </tr>
      );
    }

    return (
      <Table striped bordered hover>
          <thead>
            <tr>
              <th>Дата начала</th>
              <th>Направление</th>
              <th>Преподаватель</th>
              <th>Занятий осталось</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subscriptionsTable}
          </tbody>
      </Table>
    )
  }

  renderTrialsTable(subscriptions) {
    let trialsTable;

    if (subscriptions && subscriptions.length > 0) {
      trialsTable = (
        subscriptions.map((item, index) => (
          <tr key={index}>
            <td>{format(item.startDate, "yyyy-MM-dd")}</td>
            <td>
              <Link to={`/teacher/${item.teacher.teacherId}`}>
                {item.teacher.firstName} {item.teacher.lastName}
              </Link>
            </td>
            <td>
              <DisciplineIcon disciplineId={item.disciplineId} />
              <span style={{ marginLeft: "10px" }}>{getDisciplineName(item.disciplineId)}</span>
            </td>
            <td>{getTrialSubscriptionStatusName(item.trialStatus)}</td>
          </tr>
      )));
    } else {
      trialsTable = (
          <tr key={1}>
            <td colSpan="4" style={{ textAlign: "center" }}>
              Нет записей
            </td>
          </tr>
      );
    }

    return(
      <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "100px" }}>Дата</th>
              <th>Преподаватель</th>
              <th>Направление</th>
              <th>Результат</th>
            </tr>
          </thead>
          <tbody>{trialsTable}</tbody>
      </Table>
    )
  }

  render() {
    const { student, subscriptions, attendances, selectedAttendance, showAttendanceDetailsModal } = this.state;

    const sortedSubscriptions = subscriptions.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA; // Descending order
    });

    // Subscriptions
    const nonTrialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus === null);

    // Trials
    const trialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus !== null);

    // Events
    let events;
    if (attendances) {
      events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title: attendance.isTrial ? "Пробное занятие" : "Занятие",
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        isTrial: attendance.isTrial,
      }));
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <StudentScreenCard item={student} history={this.props.history} />
        </Row>
        <Row className="mb-3">
          <Tabs defaultActiveKey="products" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="products" title="Продукты">
                <h3>Абонементы</h3>
                {this.renderSubscriptionsTable(nonTrialSubscriptions)}

                <h3>Пробные занятия</h3>
                {this.renderTrialsTable(trialSubscriptions)}  

                <h3>Репетиции</h3>
                  Нет записей

            </Tab>
            <Tab eventKey="calendar" title="Календарь">
              <CalendarWeek
                events={events}
                onSelectEvent={(slotInfo) => {
                  this.handleSelectEvent(slotInfo);
                }}
              />
              <AttendanceModal
                attendance={selectedAttendance}
                show={showAttendanceDetailsModal}
                handleClose={() => {
                  this.handleCloseModal();
                }}
              />
            </Tab>
          </Tabs>

          <SubscriptionAttendancesModal
            show={this.state.showSubscriptionAttendancesModal}
            onHide={this.handleCloseSubscriptionAttendancesModal}
            subscription={this.state.selectedSubscription}
            attendances={this.state.subscriptionAttendances}
            isLoading={this.state.isLoadingAttendances}
            onAttendanceClick={this.handleAttendanceClick}
          />
        </Row>
        <Row>
          
        </Row>
      </Container>
    );
  }
}

export default StudentScreen;
