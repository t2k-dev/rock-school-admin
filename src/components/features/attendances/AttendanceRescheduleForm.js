import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

import React from "react";
import { Button, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";

import { Avatar } from "../../shared/Avatar";
import { AvailableTeachersModal } from "../../shared/modals/AvailableTeachersModal";

import { getNextAvailableSlot, rescheduleAttendance } from "../../../services/apiSubscriptionService";
import { getWorkingPeriods } from "../../../services/apiTeacherService";

import { getDisciplineName } from "../../../constants/disciplines";
import { getSlotDescription } from "../../shared/modals/attendanceHelper";

import { DisciplineIcon } from "../../shared/discipline/DisciplineIcon";
import { CalendarIcon } from "../../shared/icons";

export class AttendanceRescheduleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: 0,

      backgroundEvents: [],

      availableTeachers: [],
      showAvailableTeacherModal: false,
      selectedSlotId: 0,
      selectedSlot: null,

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

  showAvailableSlotsModal = async (e) => {
    e.preventDefault();
    
    const { teacher } = this.state.attendance;

    const response = await getWorkingPeriods(teacher.teacherId);
    const teachers = response.data?.teacher ? [response.data.teacher] : [];

    this.setState({
      availableTeachers: teachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
  };

  handleSlotsChange = (availableSlots) => {
    const selectedSlot = availableSlots.length > 0 ? availableSlots[0] : null;
    this.setState({ selectedSlot: selectedSlot });
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

    this.setState({ selectedSlot: slot });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const { selectedSlot, attendance } = this.state;

    const requestBody = {
      attendanceId: attendance.attendanceId,
      newStartDate: selectedSlot.start,
    };

    const response = await rescheduleAttendance(requestBody);

    window.history.back();
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  renderTeacherSection = () => {
    const { teacher } = this.state.attendance;
    
    return (
      <div className="mb-4">
          <InputGroup className="mb-3 d-flex">
            <Form.Label className="flex-grow-1">{teacher.firstName} {teacher.lastName}</Form.Label>
            <Button 
              variant="outline-secondary" 
              onClick={this.showAvailableSlotsModal}
            >
              Доступные окна...
            </Button>
            <Button
              title="Следующее по расписанию"
              variant="outline-secondary"
              type="null"
              size="sm"
              onClick={(e) => this.handleGetNextAvailableSlot(e)}
              disabled={false}
            >
              {">>"}
            </Button>
          </InputGroup>
      </div>
    );
  };

  render() {
    const { attendance, lastName, showAvailableTeacherModal, availableTeachers, selectedSlot, notificationDate, cancalationType } = this.state;
    if (!attendance) {
      return;
    }

    let availableSlot;
    if (selectedSlot) {
      availableSlot = <>{getSlotDescription(selectedSlot)}</>;
    } else{
      availableSlot = <div>Не выбрано</div>;
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="text-center mb-4">{attendance?.isTrial ? "Перенос пробного занятия" : "Перенос занятия"}</h2>
            <Stack className="mb-3" gap={2} style={{ backgroundColor: "#e7e7e7", padding: "15px", borderRadius: "10px" }}>
              <div><Avatar style={{ width: "20px", height: "20px", marginRight: "5px" }}></Avatar> {attendance.student.firstName} {attendance.student.lastName}</div>
              <div>
                <CalendarIcon />
                <span style={{ fontSize: "14px" }}>
                  {format(attendance.startDate, "d MMMM, EEEE", { locale: ru })}, с {format(attendance.startDate, "HH:mm")} -{" "}
                  {format(attendance.endDate, "HH:mm")}
                </span>
              </div>
              <div><DisciplineIcon size="20" style={{marginRight: "5px"}} disciplineId={attendance.disciplineId} /> {getDisciplineName(attendance.disciplineId)}</div>
            </Stack>
            <hr></hr>

            <Form>
              <Form.Group className="mb-3" controlId="cancalationType">
                <Form.Label>Кто переносит</Form.Label>
                <Form.Select name="level" aria-label="Веберите..." value={cancalationType} onChange={(e) => this.setState({ cancalationType: e.target.value })}>
                  <option>выберите...</option>
                  <option value="0">Ученик</option>
                  <option value="1">Преподаватель</option>
                  <option value="2">Администрация</option>
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

              <div className="mb-3"><b>Преподаватель</b></div>
              <Form.Group className="mb-3" >
                {this.renderTeacherSection()}
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="comment">
                <div className="mb-3">
                  <b>Новая дата занятия</b>
                </div>
                {availableSlot}
              </Form.Group>

              <AvailableTeachersModal
                show={showAvailableTeacherModal}
                singleSelection={true}
                teachers={availableTeachers}
                onSlotsChange={this.handleSlotsChange}
                onClose={this.handleCloseAvailableTeachersModal}
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
