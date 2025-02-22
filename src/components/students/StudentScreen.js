import React from "react";
import { getStudentScreenDetails } from "../../services/apiStudentService";
import { Row, Col, Container, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import StudentScreenCard from "./StudentScreenCard";

class StudentScreen extends React.Component {
  constructor(props)
  {
      super(props);
      this.state = {
          student: {
            firstName : "",
            phone : "",
            level : "Начинающий"
          },
          subscriptions: []
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
    }]

    this.setState({
      student : details.student,
      subscriptions: fakeSubscriptions,
    });
  }

  handleChange = (e) =>{
      const {id, value} = e.target
      this.setState({[id] : value})
  }

  handleEditClick = (e) =>{
    e.preventDefault();
    this.props.history.push('/students/edit/'+ this.props.match.params.id);
  }

  render() {
    const {student, subscriptions} = this.state;
    let subscriptionsList;
    if (subscriptions && subscriptions.length > 0){
      subscriptionsList = subscriptions.map((item, index) => (
        <tr key={index}>
          <td>{item.descipline}</td>
          <td>{item.teacherName}</td>
          <td>{item.description}</td>
          <td>{item.status}</td>
        </tr>
        ));
    }
    else{
      subscriptionsList = <tr key={1}>
        <td colSpan="4" style={{textAlign:"center"}}>Нет записей</td>
      </tr>
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <StudentScreenCard item={this.state.student} history={this.props.history}/>
        </Row>
        <Row>
            <Col>
            </Col>
        </Row>
        <Row><h3>Абонементы</h3></Row>
        <Row style={{ marginTop: "20px" }}>
            <Col md="10">
              <Table striped bordered hover >
                    <thead>
                      <tr>
                        <th>Дисциплина</th>
                        <th>Преподаватель</th>
                        <th>Осталось занятий</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionsList}
                    </tbody>
                  </Table>

            </Col>
            <Col md="2">
            <div className="d-grid gap-2">
                <Link to="/admin/subscriptionForm">
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
                <Col>


                </Col>
              </Row>
            </Col>
        </Row>
      </Container>
    );
  }
}

export default StudentScreen;
