import { format, getDay, parse } from "date-fns";
import React from "react";
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

import { calculateAge } from "../common/DateTimeHelper";
import { ScheduleEditorNew } from "../common/ScheduleEditorNew";
import { getDisciplineName } from "../constants/disciplines";

import { addSubscription, getSubscriptionFormData } from "../../services/apiSubscriptionService";
import { getAvailableTeachers, getWorkingPeriods } from "../../services/apiTeacherService";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

export class SubscriptionFormEditable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      studentId: this.props.match.params.id,
      student: null,
      students: [],
      disciplineId: 0,
      teacherId: "",
      selectedTeachers: [],
      startDate: "",
      attendanceCount: "",
      attendanceLength: 0,
      generatedSchedule: "",
      availableTeachers: [],
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
    this.onFormLoad();
  }

  async onFormLoad() {
    const id = this.props.match.params.id;
    
    const formData = await getSubscriptionFormData(id);
    
    const subscription = formData.subscription || {};
    
    this.setState({
      students: formData.students,
      disciplineId: subscription.disciplineId || "",
      teacher: formData.teacher || {},
      startDate: subscription.startDate ? format(new Date(subscription.startDate), "dd.MM.yyyy") : "",
      attendanceCount: subscription.attendanceCount || "",
      attendanceLength: subscription.attendanceLength || 0,
      schedules: subscription.schedules || [],
      });
  }

  // AvailableTeachersModal
  showAvailableTeachersModal = async (e) => {
    e.preventDefault();
    
    let teachers;
    if (this.state.teacher) {
      // TODO: refactor for non array
      const response = await getWorkingPeriods(this.state.teacher.teacherId);
      teachers = response.data.availableTeachers;
    } else {
      // TODO: branchId
      const sortedStudents = this.sortStudentsByBirthDate(this.state.students);
      const age = calculateAge(sortedStudents[0].birthDate);

      const response = await getAvailableTeachers(this.state.disciplineId, age, 1);
      teachers = response.data.availableTeachers;
    }

    this.setState({
      availableTeachers: teachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    const selectedTeacherIds = Array.from(new Set(this.state.availableSlots.map(slot => slot.teacherId)));
    const selectedTeachers = this.state.availableTeachers.filter(teacher => selectedTeacherIds.includes(teacher.teacherId)); 
    const newSelectedTeacherId = selectedTeachers.length > 0 && selectedTeachers[0].teacherId;

    this.setState({ showAvailableTeacherModal: false, teacherId: newSelectedTeacherId , selectedTeachers: selectedTeachers });
  };

  updateAvailableSlots = (availableSlots) => {
    let periods = [];
    availableSlots.forEach((slot) => {
      const newPeriod = {
        weekDay: getDay(slot.start),
        startTime: format(slot.start, "HH:mm"),
        endTime: format(slot.end, "HH:mm"),
        roomId: slot.roomId,
        teacherId: slot.teacherId,
      };
      periods.push(newPeriod);
    });

    this.setState({ availableSlots: availableSlots, schedules: periods });
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handlePeriodsChange = (periods) => {
    this.setState({ schedules: periods });
  };

  sortStudentsByBirthDate = (students) => {
    return students.sort((a, b) => {
      if (!a.birthDate || !b.birthDate) return 0;
      return new Date(b.birthDate) - new Date(a.birthDate);
    });
  };

  deleteStudent = (index) => {
    const updatedStudents = [...this.state.students];
    updatedStudents.splice(index, 1);
    this.setState({ students: updatedStudents });
  }

  handleSave = async (e) => {
    e.preventDefault();

    const startDate = parse(this.state.startDate, "dd.MM.yyyy", new Date());

    let studentIds = [];
    this.state.students.forEach((student) => {
      studentIds.push(student.studentId);
    });

    const requestBody = {
      studentIds: studentIds,
      subscription: {
        disciplineId: this.state.disciplineId,
        teacherId: this.state.teacherId,
        attendanceCount: this.state.attendanceCount,
        attendanceLength: this.state.attendanceLength,
        startDate: format(startDate, "yyyy.MM.dd"),
        branchId: 1,
      },
      schedules: this.state.schedules,
    };

    await addSubscription(requestBody);

    this.props.history.push(`/student/${this.state.studentId}`);
  };

  render() {
    const {
      disciplineId,
      teacher,
      students,
      teacherId,
      availableSlots,
      attendanceCount,
      attendanceLength,
      startDate,
      schedules,
      availableTeachers,
      showAvailableTeacherModal,
    } = this.state;

    if (!teacher){
        return <div>Loading...</div>;
    }

    console.log("this.state");
    console.log(this.state);

    let studentsList;
    if (students && students.length > 0) {
      studentsList = students.map((student, index) => (
        <tr key={index}>
          <td>
            <Container className="d-flex p-0">
              <div className="flex-grow-1">{`${student.firstName} ${student.lastName}`}</div>
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
            <h2 className="mb-4 text-center">Редактировать абонемент</h2>

            <Form>
              <Form.Group className="mb-3" controlId="discipline">
                <Form.Label>Ученик(и)</Form.Label>
                <Table striped bordered>
                  <tbody>{studentsList}</tbody>
                </Table>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="discipline">
                <Form.Label>Направление: {getDisciplineName(disciplineId)}</Form.Label>
              </Form.Group>

              <Form.Group className="mb-3" controlId="StartDate">
                <Form.Label>Дата начала: {startDate}</Form.Label>
              </Form.Group>

              <Form.Group className="mb-3" controlId="Subscription">
                <Form.Label>Количество занятий: {attendanceCount}</Form.Label>
              </Form.Group>

              <Form.Group className="mb-3" controlId="AttendanceLength">
                <Form.Label>Длительность урока: {attendanceLength}</Form.Label>
              </Form.Group>
              <b>Преподаватель</b>
              <Form.Group className="mb-3" controlId="Teacher">
                
              </Form.Group>
              <InputGroup className="mb-3 text-center" controlId="GenerteSchedule">
                <Form.Label>{teacher.firstName} {teacher.lastName}</Form.Label>
              </InputGroup>
                <Button variant="outline-secondary" type="null" onClick={this.showAvailableTeachersModal}>
                  Доступные окна...
                </Button>

              <AvailableTeachersModal
                show={showAvailableTeacherModal}
                availableTeachers={availableTeachers}
                updateAvailableSlots={this.updateAvailableSlots}
                handleClose={this.handleCloseAvailableTeachersModal}
              />

              <Form.Group className="mb-3" controlId="Teacher"></Form.Group>
              <hr></hr>
              <Form.Group className="mb-3 mt-3" controlId="Schedule">
                <ScheduleEditorNew
                  periods={schedules}
                  availableSlots={availableSlots}
                  handlePeriodsChange={this.handlePeriodsChange}
                  attendanceLength={attendanceLength}
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
