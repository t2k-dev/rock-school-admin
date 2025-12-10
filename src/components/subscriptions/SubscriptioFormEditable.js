import { format, getDay } from "date-fns";
import React from "react";
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

import { ScheduleEditorNew } from "../common/ScheduleEditorNew";
import { getDisciplineName } from "../constants/disciplines";

import { getSubscriptionFormData, updateSubscriptionSchedules } from "../../services/apiSubscriptionService";
import { getWorkingPeriods } from "../../services/apiTeacherService";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

export class SubscriptionFormEditable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriptionId: this.props.match.params.id,
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
      subscriptionId: subscription.subscriptionId,
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
    
    let teachers = [];
    if (this.state.teacher) {
      // TODO: refactor for non array
      const response = await getWorkingPeriods(this.state.teacher.teacherId);
      teachers.push(response.data.teacher);
    } 

    this.setState({
      availableTeachers: teachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    if (!this.state.availableSlots || this.state.availableSlots.length === 0) {
      this.setState({ showAvailableTeacherModal: false, teacherId: "" , selectedTeachers: [] });
      return;
    }

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

  handlePeriodsChange = (periods) => {
    this.setState({ schedules: periods });
  };

  handleSave = async (e) => {
    e.preventDefault();
    
    const { subscriptionId, students, schedules } = this.state;
    const studentIds = students.map(student => student.studentId);

    const requestBody = {
      subscriptionId: subscriptionId,
      schedules: schedules,
    };

    await updateSubscriptionSchedules(subscriptionId, requestBody);
    
    const firstStudentId = studentIds[0];
    this.props.history.push(`/student/${firstStudentId}`);
  };

  render() {
    const {
      disciplineId,
      teacher,
      students,
      availableSlots,
      attendanceCount,
      attendanceLength,
      startDate,
      schedules,
      availableTeachers,
      showAvailableTeacherModal,
    } = this.state;

    if (!teacher){
        return <div>Загрузка...</div>;
    }

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
