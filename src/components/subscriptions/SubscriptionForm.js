import { format, getDay, parse } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { calculateAge } from "../common/DateTimeHelper";
import { ScheduleEditorWithSlots } from "../common/ScheduleEditorWithSlots";

import { addSubscription } from "../../services/apiSubscriptionService";
import { getAvailableTeachers, getWorkingPeriods } from "../../services/apiTeacherService";
import { AddStudentModal } from "../students/AddStudentModal";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

export class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      studentId: this.props.match.params.id,
      student: null,
      students: [],
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
      showAddStudentModal: false,
    };

    // AvailableTeachersModal
    this.showAvailableTeachersModal = this.showAvailableTeachersModal.bind(this);
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePeriodsChange = this.handlePeriodsChange.bind(this);
  }

  componentDidMount() {
    console.log("this.props");
    console.log(this.props);
    if (this.props.type === "Edit") return;

    let updatedAvailableTeachers = this.state.availableTeachers;

    if (this.props.location.state.teacher) {
      updatedAvailableTeachers.push(this.props.location.state.teacher);
    }
    
    const student = this.props.location.state.student;
    let students = [];
    if (student != null) students.push(student);

    this.setState({
      student: student || {},
      students: students,
      disciplineId: this.props.location.state.disciplineId || "",
      teacherId: this.props.location.state.teacher?.teacherId || "",
      availableTeachers: updatedAvailableTeachers || [],
    });
  }

  showAvailableTeachersModal = async (e) => {
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

  showAddStudentModal = async (e) => {
    e.preventDefault();

    this.setState({
      showAddStudentModal: true,
    });
  };

  handleAddStudent = (newStudent) => {
    this.setState((prevState) => ({
      students: [...prevState.students, newStudent],
    }));
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
  };

  handleCloseAddStudentModal = () => {
    this.setState({ showAddStudentModal: false });
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

  deleteStudent = (index) => {
    const updatedStudents = [...this.state.students];
    updatedStudents.splice(index, 1);
    this.setState({ students: updatedStudents });
  }

  render() {
    const {
      disciplineId,
      student,
      students,
      teacherId,
      availableSlots,
      attendanceCount,
      attendanceLength,
      startDate,
      availableTeachers,
      showAvailableTeacherModal,
      showAddStudentModal,
    } = this.state;

    let studentsList;
    console.log("students");
    console.log(students);
    if (students && students.length > 0) {
      studentsList = students.map((student, index) => (
        <tr id={index}>
          <td>
            <Container className="d-flex p-0">
              <div className="flex-grow-1">{`${student.firstName}`}</div>
              <div className="flex-shrink-1">
                <Button
                  variant="outline-danger"
                  style={{ fontSize: "10px", marginLeft: "10px", borderRadius: "25px" }}
                  onClick={() => this.deleteStudent(index)}
                >
                  X
                </Button>
              </div>
            </Container>
          </td>
        </tr>
      ));
    }
    return (
      <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 style={{ textAlign: "center" }}>Новый абонемент</h2>

            <Form>
              <Form.Group className="mb-3" controlId="discipline">
                <Form.Label>Для</Form.Label>
                <Table striped bordered hover>
                  <tbody>{studentsList}</tbody>
                </Table>
                <div className="text-center">
                  <Button size="sm" variant="outline-success" style={{ marginTop: "10px" }} onClick={this.showAddStudentModal}>
                    + Добавить ещё ученика
                  </Button>
                </div>
                <AddStudentModal show={showAddStudentModal} availableTeachers={availableTeachers} handleClose={this.handleCloseAddStudentModal} onAddStudent={this.handleAddStudent}/>
              </Form.Group>
              <hr></hr>
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

                <Button variant="outline-secondary" type="null" onClick={this.showAvailableTeachersModal}>
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
