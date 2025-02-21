import React from "react";
import { getStudentScreenDetails } from "../../services/apiStudentService";
import { Row, Col, Container, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

class StudentScreen extends React.Component {
  constructor(props)
  {
      super(props);
      this.state = {
          student: {
            firstName : "",
            phone : "",
          },
          subscriptions: [
            {
              descipline: "Vocal",
              status: "Активный",
              description: "С 01-04-2025 до 01-05-2025",
          }
        ]
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleEditClick = this.handleEditClick.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    const details = await getStudentScreenDetails(this.props.match.params.id);

    this.setState({student : details.student});
  }

  handleChange = (e) =>{
      const {id, value} = e.target
      this.setState({[id] : value})
  }

  handleEditClick = (e) =>{
    e.preventDefault();
    console.log("22");
    this.props.history.push('/students/edit/'+ this.props.match.params.id);
  }

  render() {
    const {firstName, lastName, phone} = this.state.student;

    let subscriptionsList;
    if (this.state.subscriptions){
      subscriptionsList = this.state.subscriptions.map((item, index) => (
        <tr key={index}>
          <td>{item.description}</td>
          <td>{item.descipline}</td>
          <td>{item.status}</td>
        </tr>
        ));
    }
    else{
      subscriptionsList = <tr key={1}>
        <td></td>
        <td>Нет записей</td>
        <td></td>
      </tr>
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4">
            <h2 style={{ textAlign: "left" }}>{firstName} {lastName}</h2> 

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Телефон</Form.Label>
              <Form.Control onChange={this.handleChange} value={phone} placeholder="введите телефон..."/>
            </Form.Group>
          </Col>
          <Col md="4">
                <Button variant="secondary" type="null" size="sm" onClick={this.handleEditClick}>
                    Редактировать
                </Button>
          </Col>
        </Row>
        <Row>
            <Col>
                <Link to="/admin/subscriptionForm">
                        <Button variant="info" type="null" size="sm" onClick={this.handleSave}>
                            Добавить пробное занятие
                        </Button>
                    </Link>

                <Link to="/admin/subscriptionForm">
                        <Button variant="warning" type="null" size="sm" onClick={this.handleSave}>Добавить абонемент</Button>
                    </Link>
            </Col>
        </Row>
        <Row>
            <Col md="8">
            <Table striped bordered hover style={{ marginTop: "20px" }}>
                    <thead>
                      <tr>
                        <th>Абонементы</th>
                        <th>Дисциплина</th>
                        <th>Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionsList}
                    </tbody>
                  </Table>

            </Col>
            <Col md="4">
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
