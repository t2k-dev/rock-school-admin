import React from "react";
import { Button, Col, Container, Form, FormGroup, Row } from "react-bootstrap";

import { ScheduleEditorNoRoom } from "../common/ScheduleEditorNoRoom";

export class WaitingScheduleForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type == "New",
      student: null,
      disciplineId: null,
      teachers: [],
      waitingSchedules: [],
    };
  }

  render() {
    const{disciplineId, teacherId, teachers} = this.state;
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="mb-4 text-center">{this.state.isNew ? "Предзапись" : "Редактировать предзапись"}</h2>
            <Form>
              <Form.Group className="mb-3" controlId="discipline">
                <Form.Label>Направление</Form.Label>
                <Form.Select aria-label="Веберите..." value={disciplineId} onChange={(e) => this.setState({ disciplineId: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">Гитара</option>
                  <option value="2">Электро гитара</option>
                  <option value="3">Бас гитара</option>
                  <option value="4">Укулеле</option>
                  <option value="5">Вокал</option>
                  <option value="6">Барабаны</option>
                  <option value="7">Фортепиано</option>
                  <option value="8">Скрипка</option>
                  <option value="9">Экстрим вокал</option>
                </Form.Select>
              </Form.Group>
              <FormGroup className="mb-3">
                <Form.Label>Преподаватель</Form.Label>
                <Form.Select
                  aria-label="Веберите..."
                  value={teacherId}
                  onChange={(e) => this.setState({ teacherId: e.target.value })}
                >
                  <option>выберите...</option>
                  {teachers.map((teacher, index) => (
                    <option key={index} value={teacher.teacherId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </Form.Select>
              </FormGroup>
              <ScheduleEditorNoRoom periods={this.state.waitingSchedules} handlePeriodsChange={this.handlePeriodsChange} />
              <hr></hr>
              <Button variant="primary" type="null" onClick={this.handleSave}>
                Сохранить
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
