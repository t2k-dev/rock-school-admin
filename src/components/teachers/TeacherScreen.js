import React from "react";
import { getTeacherScreenDetails } from "../../services/apiTeacherService";
import { Row, Col, Container, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import TeacherScreenCard from "./TeacherScreenCard";
import { CalendarWeek } from "../common/CalendarWeek";

import { getDisciplineName } from "../constants/disciplines";
import { getSubscriptionStatusName } from "../constants/subscriptions";

class TeacherScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teacher: {
        firstName: "",
        phone: "",
      },
      subscriptions: [],
    };

    this.handleEditClick = this.handleEditClick.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
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
    });
  }

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push("/teachers/edit/" + this.props.match.params.id);
  };

  render() {
    const { teacher, backgroundEvents, subscriptions, attendances } = this.state;
    
    // Events
    let events;
    if (attendances) {
      events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title: attendance.student.firstName + ' ' + attendance.student.lastName,
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        isTrial: attendance.isTrial,
      }));
    }

    // Subscriptions
    let subscriptionsList;
    if (subscriptions && subscriptions.length > 0) {
      subscriptionsList = subscriptions.map((item, index) => (
        <tr key={index}>
          <td>{getDisciplineName(item.disciplineId)}</td>
          <td>
            <Link to={"/student/"+item.student.studentId}>{item.student.firstName} {item.student.lastName}</Link>
          </td>
          <td>{item.description}</td>
          <td>{getSubscriptionStatusName(item.status)}</td>
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

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <TeacherScreenCard item={teacher} history={this.props.history} />
        </Row>
        <Row>
          <h3>Расписание</h3>
          <CalendarWeek events={events} backgroundEvents={backgroundEvents} />
        </Row>
        <Row className="mt-3">
          <h3>Абонементы</h3>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col md="12">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Направление</th>
                  <th>Ученик</th>
                  <th>Осталось занятий</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>{subscriptionsList}</tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default TeacherScreen;
