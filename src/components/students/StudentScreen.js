import { format } from "date-fns";
import React from "react";
import { Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getStudentScreenDetails } from "../../services/apiStudentService";
import { CalendarWeek } from "../common/CalendarWeek";
import { DisciplineIcon } from "../common/DisciplineIcon";
import { getDisciplineName } from "../constants/disciplines";
import { getSubscriptionStatusName, getTrialSubscriptionStatusName } from "../constants/subscriptions";
import { EditIcon } from "../icons/EditIcon";

import { SlotDetailsModal } from "../home//SlotDetailsModal";
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
      selectedAttendanceDetails: null,
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
    const newSelectedSlotDetails = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];
    this.setState({ showAttendanceDetailsModal: true, selectedAttendanceDetails: newSelectedSlotDetails });
  };

  handleCloseModal = () => {
    this.setState({ showAttendanceDetailsModal: false });
  };

  handleEditSubscriptionClick = (e, item) => {
    e.preventDefault();
    this.props.history.push(`/subscription/${item.subscriptionId}/edit`);
  };

  render() {
    const { student, subscriptions, attendances, selectedAttendanceDetails, showAttendanceDetailsModal } = this.state;

    const sortedSubscriptions = subscriptions.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA; // Descending order
    });

    // Subscriptions
    let subscriptionsTable;

    const nonTrialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus === null);
    if (nonTrialSubscriptions && nonTrialSubscriptions.length > 0) {
      subscriptionsTable = (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Дата начала</th>
              <th>Преподаватель</th>
              <th>Направление</th>
              <th>Занятий</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {nonTrialSubscriptions.map((item, index) => (
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
                <td>{item.attendancesLeft} из {item.attendanceCount}</td>
                <td>{getSubscriptionStatusName(item.status)}</td>
                <td>
                  <EditIcon onIconClick={(e, _item) => this.handleEditSubscriptionClick(e, item)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else {
      subscriptionsTable = (
        <tr key={1}>
          <td colSpan="4" style={{ textAlign: "center" }}>
            Нет записей
          </td>
        </tr>
      );
    }

    // Trials
    let trialsTable;
    const trialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus !== null);
    if (trialSubscriptions && trialSubscriptions.length > 0) {
      trialsTable = (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "100px" }}>Дата</th>
              <th>Преподаватель</th>
              <th>Направление</th>
              <th>Результат</th>
            </tr>
          </thead>
          <tbody>
            {trialSubscriptions.map((item, index) => (
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
            ))}
          </tbody>
        </Table>
      );
    } else {
      trialsTable = (
        <tr key={1}>
          <td colSpan="4" style={{ textAlign: "center" }}>
            Нет записей
          </td>
        </tr>
      );
    }

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
          <h3>Расписание</h3>
          <CalendarWeek
            events={events}
            onSelectEvent={(slotInfo) => {
              this.handleSelectEvent(slotInfo);
            }}
          />
          <SlotDetailsModal
            selectedSlotDetails={selectedAttendanceDetails}
            show={showAttendanceDetailsModal}
            handleClose={() => {
              this.handleCloseModal();
            }}
          />
        </Row>
        <Row>
          <Tabs defaultActiveKey="subscriptions" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="subscriptions" title="Абонементы">
              {subscriptionsTable}
            </Tab>
            <Tab eventKey="trials" title="Пробные">
              {trialsTable}
            </Tab>
            <Tab eventKey="rehersals" title="Репетиции">
              Нет записей
            </Tab>
          </Tabs>
        </Row>
      </Container>
    );
  }
}

export default StudentScreen;
