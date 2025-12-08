import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { Badge, Button, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import { DisciplineIcon } from "../common/DisciplineIcon";

import { Avatar } from "../common/Avatar";
import { CalendarIcon } from "../icons/CalendarIcon";
import { TimeIcon } from "../icons/TimeIcon";

import AttendanceStatus from "../constants/AttendanceStatus";
import { getAttendanceStatusName } from "../constants/attendancies";
import { getDisciplineName } from "../constants/disciplines";
import { getRoomName } from "../constants/rooms";

import { acceptTrial, declineTrial, missedTrial, submit } from "../../services/apiAttendanceService";

export class SlotDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
      status: 0,
      trialStatus: 0,
      comment: "",
    };

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSlotDetails !== prevProps.selectedSlotDetails) {
      this.setState(
        { 
          status: this.props.selectedSlotDetails.status,
          attendanceId: this.props.selectedSlotDetails.attendanceId
         }
      );
    }
  }

  handleStatusChange(status) {
    this.setState({ status: status });
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleClose() {
    this.setState({ show: false });
  }

  async handleSave() {
    const submitRequest = {
      status: this.state.status,
      statusReason: this.props.selectedSlotDetails.statusReason,
    };
    const attendanceId = this.props.selectedSlotDetails?.attendanceId;

    await submit(attendanceId, submitRequest);

    this.props.handleClose();
  }

  handleConfirmAndSubscribe = async (e) => {
      e.preventDefault();
  
      const request = {
          statusReason: this.state.statusReason,
          comment: this.state.comment,
      }

      // Accept
      const response = await acceptTrial(this.props.selectedSlotDetails.attendanceId, request);
console.log('acceptTrial response', response);
      // Redirect
      this.props.history.push({
        pathname: `/student/${this.props.selectedSlotDetails.student.studentId}/subscriptionForm`,
        state: {
          studentId: this.props.selectedSlotDetails.student.studentId,
          disciplineId: this.props.selectedSlotDetails.disciplineId,
          teacher: {
            teacherId: this.props.selectedSlotDetails.teacher.teacherId,
            firstName: this.props.selectedSlotDetails.teacher.firstName
          }
        }
      });
      
      this.props.handleClose();
    };

  handleDecline = async (e) =>{
    e.preventDefault();

    const request = {
        statusReason: this.state.statusReason,
        comment: this.state.comment,
    }

    const response = await declineTrial(this.props.selectedSlotDetails.attendanceId, request);

    this.props.handleClose();
  }

  handleMissed = async (e) =>{
    e.preventDefault();

    const request = {
        statusReason: this.state.statusReason,
        comment: this.state.comment,
    }

    const response = await missedTrial(this.props.selectedSlotDetails.attendanceId, request);

    this.props.handleClose();
  }

  getStatusBadgeVariant = (status) => {
    switch (status) {
      case AttendanceStatus.ATTENDED:
        return "success";
      case AttendanceStatus.MISSED:
        return "danger";
      case AttendanceStatus.CANCELED_BY_ADMIN:
      case AttendanceStatus.CANCELED_BY_TEACHER:
      case AttendanceStatus.CANCELED_BY_STUDENT:
        return "default";
      default:
        return "secondary";
    }
  };
  

  render() {
    
    if (!this.props.show) {
      return null;
    }

    const { status } = this.state;
    const { attendanceId, teacher, student, isTrial, startDate, endDate, disciplineId, roomId, statusReason } = this.props.selectedSlotDetails;
console.log('render SlotDetailsModal')
console.log(this.props.selectedSlotDetails)
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose} size="md">
          <Modal.Header closeButton>
            <Modal.Title>
              {isTrial ? "Пробное занятие" : "Занятие"}
              <span style={{ marginLeft: "10px", fontSize: "16px" }}>
                <Badge pill bg={this.getStatusBadgeVariant(status)}>{getAttendanceStatusName(status)}</Badge>
              </span>
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
                        <div>
                          <CalendarIcon />
                          <span style={{ fontSize: "14px" }}>{format(startDate, "d MMMM, EEEE", { locale: ru })}</span>
                        </div>
                        <div>
                          <TimeIcon /> С {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                        </div>
                          <Link
                            to={{
                              pathname: `/attendance/${attendanceId}/rescheduleForm`,
                              state: { attendance: this.props.selectedSlotDetails },
                            }}
                            style={{ width: "120px" }}
                          >
                            Перенести
                        </Link>
                      </div>
                    </Container>
                  </Container>
                </div>
              </Row>
            </Container>
            <hr></hr>

            {this.props.selectedSlotDetails.status === AttendanceStatus.NEW && !isTrial &&(
              <div className="text-center mt-5 mb-5">
                <Button
                  onClick={() => this.handleStatusChange(AttendanceStatus.ATTENDED)}
                  variant={status === AttendanceStatus.ATTENDED ? "success" : "outline-success"}
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Посещено
                </Button>
                <Button
                  onClick={() => this.handleStatusChange(AttendanceStatus.MISSED)}
                  variant={status === AttendanceStatus.MISSED ? "danger" : "outline-danger"}
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Пропуск
                </Button>
              </div>
            )}
            <Form.Group className="mb-3" controlId="comment">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control as="textarea" onChange={this.handleChange} value={statusReason} placeholder="введите..." autoComplete="off"/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {isTrial && (
              <>
                <Button variant="outline-danger" type="null" onClick={this.handleMissed}>
                  Пропущено
                </Button>
                <Button variant="outline-secondary" type="null" onClick={this.handleDecline}>
                  Отказаться
                </Button>
                <Button onClick={this.handleConfirmAndSubscribe} variant="outline-success" style={{ marginLeft: "10px" }}>
                  Оформить абонемент
                </Button>
              </>
            )}
            {isTrial === false && (
              <>
                <Button onClick={this.handleSave} variant="primary">
                  Сохранить
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
