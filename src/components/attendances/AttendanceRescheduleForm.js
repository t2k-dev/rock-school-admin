import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

import React from "react";
import { Button, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";

import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

import { getNextAvailableSlot, rescheduleAttendance } from "../../services/apiSubscriptionService";
import { getWorkingPeriods } from "../../services/apiTeacherService";

import { getSlotDescription } from "../common/attendanceHelper";
import { getDisciplineName } from "../constants/disciplines";

import { CalendarIcon } from "../icons/CalendarIcon";

export class AttendanceRescheduleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: 0,

      backgroundEvents: [],

      availableTeachers: [],
      availableSlots: [],
      showAvailableTeacherModal: false,
      selectedSlotId: 0,

      notificationDate: format(new Date(), "yyyy-MM-dd HH:mm"),
    };

    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { state } = this.props.location;
    if (state && state.attendance) {
      this.setState({ attendance: state.attendance });
    }
  }

  generateAvailablePeriods = async (e) => {
    e.preventDefault();

    let teachers;
    const response = await getWorkingPeriods(this.state.attendance.teacher.teacherId);
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

    const response = (await getNextAvailableSlot(this.state.attendance.subscriptionId)).data;
   
    const date = new Date(response.startDate);
    const roomId = response.roomId
    const slotId = uuidv4();
    const slot = {
      id: slotId,
      start: date,
      roomId: roomId,
    };

    this.setState({ availableSlots: [slot], selectedSlotId: slotId });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const selectedSlot = this.state.availableSlots.filter((s) => s.id === this.state.selectedSlotId)[0];

    const requestBody = {
      attendanceId: this.state.attendance.attendanceId,
      newStartDate: selectedSlot.start,
    };

    const response = await rescheduleAttendance(requestBody);

    window.history.back();
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  render() {
    const { attendance, lastName, showAvailableTeacherModal, availableTeachers, availableSlots, selectedSlotId, notificationDate, cancalationType } = this.state;
    if (!attendance) {
      return;
    }

    let availableSlotsList;
    if (availableSlots && availableSlots.length > 0) {
      availableSlotsList = availableSlots.map((item, index) => (
        <option key={index} value={item.id}>
          {getSlotDescription(item)}
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
              <div>
                <CalendarIcon />
                <span style={{ fontSize: "14px" }}>
                  {format(attendance.startDate, "d MMMM, EEEE", { locale: ru })}, с {format(attendance.startDate, "HH:mm")} -{" "}
                  {format(attendance.endDate, "HH:mm")}
                </span>
              </div>
              <div>Ученик: {attendance.student.firstName}</div>
              <div>Направление: {getDisciplineName(attendance.disciplineId)} ({attendance.teacher.firstName})</div>
            </Stack>
            <hr></hr>

            <Form>
              <Form.Group className="mb-3" controlId="cancalationType">
                <Form.Label>Тип</Form.Label>
                <Form.Select name="level" aria-label="Веберите..." value={cancalationType} onChange={(e) => this.setState({ cancalationType: e.target.value })}>
                  <option>выберите...</option>
                  <option value="0">Отмена ученика</option>
                  <option value="1">Отмена преподавателя</option>
                  <option value="2">Отмена школы</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="notificationDate">
                <Form.Label>Дата уведомления</Form.Label>
                <Form.Control onChange={this.handleChange} value={notificationDate} placeholder="введите..." autoComplete="off" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="comment">
                <Form.Label>Причина</Form.Label>
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
