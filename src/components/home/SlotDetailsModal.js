import React from "react";
import { Modal, Form, Button, Row, Col, Card, Container, Stack } from "react-bootstrap";

import { Link } from "react-router-dom";
import { format } from "date-fns";

import { VocalIcon } from "../icons/VocalIcon";
import { DisciplineIcon } from "../common/DisciplineIcon";
import { Avatar } from "../common/Avatar";
import { getDisciplineName } from "../constants/disciplines";

export class SlotDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,

      status: 0,
      availableTeachers: [],
      availableSlots: [],
      availableSlotsText: "",
    };

    this.handleClose = this.handleClose.bind(this);
    this.getAvailableSlots = this.getAvailableSlots.bind(this);
  }

  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate available");
    if (this.props.availableTeachers !== prevProps.availableTeachers) {
      this.setState({ availableTeachers: this.props.availableTeachers });
    }
  }

  handleStatusChange(e){
    alert(this.props.selectedSlotDetails.attendance.attendanceId);
    this.setState({ status: e.target.value })
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
    const { status } = this.state;
    
    if (!this.props.selectedSlotDetails){
      return <></>;
    }
    const {teacher, student, startDate, disciplineId} = this.props.selectedSlotDetails;
    console.log(this.props.selectedSlotDetails);
    
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {student.firstName} {student.lastName} ({format(startDate, "dd.MM.yyyy")})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mb-3">
              <Row>
                <Col md="4">
                  <Avatar />
                </Col>
                <Col>
                  <Container className="mt-3" style={{fontSize:"14px"}}>
                    <Stack direction="vertical" gap={1}>
                      <div className="mb-1">Начало в {format(startDate, "hh:mm")}</div>
                      <div>
                        Преподаватель: <Link to={"/teacher/"+ teacher.teacherId}>{teacher.firstName}</Link>
                      </div>
                      <div>
                        Направление: <span><DisciplineIcon disciplineId={disciplineId}/> </span> {getDisciplineName(disciplineId)}
                      </div>
                    </Stack>
                  </Container>
                  <Link to={`/student/${this.props.selectedSlotDetails.studentId}`}>
                    <h3>
                      {this.props.selectedSlotDetails.firstName} {this.props.selectedSlotDetails.lastName}
                    </h3>
                  </Link>
                </Col>
              </Row>
            </Container>
            <hr></hr>
            <Form.Group className="mb-3" controlId="status">
              <Form.Label>Статус</Form.Label>
              <Form.Select name="level" aria-label="Веберите..." value={status} onChange={(e) => this.handleStatusChange(e)}>
                <option>выберите...</option>
                <option value="0">Новое</option>
                <option value="1">Проведено</option>
                <option value="2">Пропущено</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="comment" style={{display:"none"}}>
              <Form.Label>Комментарий</Form.Label>
              <Form.Control as="textarea" value={"s"} style={{ height: "50px" }} placeholder="" />{" "}
            </Form.Group>
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
