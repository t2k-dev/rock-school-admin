import React from "react";
import { Button, Container, Form, Modal, Row, Stack, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getDisciplineName } from "../../../constants/disciplines";
import { DisciplineIcon } from "../../common/DisciplineIcon";
import { AttendanceDateAndRoom } from "./AttendanceDateAndRoom";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import ChildAttendanceRow from "./ChildAttendanceRow";
import ChildAttendanceRowReadonly from "./ChildAttendanceRowReadonly";

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

  async handleSave() {
   const request = {
      childAttendances: this.state.childAttendances,
      comment: this.props.attendance.statusReason,
    };

    await submitGroup(request);

    this.props.handleClose();
  }

  renderStudentList() {
    const { childAttendances } = this.state;

    return (
      <Table striped bordered hover>
        <tbody>
          {childAttendances.map((attendance) => (
            attendance.isCompleted 
            ? 
              <ChildAttendanceRowReadonly 
                key={attendance.attendanceId}
                attendance={attendance} 
              />
            : 
              <ChildAttendanceRow
                key={attendance.attendanceId}
                attendance={attendance}
                onStatusChange={this.handleStatusChange}
                disabled={this.state.isSaving}
              />
          ))}
        </tbody>
      </Table>)
  }

  render() {
    if (!this.props.show || !this.props.attendance) {
      return null;
    }

    const { teacher, disciplineId } = this.props.attendance;
    const { status, comment } = this.state;

    return (
        <Modal show={this.props.show} onHide={this.props.handleClose} size="md" backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>
              <span style={{ marginRight: "10px" }}>Групповое занятие</span>
              <AttendanceStatusBadge 
                status={status}
                style={{ fontSize: "14px" }}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mb-3">
              <Row>
                <div className="d-flex" style={{ padding: "0 50px" }}>

                  <Container>
                    <Container className="mt-2 text-center" style={{ fontSize: "14px" }}>
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
                      <AttendanceDateAndRoom 
                        {...this.props.attendance}
                        attendance={this.props.attendance}
                        className="text-center"
                      />
                    </Container>
                    <Link to={`/student/${this.props.attendance.studentId}`}>
                      <h3>
                        {this.props.attendance.firstName} {this.props.attendance.lastName}
                      </h3>
                    </Link>
                  </Container>
                </div>
              </Row>
            </Container>
            <hr></hr>

            {this.renderStudentList()}

            <Form.Group className="mb-3" controlId="comment">
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
