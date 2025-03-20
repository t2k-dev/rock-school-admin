import React from "react";
import { Form, Container, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAvailablePeriods } from "../../services/apiTeacherService";
import { addSubscription } from "../../services/apiSubscriptionService";
import {CalendarWeek} from "../common/CalendarWeek";
import {AvailableTeachersModal} from "../teachers/AvailableTeachersModal";
import InputMask from "react-input-mask";
import SchedulePickerFixed from "../common/SchedulePickerFixed";

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
const events = [
  {
    title: "Занято",
    start: new Date(1900, 0, 2, 11, 0, 0, 0),
    end: new Date(1900, 0, 2, 12, 0, 0, 0),
  },
  {
    title: "Занято",
    start: new Date(1900, 0, 2, 14, 0, 0, 0),
    end: new Date(1900, 0, 2, 15, 0, 0, 0),
  },
  {
    title: "Занято",
    start: new Date(1900, 0, 4, 18, 0, 0, 0),
    end: new Date(1900, 0, 4, 19, 0, 0, 0),
  },
];

export class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentId: this.props.match.params.id,
      disciplineId: 0,
      teacherId: "",
      attendanceCount: "",
      attendanceLength: 0,
      backgroundEvents: backgroundEvents,
      events: events,
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
    const fakeAvailableTeachers = [
      {
        teacherId: "01958931-da30-780a-aadc-e99ae26bd87f",
        FirstName: "Агалая",
        LastName: "Епанчина",
        WorkingPeriods: backgroundEvents,
        Events: events,
      },
      {
        teacherId: "01956780-2dfd-745e-a5e9-b8e329f1f03a",
        FirstName: "Мария",
        LastName: "Калас",
        WorkingPeriods: backgroundEvents,
        Events: [],
      },
    ];

    const response = await getAvailablePeriods(this.state.disciplineId, this.state.studentId, 1);

    this.setState({
      teachers: response.data.teachers,
      availableTeachers: fakeAvailableTeachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
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

  handlePeriodsChange = (periods) => {
    this.setState({ workingPeriods: periods });
  };

  render() {
    const { disciplineId, teacherId, attendanceCount, events, attendanceLength, startDate, availableTeachers, showAvailableTeacherModal } = this.state;
    
    console.log('render');
    console.log('teacherId:'+teacherId);
    
    let selectedTeacherPeriods;
    if (teacherId) {
      const selectedTeacher = availableTeachers.filter((teacher) => teacher.teacherId === teacherId)[0];
      console.log(selectedTeacher);
      selectedTeacherPeriods = (
        <>
          <CalendarWeek backgroundEvents={selectedTeacher.WorkingPeriods} events ={events}/>
        </>
      );
    }

    return (
      <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
        <Row>
          <Col md="2"></Col>
          <Col md="6">
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
                  mask="9999-99-99"
                  maskChar=" "
                  onChange={this.handleChange}
                  value={startDate}
                  placeholder="введите дату..."
                />
              </Form.Group>

              <Form.Group className="mb-3 mt-4 text-center" controlId="GenerteSchedule">
                <Button variant="info" type="null" onClick={this.generateAvailablePeriods}>
                  Получить доступыне окна
                </Button>
                <AvailableTeachersModal
                  show={showAvailableTeacherModal}
                  availableTeachers={availableTeachers}
                  handleClose={this.handleCloseAvailableTeachersModal}
                />
              </Form.Group>

              <hr></hr>

              <Form.Group className="mb-3" controlId="Subscription">
                <Form.Label>Абонемент (кол-во занятий)</Form.Label>
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

              <Form.Group className="mb-3" controlId="Teacher">
                <Form.Label>Преподаватель</Form.Label>
                <Form.Select aria-label="Веберите..." value={teacherId} onChange={(e) => this.setState({ teacherId: e.target.value })}>
                  <option>выберите...</option>
                  {availableTeachers.map((teacher, index) => (
                    <option key={index} value={teacher.teacherId}>
                      {teacher.FirstName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {selectedTeacherPeriods}

              <Form.Group className="mb-3 mt-3" controlId="Schedule">
                <SchedulePickerFixed periods={this.state.schedules} handlePeriodsChange={this.handlePeriodsChange} />
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
