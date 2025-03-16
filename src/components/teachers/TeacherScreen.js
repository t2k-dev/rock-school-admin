import React from "react";
import { getTeacherScreenDetails } from "../../services/apiTeacherService";
import { Row, Col, Container, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import TeacherScreenCard from "./TeacherScreenCard";
import BigCalendarTest from "../common/WeekCalendar"

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
        teacherName: "Михаил",
      },
      {
        descipline: "Электро гитара",
        status: "Активный",
        description: "1",
        teacherName: "Азамат",
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
        <Row>
          <h3>Расписание</h3>
          <BigCalendarTest/>
        </Row>
      </Container>
    );
  }
}

export default TeacherScreen;
