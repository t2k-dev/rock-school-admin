import React from "react";
import { getTeacherScreenDetails } from "../../services/apiTeacherService";
import { Row, Col, Container, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import TeacherScreenCard from "./TeacherScreenCard";
import {CalendarWeek} from "../common/CalendarWeek";

const backgroundEvents = [
  {
    title: "",
    start: new Date(1900, 0, 2, 11, 0, 0, 0),
    end: new Date(1900, 0, 2, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 2, 16, 0, 0, 0),
    end: new Date(1900, 0, 2, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 3, 10, 0, 0, 0),
    end: new Date(1900, 0, 3, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 3, 16, 0, 0, 0),
    end: new Date(1900, 0, 3, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 4, 10, 0, 0, 0),
    end: new Date(1900, 0, 4, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 4, 16, 0, 0, 0),
    end: new Date(1900, 0, 4, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 7, 10, 0, 0, 0),
    end: new Date(1900, 0, 7, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 7, 16, 0, 0, 0),
    end: new Date(1900, 0, 7, 21, 0, 0, 0),
  },
];
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

    this.setState({
      teacher: details.teacher,
      subscriptions: fakeSubscriptions,
    });
  }

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push("/teachers/edit/" + this.props.match.params.id);
  };

  render() {
    const { teacher, subscriptions } = this.state;
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
        <Row>
          <h3>Абонементы</h3>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col md="10">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Дисциплина</th>
                  <th>Ученик</th>
                  <th>Осталось занятий</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>{subscriptionsList}</tbody>
            </Table>          
          </Col>
          <Col md="2">
            <div className="d-grid gap-2">
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

export default TeacherScreen;
