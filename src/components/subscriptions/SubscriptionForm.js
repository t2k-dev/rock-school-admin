import React from "react";
import { Form, Container, Row, Col, Image, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { getAvailablePeriods } from "../../services/apiTeacherService";
import { addSubscription } from "../../services/apiSubscriptionService";

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentId: this.props.match.params.id,

      disciplineId: 0,
      teacherId: "",
      attendanceCount: 0,
      attendanceLength: 0,

      generatedSchedule: "",
      teachers: [],
    };
    this.generateAvailablePeriods = this.generateAvailablePeriods.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  generateAvailablePeriods = async (e) => {
    const response = await getAvailablePeriods(this.state.disciplineId, this.state.studentId, 1);
    console.log(response);
    let result = "";
    
    response.data.periods.forEach((element) => {
      result = result + element + "\n";
    });

    this.setState({ 
        generatedSchedule: result,
        teachers: response.data.teachers
    });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
        studentId: this.state.studentId,
        disciplineId: this.state.disciplineId,
        teacherId: this.state.teacherId,
        attendanceCount: this.state.attendanceCount,
        attendanceLength: this.state.attendanceLength,
    };

    await addSubscription(requestBody);
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  render() {
    const { disciplineId, teacherId, attendanceCount, attendanceLength, generatedSchedule, teachers } = this.state;
console.log(teachers);
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 style={{ textAlign: "center" }}>Новый абонемент</h2>
            <Form>
              <Form.Group className="mb-3" controlId="discipline">
                <Form.Label>Предмет</Form.Label>
                <Form.Select aria-label="Веберите..." value={disciplineId} onChange={(e) => this.setState({ disciplineId: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">Гитара</option>
                  <option value="2">Электро гитара</option>
                  <option value="3">Бас гитара</option>
                  <option value="4">Укулеле</option>
                  <option value="5">Вокал</option>
                  <option value="6">Ударные</option>
                  <option value="7">Фортепиано</option>
                  <option value="8">Скрипка</option>
                  <option value="9">Экстрим вокал</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="GenerteSchedule">
                <Form.Label>Расписание</Form.Label>
                <Form.Control as="textarea" value={generatedSchedule} onChange={this.handleChange} placeholder="" />
                <Form.Label onClick={this.generateAvailablePeriods} style={{ marginTop: "20px", color: "green" }}>
                  Сгенерировать
                </Form.Label>
              </Form.Group>
              <hr></hr>
              <Form.Group className="mb-3" controlId="Teacher">
                <Form.Label>Преподаватель</Form.Label>
                <Form.Select aria-label="Веберите..." value={teacherId} onChange={(e) => this.setState({ teacherId: e.target.value })}>
                  <option>выберите...</option>
                  {teachers.map((teacher,index) => (
                    <option key={index} value={teacher.teacherId}>
                        {teacher.fullName}
                    </option>
                ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="Schedule">
                <Form.Label>Расписание</Form.Label>
                <Form.Control onChange={this.handleChange} placeholder="" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="Subscription">
                <Form.Label>Абонемент (кол-во занятий)</Form.Label>
                <Form.Control value={attendanceCount} onChange={this.handleChange} placeholder="" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="AttendanceLength">
                <Form.Label>Длительность урока</Form.Label>
                <Form.Select
                  aria-label="Веберите..."
                  value={attendanceLength}
                  onChange={(e) => this.setState({ attendanceLength: e.target.value })}
                >
                  <option>выберите...</option>
                  <option value="1">Час</option>
                  <option value="2">Полтора часа</option>
                </Form.Select>
              </Form.Group>

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

export default SubscriptionForm;
