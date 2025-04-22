import React from "react";
import { getTeacherScreenDetails } from "../../services/apiTeacherService";
import { Tabs, Tab, Row, Col, Container, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { format } from "date-fns";

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
        title: attendance.student.firstName + " " + attendance.student.lastName,
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        isTrial: attendance.isTrial,
      }));
    }

    // Subscriptions
    let subscriptionsTable;
    const nonTrialSubscriptions = subscriptions.filter(s => s.isTrial === false);
    if (nonTrialSubscriptions && nonTrialSubscriptions.length > 0) {
      subscriptionsTable = (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Ученик</th>
              <th>Направление</th>
              <th>Осталось занятий</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((item, index) => (
              <tr key={index}>
                <td>
                  <Link to={"/student/" + item.student.studentId}>
                    {item.student.firstName} {item.student.lastName}
                  </Link>
                </td>
                <td>{getDisciplineName(item.disciplineId)}</td>
                <td>{item.description}</td>
                <td>{getSubscriptionStatusName(item.status)}</td>
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
    const trialSubscriptions = subscriptions.filter(s => s.isTrial === true);
    if (trialSubscriptions && trialSubscriptions.length > 0) {
      trialsTable = (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{width:"100px"}}>Дата</th>
              <th>Ученик</th>
              <th>Направление</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {trialSubscriptions.map((item, index) => (
              <tr key={index}>
                <td>{format(item.startDate, "yyyy-MM-dd")}</td>
                <td>
                  <Link to={"/student/" + item.student.studentId}>
                    {item.student.firstName} {item.student.lastName}
                  </Link>
                </td>
                <td>{getDisciplineName(item.disciplineId)}</td>
                <td>{getSubscriptionStatusName(item.status)}</td>
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
          <Tabs defaultActiveKey="subscriptions" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="subscriptions" title="Абонементы">
              <Table striped bordered hover>
                {subscriptionsTable}
              </Table>
            </Tab>
            <Tab eventKey="trials" title="Пробные занятия">
              <Table>
                {trialsTable}
              </Table>
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
