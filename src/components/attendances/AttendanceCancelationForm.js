import React from "react";
import { Button, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";

import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

import { getAttendance } from "../../services/apiAttendanceService";
import { getNextAvailableSlot, rescheduleAttendance } from "../../services/apiSubscriptionService";
import { getWorkingPeriods } from "../../services/apiTeacherService";
import { formatDate, formatTime } from "../common/DateTimeHelper";
import { getSlotDescription } from "../common/attendanceHelper";
import { getRoomName } from "../constants/rooms";

export class AttendanceCancelationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExistingStudent: false,

      branchId: 0,
      disciplineId: "",

      backgroundEvents: [],

      availableTeachers: [],
      availableSlots: [],
      showAvailableTeacherModal: false,
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
      attendance: attendance,
    });
  }

  generateAvailablePeriods = async (e) => {
    e.preventDefault();

    let teachers;
    const response = await getWorkingPeriods(this.state.attendance.teacherId);
    teachers = response.data.availableTeachers;

    this.setState({
      availableTeachers: teachers,
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

    const data = (await getNextAvailableSlot(this.state.attendance.subscriptionId)).data;

    const date = new Date(data.startDate);

    const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(date);
    const slot = {
      startDate: data.startDate,
      description: `${dayName}, ${formatDate(date)} в ${formatTime(date)} - ${getRoomName(data.roomId)}`,
    };

    this.setState({ availableSlots: [slot], selectedSlotId: 1 });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const selectedSlot = this.state.availableSlots.filter((s) => s.id === this.state.selectedSlotId)[0];

    const requestBody = {
      attendanceId: this.state.attendance.attendanceId,
      newStartDate: selectedSlot.start,
    };

    const response = await rescheduleAttendance(requestBody);

    this.props.history.push(`/studentScreen/${this.state.attendance.studentId}`);
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  render() {
    const { attendance, lastName, showAvailableTeacherModal, availableTeachers, availableSlots, selectedSlotId, level } = this.state;
    if (!attendance) {
      return;
    }

    let availableSlotsList;
    if (availableSlots && availableSlots.length > 0) {
      availableSlotsList = availableSlots.map((item, index) => (
        <option key={index} value={item.id}>
          { getSlotDescription(item.teacherFullName, item.start)}
        </option>
      ));
    }

    let availableSlotsSelection = attendance.isTrial ? (
      <Form.Group className="mb-3" controlId="comment">
        <div className="mb-2">Окно для занятия</div>
        <InputGroup className="mb-3 mt-2 text-center" controlId="GenerteSchedule">
          <Form.Select
            aria-label="Веберите..."
            value={selectedSlotId}
            onChange={(e) => this.setState({ selectedSlotId: e.target.value })}
            style={{ width: "200px" }}
          >
            <option>выберите...</option>
            {availableSlotsList}
          </Form.Select>

          <Button variant="outline-secondary" type="null" onClick={(e) => this.generateAvailablePeriods(e)} disabled={false}>
            Доступыне окна...
          </Button>
        </InputGroup>
      </Form.Group>
    ) : (
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

        <Form.Select aria-label="Веберите..." value={selectedSlotId} onChange={(e) => this.setState({ selectedSlotId: e.target.value })}>
          <option>выберите...</option>
          {availableSlotsList}
        </Form.Select>
      </Form.Group>
    );

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="text-center mb-4">{attendance?.isTrial ? "Перенос пробного занятия" : "Перенос занятия"}</h2>
            <Stack className="mb-3" gap={2} style={{ backgroundColor: "#e7e7e7", padding: "15px", borderRadius: "10px" }}>
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
              {availableSlotsSelection}

              <AvailableTeachersModal
                show={showAvailableTeacherModal}
                availableTeachers={availableTeachers}
                updateAvailableSlots={this.updateAvailableSlots}
                handleClose={this.handleCloseAvailableTeachersModal}
              />
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
