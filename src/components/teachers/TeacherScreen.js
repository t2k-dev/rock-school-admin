import { format } from "date-fns";
import React from "react";
import { Col, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getTeacherScreenDetails } from "../../services/apiTeacherService";
import { EditIcon } from "../icons/EditIcon";

import { CalendarWeek } from "../common/CalendarWeek";
import { DisciplineIcon } from "../common/DisciplineIcon";
import TeacherScreenCard from "./TeacherScreenCard";

import { getDisciplineName } from "../constants/disciplines";
import { getSubscriptionStatusName, getTrialSubscriptionStatusName } from "../constants/subscriptions";

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
    this.handleEditSubscriptionClick = this.handleEditSubscriptionClick.bind(this);
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

  handleEditSubscriptionClick = (e, item) => {
    e.preventDefault();
    this.props.history.push(`/subscription/${item.subscriptionId}/edit`);
  };

  render() {
    const { teacher, backgroundEvents, subscriptions, attendances } = this.state;

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
          : attendance.student.firstName + " " + attendance.student.lastName,
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        isTrial: attendance.isTrial,
      }));
    }

    // Subscriptions
    let subscriptionsTable;
    const nonTrialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus === null);
console.log("nonTrialSubscriptions");
console.log(nonTrialSubscriptions);

    if (nonTrialSubscriptions && nonTrialSubscriptions.length > 0) {
      subscriptionsTable = (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Дата начала</th>
              <th>Ученик</th>
              <th>Направление</th>
              <th>Занятий осталось</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {nonTrialSubscriptions.map((item, idx) => (
              <tr key={idx}>
                <td>{format(item.startDate, "yyyy-MM-dd")}</td>
                <td>
                  {item.childSubscriptions && item.childSubscriptions.length > 0 
                    ? item.childSubscriptions.map((childItem, idx) => (
                        <Link key={idx} to={"/student/" + childItem.student.studentId}>
                          {childItem.student.firstName} {childItem.student.lastName}
                          {idx < item.childSubscriptions.length - 1 && ", "}
                        </Link>
                      ))
                    : 
                    <Link key={idx} to={"/student/" + item.student.studentId}>
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
              <th>Ученик</th>
              <th>Направление</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {trialSubscriptions.map((item, index) => (
              <tr key={index}>
                <td>{format(item.startDate, "yyyy-MM-dd")}</td>
                <td>
                  <Link to={`/student/${item.student.studentId}`}>
                    {item.student.firstName} {item.student.lastName}
                  </Link>
                </td>
                <td>{getDisciplineName(item.disciplineId)}</td>
                <td>{getTrialSubscriptionStatusName(item.trialStatus)}</td>
                <td>
                  <EditIcon onIconClick={(e, _item) => this.handleEditSubscriptionClick(e, item)} />
                </td>
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
              <Table>{subscriptionsTable}</Table>
            </Tab>
            <Tab eventKey="trials" title="Пробные занятия">
              <Table>{trialsTable}</Table>
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
