import React from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getAttendanceTypeName } from "../../../constants/AttendanceType";
import { getDisciplineName } from "../../../constants/disciplines";
import { Avatar } from "../Avatar";
import { DisciplineIcon } from "../discipline/DisciplineIcon";
import { AttendanceDateAndRoom } from "./AttendanceDateAndRoom";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

import { submitGroup } from "../../../services/apiAttendanceService";

export class GroupAttendanceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,

      status: 0,
      comment: "",
      attendance: null,
      childAttendances: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this); 
  }

  componentDidUpdate(prevProps) {
    if (this.props.attendance && this.props.attendance !== prevProps.attendance) {
      const attendance = this.props.attendance;
      
      if (!attendance) {
        return;
      }

      this.setState({ 
        attendance: attendance,
        status: attendance.status,
        comment: attendance.comment || "",
      });
    }

    if (this.props.attendance?.childAttendances !== prevProps.attendance?.childAttendances) {
      this.setState({ 
        childAttendances: this.props.attendance?.childAttendances || []
      });
    }
  }

  handleClose() {
    this.setState({ show: false, attendance: null, childAttendances: [], comment: "" });
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ 
      comment: value
    });
  };

  async handleStatusChange(attendanceId, status) {
    if (!this.state.childAttendances){
      console.warn('childAttendances is not an array:', this.state.childAttendances);
      return;
    }
    
    const updatedChildAttendances = this.state.childAttendances.map((child) => {
      if (child.attendanceId === attendanceId) {
        return { ...child, status: status, isCompleted: true };
      }
      return child;
    });

    this.setState({ childAttendances: updatedChildAttendances });
  }

  handleAttendeeStatusChange = (attendeeId, status) => {
    // This will be used for the new card-based UI
    // You may need to call an API to update the attendee status
    console.log(`Updating attendee ${attendeeId} to status ${status}`);
    // TODO: Implement API call to update attendee status
  }

  async handleSave() {
   const request = {
      childAttendances: this.state.childAttendances,
      comment: this.props.attendance.statusReason,
    };

    await submitGroup(request);

    this.props.handleClose();
  }

  renderStudentList() {
    const { attendance } = this.props;
    
    if (!attendance || !attendance.attendees || attendance.attendees.length === 0) {
      return <p className="text-muted text-center">Нет учеников</p>;
    }

    return (
      <Row className="g-3">
        {attendance.attendees.map((attendee) => (
          <Col xs={12} key={attendee.attendeeId}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Avatar style={{ width: "40px", height: "40px", marginRight: "12px" }} />
                    <div>
                      <h6 className="mb-0">
                        <Link to={`/student/${attendee.studentId}`}>
                          {attendee.student.firstName} {attendee.student.lastName}
                        </Link>
                      </h6>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => this.handleAttendeeStatusChange(attendee.attendeeId, 3)}
                    >
                      Пропущено
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => this.handleAttendeeStatusChange(attendee.attendeeId, 2)}
                    >
                      Посещено
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  render() {
    if (!this.props.show || !this.props.attendance) {
      return null;
    }

    const { teacher, disciplineId, status, attendanceType } = this.props.attendance;
    const { comment } = this.state;

    return (
        <Modal show={this.props.show} onHide={this.props.handleClose} size="md" backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>
              <span style={{ marginRight: "10px" }}>{getAttendanceTypeName(attendanceType)}</span>
              <AttendanceStatusBadge 
                status={status}
                style={{ fontSize: "14px" }}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mt-2 text-center" style={{ fontSize: "14px" }}>
              <Row>
                <Col size="6">
                  <div className="d-flex mb-3">
                    <div style={{ marginTop: "10px" }}>
                      <DisciplineIcon disciplineId={disciplineId} size="40px" />
                    </div>
                    <Stack direction="vertical" gap={0} className="mb-2 text-center">
                      <div style={{ fontWeight: "bold", fontSize: "18px" }}>{getDisciplineName(disciplineId)}</div>
                      <div>
                        <Link to={"/teacher/" + teacher.teacherId}>{teacher.firstName}</Link>
                      </div>
                    </Stack>
                  </div>
                </Col>
                <Col size="6" className="text-end">
                  <AttendanceDateAndRoom 
                    {...this.props.attendance}
                    attendance={this.props.attendance}
                    className="text-center"
                  />
                </Col>
              </Row>
            </Container>

            <hr></hr>

            {this.renderStudentList()}
            <hr></hr>
            <Form.Group className="mb-3 mt-3" controlId="comment">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control as="textarea" onChange={this.handleChange} value={comment} placeholder="введите..." autoComplete="off"/>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSave}>
              Сохранить
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
}
