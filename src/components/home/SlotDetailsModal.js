import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { Badge, Button, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import { DisciplineIcon } from "../common/DisciplineIcon";

import { Avatar } from "../common/Avatar";
import { CalendarIcon } from "../icons/CalendarIcon";
import { DoorIcon } from "../icons/DoorIcon";
import { TimeIcon } from "../icons/TimeIcon";

import AttendanceStatus from "../constants/AttendanceStatus";
import { getAttendanceStatusName } from "../constants/attendancies";
import { getDisciplineName } from "../constants/disciplines";
import { getRoomName } from "../constants/rooms";

import { acceptTrial, declineTrial, missedTrial, submit, updateComment } from "../../services/apiAttendanceService";

export class SlotDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      trialStatus: 0,
      comment: "",
    };

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSlotDetails !== prevProps.selectedSlotDetails) {
      this.setState(
        { 
          status: this.props.selectedSlotDetails.status,
          attendanceId: this.props.selectedSlotDetails.attendanceId,
          comment: this.props.selectedSlotDetails.comment
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

  async handleSave() {
    const attendanceId = this.props.selectedSlotDetails?.attendanceId;

    // Completed attendance
    if (this.props.selectedSlotDetails.isCompleted){
      await updateComment(attendanceId, this.state.comment);
      this.props.handleClose();
      return;
    }

    // Not completed
    const submitRequest = {
      status: this.state.status,
      statusReason: this.props.selectedSlotDetails.statusReason,
    };

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

  handleDeclineTrial = async (e) =>{
    e.preventDefault();

    const request = {
        statusReason: this.state.statusReason,
        comment: this.state.comment,
    }

    const response = await declineTrial(this.props.selectedSlotDetails.attendanceId, request);

    this.props.handleClose();
  }

  handleMissedTrial = async (e) =>{
    e.preventDefault();

    const request = {
        statusReason: this.state.statusReason,
        comment: this.state.comment,
    }

    const response = await missedTrial(this.props.selectedSlotDetails.attendanceId, request);

    this.props.handleClose();
  }

  handleCompleted = async (e, status) =>{
    e.preventDefault();

    const attendanceId = this.props.selectedSlotDetails?.attendanceId;
    const submitRequest = {
      status: status,
      statusReason: this.props.selectedSlotDetails.statusReason,
      comment: this.state.comment,
    };

    await submit(attendanceId, submitRequest);

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

    
    const { attendanceId, teacher, student, isTrial, startDate, endDate, disciplineId, roomId, comment, isCompleted, status } = this.props.selectedSlotDetails;
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
                      <Link to={`/student/${student.studentId}`}>{student.firstName} {student.lastName}</Link>
                    </div>
                  </Container>
                  <Container>
                    <Container className="mt-1 text-center" style={{ fontSize: "14px" }}>
                      <div className="d-flex">
                        <div style={{ marginRight: "10px" }}>
                          <DisciplineIcon disciplineId={disciplineId} size="40px" />
                        </div>
                        <Stack direction="vertical" gap={0} className="mb-2 text-start">
                          <div style={{ fontWeight: "bold", fontSize: "16px" }}>{getDisciplineName(disciplineId)}</div>
                          <div>
                            <Link to={"/teacher/" + teacher.teacherId}>{teacher.firstName}</Link>
                          </div>
                          
                        </Stack>
                      </div>
                      <div className="text-start">
                        <div> <DoorIcon/> {getRoomName(roomId)}</div>
                        <div>
                          <CalendarIcon />
                          <span style={{ fontSize: "14px" }}>{format(startDate, "d MMMM, EEEE", { locale: ru })}</span>
                        </div>
                        <div>
                          <TimeIcon /> С {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                        </div>
                        
                        {!isCompleted &&
                          <Link
                            to={{
                              pathname: `/attendance/${attendanceId}/rescheduleForm`,
                              state: { attendance: this.props.selectedSlotDetails },
                            }}
                            style={{ width: "120px" }}
                          >
                            Перенести
                          </Link>
  }
                        </div>
                    </Container>
                  </Container>
                </div>
              </Row>
            </Container>
            <hr></hr>
            <Form.Group className="mb-3" controlId="comment">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control as="textarea" onChange={this.handleChange} value={comment} placeholder="введите..." autoComplete="off"/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            {!isCompleted ? 
              isTrial ? (
                <>
                  <Button onClick={this.handleMissedTrial} variant="outline-danger" type="null" >
                    Пропущено
                  </Button>
                  <Button onClick={this.handleDeclineTrial} variant="outline-secondary" type="null">
                    Отказаться
                  </Button>
                  <Button onClick={this.handleConfirmAndSubscribe} variant="outline-success" style={{ marginLeft: "10px" }}>
                    Оформить абонемент
                  </Button>
                </>
              )
              : (
                <>
                  <Button onClick={(e) =>this.handleCompleted(e, AttendanceStatus.ATTENDED)} variant="outline-success">
                    Посещено
                  </Button>
                  <Button onClick={(e) =>this.handleCompleted(e, AttendanceStatus.MISSED)} variant="outline-danger" type="null" style={{ marginLeft: "10px" }}>
                    Пропущено
                  </Button>
                </>
              )
              : (
                <Button variant="primary" onClick={this.handleSave}>
                  Сохранить
                </Button>
              )
            }
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
