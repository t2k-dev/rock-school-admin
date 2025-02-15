import React from "react";
import { getStudents } from "../../services/apiStudentService";
import { Row, Col, Container, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

class TeacherScreen extends React.Component {
  render() {
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4">
            <h2 style={{ textAlign: "center" }}>Преподаватель</h2>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>Имя</Form.Label>
              <Form.Control onChange={this.handleChange} value="Сергей Петров" placeholder="введите имя..." autoComplete="off"/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Телефон</Form.Label>
              <Form.Control onChange={this.handleChange} value='+7 7773705795' placeholder="введите телефон..."/>
            </Form.Group>
          </Col>
          <Col md="4"></Col>
        </Row>
        <Row>
            <Col>
                <Link to="/teachers/edit/1">
                    <Button variant="secondary" type="null" onClick={this.handleSave}>
                        Редактировать
                    </Button>
                </Link>
            </Col>
        </Row>
        <Row>
            <Col md="8">
            <Table striped bordered hover style={{ marginTop: "20px" }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Абонементы</th>
                        <th>Статус</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key={1}>
                          <td>1</td>
                          <td>ФЫВфыв</td>
                          <td>1</td>
                          <td>
                            <Button>
                              <i>-</i>
                            </Button>
                          </td>
                        </tr>
                    </tbody>
                  </Table>

            </Col>
            <Col md="4">
            <Row>
                <Col>
                    <Link to="/admin/addSubscription">
                        <Button variant="warning" type="null" onClick={this.handleSave}>Добавить абонемент</Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Link to="/admin/addSubscription">
                        <Button variant="info" type="null" onClick={this.handleSave}>
                            Добавить пробное занятие
                        </Button>
                    </Link>
                </Col>
                </Row>
            </Col>
        </Row>
      </Container>
    );
  }
}

export default TeacherScreen;
