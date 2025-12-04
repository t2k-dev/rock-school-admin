import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { Badge, Button, Container, Form, Modal, Row, Stack, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { submit } from "../../services/apiAttendanceService";

import { Avatar } from "../common/Avatar";
import { DisciplineIcon } from "../common/DisciplineIcon";
import { CalendarIcon } from "../icons/CalendarIcon";
import { TimeIcon } from "../icons/TimeIcon";

import AttendanceStatus from "../constants/AttendanceStatus";
import { getAttendanceStatusName } from "../constants/attendancies";
import { getDisciplineName } from "../constants/disciplines";
import { getRoomName } from "../constants/rooms";


export class GroupSlotDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,

      status: 0,
      comment: "",
      childAttendances: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSlotDetails?.status !== prevProps.selectedSlotDetails?.status) {
      this.setState({ 
        status: this.props.selectedSlotDetails.status 
      });
    }
    
    if (this.props.selectedSlotDetails?.childAttendances !== prevProps.selectedSlotDetails?.childAttendances) {
      this.setState({ 
        childAttendances: this.props.selectedSlotDetails?.childAttendances || []
      });
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

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
      comment: this.props.selectedSlotDetails.statusReason,
    };

    await submit(request);

    this.props.handleClose();
  }

  render() {
    if (!this.props.show) {
      return <></>;
    }

    const { teacher, startDate, endDate, disciplineId, roomId, statusReason } = this.props.selectedSlotDetails;
    const { status } = this.state;
    const childAttendances = this.state.childAttendances || [];
console.log('render')    
console.log(childAttendances)

    let childAttendancesList;
    childAttendancesList = (
      <Table striped bordered hover>
          <tbody>
            {childAttendances.map((attendance) => (
              <tr key={attendance.attendanceId}>
                <td>
                  <Avatar style={{ width: "20px", height: "20px", marginRight: "5px" }} />
                  <Link to={`/student/${attendance.student.studentId}`}>{attendance.student.firstName} {attendance.student.lastName}</Link>
                </td>
                <td>
                    <Button
                      onClick={() => this.handleStatusChange(attendance.attendanceId, AttendanceStatus.ATTENDED)}
                      variant={attendance.status === AttendanceStatus.ATTENDED ? "primary" : "outline-primary"}
                      style={{ width: "120px", marginRight: "10px" }}
                    >
                      Посещено
                    </Button>
                    <Button
                      onClick={() => this.handleStatusChange(attendance.attendanceId, AttendanceStatus.MISSED)}
                      variant={attendance.status === AttendanceStatus.MISSED ? "danger" : "outline-danger"}
                      style={{ width: "120px", marginRight: "10px" }}
                    >
                      Пропуск
                    </Button>
                  </td>
              </tr>
            ))}
        </tbody>
      </Table>
      );

    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose} size="md">
          <Modal.Header closeButton>
            <Modal.Title>
              Групповое занятие
              <Badge style={{ marginLeft: "10px"}} bg="success">{getAttendanceStatusName(status)}</Badge>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mb-3">
              <Row>
                <div className="d-flex" style={{ padding: "0 50px" }}>

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
            {childAttendancesList}
              <Form.Group className="mb-3" controlId="comment">
                <Form.Label>Комментарий</Form.Label>
                <Form.Control as="textarea" onChange={this.handleChange} value={statusReason} placeholder="введите..." autoComplete="off"/>
              </Form.Group>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleSave}>
              Сохранить
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
