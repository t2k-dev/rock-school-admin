import { format } from "date-fns";
import React from "react";
import { Button, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import { DisciplineIcon } from "../common/DisciplineIcon";

import { updateStatus } from "../../services/apiAttendanceService";

import { Avatar } from "../common/Avatar";
import { CalendarIcon } from "../icons/CalendarIcon";

import AttendanceStatus from "../constants/AttendanceStatus";
import { getAttendanceStatusName } from "../constants/attendancies";
import { getDisciplineName } from "../constants/disciplines";
import { getRoomName } from "../constants/rooms";

export class SlotDetailsModal extends React.Component {
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
    this.handleTrialStatusChange = this.handleTrialStatusChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSlotDetails?.status !== prevProps.selectedSlotDetails?.status) {
      this.setState({ status: this.props.selectedSlotDetails.status });
    }
  }

  handleTrialStatusChange(e) {
    this.setState({ trialStatus: e.target.value });
  }

  handleClose() {
    this.setState({ show: false });
  }

  async handleStatusChange(status) {
    const response = await updateStatus(this.props.selectedSlotDetails.attendanceId, status)
  }

  getAvailableSlots() {
    let result = "";
    this.state.availableSlots.forEach((element) => {
      result = result + element.description + "\n";
    });
    this.setState({ availableSlotsText: result });
  }

  render() {
    const { status, trialStatus } = this.state;

    const showAddSubscription = status === "2";
    const showTrialStatus = this.props.selectedSlotDetails?.isTrial === true;
    if (!this.props.selectedSlotDetails) {
      return <></>;
    }
    const { teacher, student, startDate, disciplineId, roomId, comment } = this.props.selectedSlotDetails;

    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose} size="md">
          <Modal.Header closeButton>
            <Modal.Title>{this.props.selectedSlotDetails.isTrial ? "Пробное занятие" : "Занятие"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mb-3">
              <Row>
                <div className="d-flex">
                  <Container style={{ width: "100px", padding: "0" }}>
                    <Avatar style={{ width: "100px", height: "100px" }} />
                    <div className="text-center mt-1">
                      <Link to={`/studentScreen/${student.studentId}`}>{student.firstName}</Link>
                    </div>
                  </Container>
                  <Container>
                    <Container className="mt-2" style={{ fontSize: "14px" }}>
                      <Stack direction="vertical" gap={0}>
                        <div>
                          <CalendarIcon /> <span style={{ fontSize: "14px" }}>{format(startDate, "HH:mm - dd.MM.yyyy")}</span>
                        </div>
                        <div>
                          Направление:{" "}
                          <span>
                            <DisciplineIcon disciplineId={disciplineId} />{" "}
                          </span>{" "}
                          {getDisciplineName(disciplineId)}
                        </div>
                        <div>
                          Преподаватель: <Link to={"/teacher/" + teacher.teacherId}>{teacher.firstName}</Link>
                        </div>
                        <div>Комната: {getRoomName(roomId)}</div>
                        <div>Статус: {getAttendanceStatusName(status)}</div>
                      </Stack>
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
            <div className="text-center mt-5 mb-5">
                <Button onClick={(s) => this.handleStatusChange(AttendanceStatus.ATTENDED)} variant={status === AttendanceStatus.ATTENDED ? 'primary' : 'outline-primary'}>Посещено</Button>
                <Button onClick={(s) => this.handleStatusChange(AttendanceStatus.MISSED)} variant={status === AttendanceStatus.MISSED ? 'danger' : 'outline-danger'} style={{marginLeft:"10px"}}>Пропущено</Button>
                <Button
                  as={Link}
                  to={{
                    pathname: `/attendance/${this.props.selectedSlotDetails.attendanceId}/cancelationForm`,
                    state: { disciplineId: "??" },
                  }}
                  variant={status === AttendanceStatus.CANCELED_BY_STUDENT ? 'secondary' : 'outline-secondary'}
                  style={{marginLeft:"10px"}}
                  
                >
                  Перенесено
                </Button>
            </div>

            {showTrialStatus && (
              <Form.Group className="mb-4">
                {                
                  /*showAddSubscription && */ <div className="text-center">
                    <h4>Результат пробного занятия</h4>
                    <Button
                      as={Link}
                      to={{
                        pathname: `/student/${student.studentId}/subscriptionForm`,
                        state: { disciplineId: disciplineId, teacher: teacher, student: student },
                      }}
                      variant="outline-success"
                    >
                      Оформить абонемент
                    </Button>
                    <Button variant="outline-danger" style={{ marginLeft: "10px" }}>
                      Отказаться
                    </Button>
                  </div>
                }
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
