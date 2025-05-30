import { format, getDay, parse } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { calculateAge } from "../common/DateTimeHelper";
import { ScheduleEditorWithSlots } from "../common/ScheduleEditorWithSlots";

import { addSubscription } from "../../services/apiSubscriptionService";
import { getAvailableTeachers, getWorkingPeriods } from "../../services/apiTeacherService";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

export class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      studentId: this.props.match.params.id,
      disciplineId: "",
      teacherId: "",
      startDate: "",
      attendanceCount: "",
      attendanceLength: 0,
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

  componentDidMount() {
    console.log("this.props")
    console.log(this.props)
    if (this.props.type === "Edit")
      return;

    let updatedAvailableTeachers = this.state.availableTeachers;

    if (this.props.location.state.teacher) {
      updatedAvailableTeachers.push(this.props.location.state.teacher);
    }

    this.setState({
      student: this.props.location.state.student || {},
      disciplineId: this.props.location.state.disciplineId || "",
      teacherId: this.props.location.state.teacher?.teacherId || "",
      availableTeachers: updatedAvailableTeachers || [],
    });
  }

  generateAvailablePeriods = async (e) => {
    e.preventDefault();

    let teachers;
    if (this.props.location.state.teacher) {
      // TODO: refactor for non array
      const response = await getWorkingPeriods(this.props.location.state.teacher.teacherId);
      teachers = response.data.availableTeachers;
    } else {
      // TODO: branchId
      const response = await getAvailableTeachers(this.state.disciplineId, calculateAge(this.state.student.birthDate), 1);
      teachers = response.data.availableTeachers;
    }

    this.setState({
      availableTeachers: teachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const startDate = parse(this.state.startDate, "dd.MM.yyyy", new Date());

    const requestBody = {
      studentId: this.state.student.studentId,
      disciplineId: this.state.disciplineId,
      teacherId: this.state.teacherId,
      attendanceCount: this.state.attendanceCount,
      attendanceLength: this.state.attendanceLength,
      startDate: format(startDate, "yyyy.MM.dd"),
      schedules: this.state.schedules,
      branchId: 1,
    };

    await addSubscription(requestBody);

    this.props.history.push(`/student/${this.state.student.studentId}`);
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handlePeriodsChange = (periods) => {
    this.setState({ schedules: periods });
  };

  updateAvailableSlots = (availableSlots) => {
    let periods = [];
    availableSlots.forEach((slot) => {
      const newPeriod = {
        weekDay: getDay(slot.start),
        startTime: format(slot.start, "HH:mm"),
        endTime: format(slot.end, "HH:mm"),
        roomId: slot.roomId,
      };
      periods.push(newPeriod);
    });

    this.setState({ availableSlots: availableSlots, schedules: periods });
  };

  render() {
    const { disciplineId, teacherId, availableSlots, attendanceCount, attendanceLength, startDate, availableTeachers, showAvailableTeacherModal } =
      this.state;
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
                  <option value="6">Барабаны</option>
                  <option value="7">Фортепиано</option>
                  <option value="8">Скрипка</option>
                  <option value="9">Экстрим вокал</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Дата начала</Form.Label>
                <div style={{ display: "block" }}>
                  <InputGroup className="mb-3 " controlId="startDate">
                    <Form.Control
                      as={DatePicker}
                      value={startDate}
                      locale={ru}
                      selected={this.state.startDate ? parse(this.state.startDate, "dd.MM.yyyy", new Date()) : null}
                      onChange={(date) => this.setState({ startDate: format(date, "dd.MM.yyyy") })}
                      placeholderText="дд.мм.гггг"
                    />
                    <Button variant="outline-secondary" onClick={() => this.setState({ startDate: format(new Date(), "dd.MM.yyyy") })}>
                      Сегодня
                    </Button>
                  </InputGroup>
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="Subscription">
                <Form.Label>Количество занятий</Form.Label>
                <Form.Select aria-label="Веберите..." value={attendanceCount} onChange={(e) => this.setState({ attendanceCount: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">1</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
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

              <hr></hr>
              <b>Преподаватель</b>
              <InputGroup className="mb-3 mt-4 text-center" controlId="GenerteSchedule">
                <Form.Select
                  aria-label="Веберите..."
                  value={teacherId}
                  onChange={(e) => this.setState({ teacherId: e.target.value })}
                  style={{ width: "200px" }}
                >
                  <option>выберите...</option>
                  {availableTeachers.map((teacher, index) => (
                    <option key={index} value={teacher.teacherId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </Form.Select>

                <Button variant="outline-secondary" type="null" onClick={this.generateAvailablePeriods}>
                  Доступные окна...
                </Button>
              </InputGroup>
              <AvailableTeachersModal
                show={showAvailableTeacherModal}
                availableTeachers={availableTeachers}
                updateAvailableSlots={this.updateAvailableSlots}
                handleClose={this.handleCloseAvailableTeachersModal}
              />

              <Form.Group className="mb-3" controlId="Teacher"></Form.Group>
              <hr></hr>
              <Form.Group className="mb-3 mt-3" controlId="Schedule">
                <ScheduleEditorWithSlots
                  periods={this.state.schedules}
                  availableSlots={availableSlots}
                  handlePeriodsChange={this.handlePeriodsChange}
                  attendanceLength={this.state.attendanceLength}
                />
              </Form.Group>

              <hr></hr>
              <Container className="text-center">
                <Button variant="primary" type="null" onClick={this.handleSave}>
                  Сохранить
                </Button>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
