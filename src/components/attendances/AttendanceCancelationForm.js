import React from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";

import { AvailableTeachersTrialModal } from "../teachers/AvailableTeachersTrialModal";

import { getAttendance } from "../../services/apiAttendanceService";
import { addTrialSubscription, getNextAvailableSlot } from "../../services/apiSubscriptionService";
import { getAvailableTeachers } from "../../services/apiTeacherService";
import { formatDate, formatTime } from "../common/DateTimeHelper";
import { getRoomName } from "../constants/rooms";

export class AttendanceCancelationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExistingStudent: false,

      firstName: "",
      lastName: "",
      age: "",
      level: 0,
      phone: "",
      branchId: 0,
      disciplineId: "",

      backgroundEvents: [],

      availableTeachers: [],
      availableSlots: [],
      showAvailableTeacherModal: false,
      fakeId: "",
      selectedSlotId: 0,
    };

    // AvailableTeachersModal
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    const id = this.props.match.params.id;
    const attendance = await getAttendance(id);

    this.setState({
        attendance: attendance
    });
  }

  generateAvailablePeriods = async (e) => {
    e.preventDefault();
    const response = await getAvailableTeachers(this.state.disciplineId, this.state.age, 1);
    this.setState({
      availableTeachers: response.data.availableTeachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
  };

  updateAvailableSlots = (availableSlots) => {
    this.setState({ availableSlots: availableSlots });
  };

  handleGetNextAvailableSlot = async (e) => {
    e.preventDefault();
    const data = (await getNextAvailableSlot(this.state.attendance.attendanceId)).data;

    const date = new Date(data.startDate)

    const dayName = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date);
    const slot = {
        startDate: data.startDate,
        description: `${dayName}, ${formatDate(date)} в ${formatTime(date)} - ${getRoomName(data.roomId)}`,
    }

    this.setState({availableSlots: [slot], selectedSlotId: 1})
  };

  handleSave = async (e) => {
    e.preventDefault();

    const selectedSlot = this.state.availableSlots.filter((s) => s.id === this.state.selectedSlotId)[0];
    console.log("selectedSlot2");
    console.log(selectedSlot);
    const requestBody = {
      disciplineId: this.state.disciplineId,
      branchId: 1, // DEV: map after clarification
      teacherId: selectedSlot.teacherId,
      trialDate: selectedSlot.start,
      roomId: selectedSlot.roomId,
      student: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        age: this.state.age,
        phone: this.state.phone.replace("+7 ", "").replace(/\s/g, ""),
        level: this.state.level,
      },
    };

    const response = await addTrialSubscription(requestBody);
    const newStudentId = response.data;

    this.props.history.push(`/studentScreen/${newStudentId}`);
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  render() {
    const { lastName, showAvailableTeacherModal, availableTeachers, availableSlots, selectedSlotId, level } = this.state;

    let availableSlotsList;
    if (availableSlots && availableSlots.length > 0) {
      availableSlotsList = availableSlots.map((item, index) => (
        <option key={index} value={item.id}>
          {item.description}
        </option>
      ));
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="text-center mb-4">Перенос занятия</h2>
            <Stack className="mb-3" gap={2}>
              <div>Дата: 2025-05-05</div>
              <div>Направление: Вокал</div>
              <div>Преподаватель: Варавара</div>
            </Stack>
            <hr></hr>

            <Form>
              <Form.Group className="mb-3" controlId="cancalationType">
                <Form.Label>Причина</Form.Label>
                <Form.Select name="level" aria-label="Веберите..." value={level} onChange={(e) => this.setState({ level: e.target.value })}>
                  <option>выберите...</option>
                  <option value="0">Отмена ученика</option>
                  <option value="1">Отмена преподавателя</option>
                  <option value="2">Отмена школы</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="comment">
                <Form.Label>Дата уведомления</Form.Label>
                <Form.Control onChange={this.handleChange} value={lastName} placeholder="введите..." autoComplete="off" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="comment">
                <Form.Label>Комментарий</Form.Label>
                <Form.Control onChange={this.handleChange} value={lastName} placeholder="введите..." autoComplete="off" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="comment">
                <div className="mb-2">Окно для занятия</div>
                <div className="mb-3">
                  <Button
                    variant="outline-secondary"
                    type="null"
                    onClick={(e) => this.handleGetNextAvailableSlot(e)}
                    disabled={false}
                    style={{ marginRight: "10px" }}
                  >
                    Следующее окно по расписанию
                  </Button>

                  <Button variant="outline-secondary" type="null" onClick={(e) => this.generateAvailablePeriods(e)} disabled={false}>
                    Доступыне окна...
                  </Button>
                </div>

                <AvailableTeachersTrialModal
                  show={showAvailableTeacherModal}
                  availableTeachers={availableTeachers}
                  updateAvailableSlots={this.updateAvailableSlots}
                  handleClose={this.handleCloseAvailableTeachersModal}
                />
                <Form.Select aria-label="Веберите..." value={selectedSlotId} onChange={(e) => this.setState({ selectedSlotId: e.target.value })}>
                  <option>выберите...</option>
                  {availableSlotsList}
                </Form.Select>
              </Form.Group>
              <hr></hr>
              <div className="text-center">
                <Button variant="success" type="null" onClick={this.handleSave}>
                  Перенести
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
