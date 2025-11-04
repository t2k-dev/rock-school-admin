import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { Button, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import { DisciplineIcon } from "../common/DisciplineIcon";

import { Avatar } from "../common/Avatar";
import { CalendarIcon } from "../icons/CalendarIcon";
import { TimeIcon } from "../icons/TimeIcon";

import AttendanceStatus from "../constants/AttendanceStatus";
import { getAttendanceStatusName } from "../constants/attendancies";
import { getDisciplineName } from "../constants/disciplines";
import { getRoomName } from "../constants/rooms";

import { updateStatus } from "../../services/apiAttendanceService";

export class GroupSlotDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,

      status: 0,
      trialStatus: 0,
      comment: "",
      availableTeachers: [],
      availableSlots: [],
      availableSlotsText: "",
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.getAvailableSlots = this.getAvailableSlots.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSlotDetails?.status !== prevProps.selectedSlotDetails?.status) {
      this.setState({ status: this.props.selectedSlotDetails.status });
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  async handleStatusChange(status) {
    const response = await updateStatus(this.props.selectedSlotDetails.attendanceId, status);
  }

  getAvailableSlots() {
    let result = "";
    this.state.availableSlots.forEach((element) => {
      result = result + element.description + "\n";
    });
    this.setState({ availableSlotsText: result });
  }

  render() {
    const { status } = this.state;

    if (!this.props.selectedSlotDetails) {
      return <></>;
    }
    const { teacher, student, startDate, endDate, disciplineId, roomId, statusReason, comment } = this.props.selectedSlotDetails;

    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose} size="md">
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.selectedSlotDetails.isTrial ? "Пробное занятие" : "Занятие"} ({getAttendanceStatusName(status)})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mb-3">
              <Row>
                <div className="d-flex" style={{ padding: "0 50px" }}>
                  <Container style={{ width: "100px", padding: "0" }}>
                    <Avatar style={{ width: "100px", height: "100px" }} />
                    <div className="text-center mt-1">
                      <Link to={`/student/${student.studentId}`}>{student.firstName}</Link>
                    </div>
                  </Container>
                  <Container>
                    <Container className="mt-2 text-center" style={{ fontSize: "14px" }}>
                      <div className="d-flex">
                        <div style={{ marginTop: "10px" }}>
                          <DisciplineIcon disciplineId={disciplineId} size="60px" />
                        </div>
                        <Stack direction="vertical" gap={0} className="mb-2 text-center">
                          <div style={{ fontWeight: "bold", fontSize: "18px" }}>{getDisciplineName(disciplineId)}</div>
                          <div>
                            <Link to={"/teacher/" + teacher.teacherId}>{teacher.firstName}</Link>
                          </div>
                          <div>{getRoomName(roomId)} комната</div>
                        </Stack>
                      </div>
                      <div>
                        <CalendarIcon />
                        <span style={{ fontSize: "14px" }}>{format(startDate, "d MMMM, EEEE", { locale: ru })}</span>
                      </div>
                      <div>
                        <TimeIcon /> С {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                      </div>
                    </Container>
                    <Link to={`/student/${this.props.selectedSlotDetails.studentId}`}>
                      <h3>
                        {this.props.selectedSlotDetails.firstName} {this.props.selectedSlotDetails.lastName}
                      </h3>
                    </Link>
                  </Container>
                </div>
              </Row>
            </Container>
            <hr></hr>

            {this.props.selectedSlotDetails.status === AttendanceStatus.NEW && (
              <div className="text-center mt-5 mb-5">
                <Button
                  as={Link}
                  to={{
                    pathname: `/attendance/${this.props.selectedSlotDetails.attendanceId}/attendedForm`,
                    state: { attendance: this.props.selectedSlotDetails },
                  }}
                  variant={"outline-primary"}
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Посещено
                </Button>
                <Button
                  as={Link}
                  to={{
                    pathname: `/attendance/${this.props.selectedSlotDetails.attendanceId}/cancelationForm`,
                    state: { attendance: this.props.selectedSlotDetails },
                  }}
                  variant={"outline-danger"}
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Пропуск
                </Button>
                <Button
                  as={Link}
                  to={{
                    pathname: `/attendance/${this.props.selectedSlotDetails.attendanceId}/rescheduleForm`,
                    state: { attendance: this.props.selectedSlotDetails },
                  }}
                  variant={"outline-secondary"}
                  style={{ width: "120px" }}
                >
                  Перенести
                </Button>
              </div>
            )}

            {this.props.selectedSlotDetails.status !== AttendanceStatus.NEW && (
              <Form.Group className="mb-3" controlId="comment">
                <Form.Label>Комментарий</Form.Label>
                <Form.Control as="textarea" onChange={this.handleChange} value={statusReason} placeholder="введите..." autoComplete="off" disabled="true"/>
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
