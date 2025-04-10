import React from "react";
import { Form, Container, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAvailableTeachers } from "../../services/apiTeacherService";
import { addSubscription } from "../../services/apiSubscriptionService";
import {CalendarWeek} from "../common/CalendarWeek";
import {AvailableTeachersModal} from "../teachers/AvailableTeachersModal";
import InputMask from "react-input-mask";
import {ScheduleEditorStartTime} from "../common/ScheduleEditorStartTime";
import { format, parse } from "date-fns";


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

export class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentId: this.props.match.params.id,
      disciplineId: 0,
      teacherId: "",
      startDate: "",
      attendanceCount: "",
      attendanceLength: 0,

      backgroundEvents: backgroundEvents,
      generatedSchedule: "",
      availableTeachers: [],
      teachers: [],
      schedules: [],
      showAvailableTeacherModal: false,
    };

    // AvailableTeachersModal
    this.generateAvailablePeriods = this.generateAvailablePeriods.bind(this);
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePeriodsChange = this.handlePeriodsChange.bind(this);
  }

  generateAvailablePeriods = async (e) => {
    e.preventDefault();
    // TODO: replace age
    const response = await getAvailableTeachers(this.state.disciplineId, 1, 1);

    this.setState({
      availableTeachers: response.data.availableTeachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
  };

  handleSave = async (e) => {
    e.preventDefault();
    
    const startDate = parse(this.state.startDate, "dd-MM-yyyy", new Date());

    const requestBody = {
      studentId: this.state.studentId,
      disciplineId: this.state.disciplineId,
      teacherId: this.state.teacherId,
      attendanceCount: this.state.attendanceCount,
      attendanceLength: this.state.attendanceLength,
      startDate: format(startDate, "yyyy-MM-dd"),
      schedule: this.state.schedule,
    };

    await addSubscription(requestBody);
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handlePeriodsChange = (periods) => {
    this.setState({ schedule: periods });
  };

  render() {
    const { disciplineId, teacherId, attendanceCount, attendanceLength, startDate, availableTeachers, showAvailableTeacherModal } = this.state;
    
    console.log('render');
    console.log('teacherId:'+teacherId);

    return (
      <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 style={{ textAlign: "center" }}>Новый абонемент</h2>
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
                  <option value="6">Ударные</option>
                  <option value="7">Фортепиано</option>
                  <option value="8">Скрипка</option>
                  <option value="9">Экстрим вокал</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="startDate">
                <Form.Label>Дата начала</Form.Label>
                <Form.Control
                  as={InputMask}
                  mask="99-99-9999"
                  maskChar=" "
                  onChange={this.handleChange}
                  value={startDate}
                  placeholder="введите дату..."
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="Subscription">
                <Form.Label>Количество занятий</Form.Label>
                <Form.Select aria-label="Веберите..." value={attendanceCount} onChange={(e) => this.setState({ attendanceCount: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">1</option>
                  <option value="2">4</option>
                  <option value="3">8</option>
                  <option value="4">12</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="AttendanceLength">
                <Form.Label>Длительность урока</Form.Label>
                <Form.Select aria-label="Веберите..." value={attendanceLength} onChange={(e) => this.setState({ attendanceLength: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">Час</option>
                  <option value="2">Полтора часа</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 mt-4 text-center" controlId="GenerteSchedule">
                <Button variant="outline-secondary" type="null" onClick={this.generateAvailablePeriods}>
                  Получить доступные окна
                </Button>
                <AvailableTeachersModal
                  show={showAvailableTeacherModal}
                  availableTeachers={availableTeachers}
                  updateAvailableSlots={this.updateAvailableSlots}
                  handleClose={this.handleCloseAvailableTeachersModal}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="Teacher">
                <Form.Label>Преподаватель</Form.Label>
                <Form.Select aria-label="Веберите..." value={teacherId} onChange={(e) => this.setState({ teacherId: e.target.value })}>
                  <option>выберите...</option>
                  {availableTeachers.map((teacher, index) => (
                    <option key={index} value={teacher.teacherId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 mt-3" controlId="Schedule">
                <ScheduleEditorStartTime periods={this.state.schedules} handlePeriodsChange={this.handlePeriodsChange} attendanceLength={this.state.attendanceLength}/>
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
