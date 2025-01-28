import React from "react";
import {  Form, Container, Row, Col, Table, FormCheck, Button} from "react-bootstrap";

import { getTeacher, registerTeacher } from "../../services/apiTeacherService";

class WorkingPeriods extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type == "New",
    };
  }

  render() {
    return (
      <Form.Group className="mb-3">
        <b>Расписание</b>
        <Row style={{ marginTop: "20px" }}>
          <Col md="5">
            <Form.Select
              aria-label="Веберите день..."
              value={this.state.periodDay}
              onChange={(e) => this.setState({ periodDay: e.target.value })}
            >
              <option>День недели...</option>
              <option value="1">Понедельник</option>
              <option value="2">Вторник</option>
              <option value="3">Среда</option>
              <option value="4">Четверг</option>
              <option value="5">Пятница</option>
              <option value="6">Суббота</option>
              <option value="7">Воскресенье</option>
            </Form.Select>
          </Col>
          <Col>
            <Row>
              <Form.Label column md={1}>
                с
              </Form.Label>
              <Col md={4}>
                <Form.Control
                  placeholder="чч:мм"
                  value={this.state.periodStart}
                  onChange={(e) =>
                    this.setState({ periodStart: e.target.value })
                  }
                />
              </Col>

              <Form.Label column md={1}>
                по
              </Form.Label>
              <Col md={4}>
                <Form.Control
                  placeholder="чч:мм"
                  value={this.state.periodEnd}
                  onChange={(e) => this.setState({ periodEnd: e.target.value })}
                />
              </Col>
              <Col md={2}>
                <Button onClick={this.addWorkingPeriod}>
                  <i>+</i>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>День</th>
                <th>С</th>
                <th>До</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.state.WorkingPeriods.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{this.getDayName(item.day)}</td>
                  <td>{item.startTime}</td>
                  <td>{item.endTime}</td>
                  <td>
                    <Button onClick={() => this.deleteWorkingPeriod(index)}>
                      <i>-</i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Form.Group>
    );
  }
}

export default WorkingPeriods;
