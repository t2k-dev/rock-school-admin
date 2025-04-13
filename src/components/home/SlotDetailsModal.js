import React from "react";
import { Modal, Form, Button, Row, Col, Card, Container, Stack } from "react-bootstrap";

import { Link } from "react-router-dom";
import { format } from "date-fns";

import { DisciplineIcon } from "../common/DisciplineIcon";
import { Avatar } from "../common/Avatar";
import { getDisciplineName } from "../constants/disciplines";

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
    this.getAvailableSlots = this.getAvailableSlots.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleTrialStatusChange = this.handleTrialStatusChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSlotDetails?.status !== prevProps.selectedSlotDetails?.status) {
      this.setState({ status: this.props.selectedSlotDetails.status });
    }
  }

  handleStatusChange(e) {
    alert(this.props.selectedSlotDetails.attendanceId);
    this.setState({ status: e.target.value });
  }

  handleTrialStatusChange(e) {
    this.setState({ trialStatus: e.target.value });
  }

  handleClose() {
    this.setState({ show: false });
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
    const { teacher, student, startDate, disciplineId, comment } = this.props.selectedSlotDetails;

    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose} size="md">
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.selectedSlotDetails.isTrial ? "Пробное занятие" : "Занятие"} ({format(startDate, "dd.MM.yyyy")})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mb-3">
              <Row>
                <div className="d-flex">
                  <Container style={{ width: "100px", padding: "0" }}>
                    <Avatar style={{ width: "100px", height: "100px" }} />
                    <div className="text-center mt-1">
                      <Link to={"/student/" + student.studentId}>{student.firstName}</Link>
                    </div>
                  </Container>
                  <Container>
                    <Container className="mt-3" style={{ fontSize: "14px" }}>
                      <Stack direction="vertical" gap={0}>
                        <div>Начало в {format(startDate, "HH:mm")}</div>
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
                        <div>
                          Комната: Зеленая
                        </div>
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
            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Статус</Form.Label>
              <Form.Select name="level" aria-label="Веберите..." value={status} onChange={this.handleStatusChange}>
                <option>выберите...</option>
                <option value="1">Новое</option>
                <option value="2">Проведено</option>
                <option value="3">Пропущено</option>
                <option value="4">Отменено учеником</option>
                <option value="5">Отменено преподавателем</option>
              </Form.Select>
            </Form.Group>
            {showTrialStatus && (
              <Form.Group className="mt-3 mb-3">
                
                {
                  /*showAddSubscription && */ <div className="text-center">
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
                    <Button variant="outline-danger" style={{marginLeft:"10px"}}>Отказаться</Button>
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
