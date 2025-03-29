import React from "react";
import { getTeacherScreenDetails } from "../../services/apiTeacherService";
import { Row, Col, Container, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import TeacherScreenCard from "./TeacherScreenCard";
import {CalendarWeek} from "../common/CalendarWeek";

const events = [
  {
    title: "Алексей Кутузов",
    start: new Date(1900, 0, 2, 11, 0, 0, 0),
    end: new Date(1900, 0, 2, 12, 0, 0, 0),
  },
  {
    title: "Всеволод Жердеев",
    start: new Date(1900, 0, 2, 14, 0, 0, 0),
    end: new Date(1900, 0, 2, 15, 0, 0, 0),
  },
  {
    title: "Ануар Ахметкалиев ",
    start: new Date(1900, 0, 4, 18, 0, 0, 0),
    end: new Date(1900, 0, 4, 19, 0, 0, 0),
  },
];

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
    const fakeSubscriptions = [
      {
        descipline: "Электро гитара",
        status: "Активный",
        description: "6",
        teacherName: "Ануар Ахметкалиев",
      },
      {
        descipline: "Электро гитара",
        status: "Активный",
        description: "1",
        teacherName: "Всеволод Жердеев",
      },
      {
        descipline: "Укулеле",
        status: "Отмененный",
        description: "10",
        teacherName: "Джесика",
      },
    ];

    const backgroundEvents = details.teacher.scheduledWorkingPeriods.map((item) => ({
        start: item.startDate,
        end: item.endDate,
    }));

    this.setState({
      teacher: details.teacher,
      subscriptions: fakeSubscriptions,
      backgroundEvents: backgroundEvents,
    });
  }

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push("/teachers/edit/" + this.props.match.params.id);
  };

  render() {
    const { teacher, backgroundEvents, subscriptions } = this.state;
    let subscriptionsList;
    if (subscriptions && subscriptions.length > 0) {
      subscriptionsList = subscriptions.map((item, index) => (
        <tr key={index}>
          <td>{item.descipline}</td>
          <td>{item.teacherName}</td>
          <td>{item.description}</td>
          <td>{item.status}</td>
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
          <CalendarWeek events={events} backgroundEvents={backgroundEvents}/>
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
