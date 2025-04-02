import React from "react";
import { getStudentScreenDetails } from "../../services/apiStudentService";
import { Row, Col, Container, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import StudentScreenCard from "./StudentScreenCard";
import { StudentAttendanceDetailsModal } from "./StudentAttendanceDetailsModal";
import { CalendarWeek } from "../common/CalendarWeek";

import { getDisciplineName } from "../constants/disciplines";
import { getSubscriptionStatusName } from "../constants/subscriptions";

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
      selectedAttendanceDetails:null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    const details = await getStudentScreenDetails(this.props.match.params.id);
    const fakeSubscriptions = [
      {
        descipline: "Электро гитара",
        status: "Активный",
        description: "6",
        teacherName: "Михаил",
      },
    ];

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
    this.props.history.push("/students/edit/" + this.props.match.params.id);
  };

  handleSelectEvent = (teacherId, slotInfo) => {
    const newSelectedAttendanceDetails = this.state.attendances.filter(a=> a.attendanceId === slotInfo.id)[0]
    this.setState({showAttendanceDetailsModal: true, selectedAttendanceDetails: newSelectedAttendanceDetails});
  };

  render() {
    const { student, subscriptions, attendances, selectedAttendanceDetails, showAttendanceDetailsModal } = this.state;
    console.log("subscriptions");
    console.log(subscriptions);
    let subscriptionsList;
    if (subscriptions && subscriptions.length > 0) {
      subscriptionsList = subscriptions.map((item, index) => (
        <tr key={index}>
          <td>{getDisciplineName(item.disciplineId)}</td>
          <td>Оспан</td>
          <td>1</td>
          <td>{getSubscriptionStatusName(item.status)}</td>
          <td>
            <Button size="sm" variant="success">
              Продлить
            </Button>
          </td>
        </tr>
      ));
    } else {
      subscriptionsList = (
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

    const trialSubscriptionLink = "/student/" + student.studentId + "/subscriptionForm";

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <StudentScreenCard item={student} history={this.props.history} />
        </Row>
        <Row className="mb-3">
          <h3>Расписание</h3>
          <CalendarWeek events={events} />
          <StudentAttendanceDetailsModal
            selectedAttendanceDetails={selectedAttendanceDetails}
            show={showAttendanceDetailsModal}
            handleClose={() => {
              this.handleCloseSlotDetailsModal();
            }}
          />
        </Row>
        <Row>
          <h3>Абонементы</h3>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col md="10">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Направление</th>
                  <th>Преподаватель</th>
                  <th>Занятий</th>
                  <th>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{subscriptionsList}</tbody>
            </Table>
          </Col>
          <Col md="2">
            <div className="d-grid gap-2">
              <Link to={trialSubscriptionLink}>
                <Button variant="primary" type="null" size="md" className="w-100" onClick={this.handleSave}>
                  Пробное занятие
                </Button>
              </Link>
              <Link to="/admin/subscriptionForm">
                <Button variant="primary" type="null" size="md" className="w-100" onClick={this.handleSave}>
                  Новый абонемент
                </Button>
              </Link>
            </div>

            <Row>
              <Col></Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default StudentScreen;
