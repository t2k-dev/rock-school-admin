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
      comment:"",
      availableTeachers: [],
      availableSlots: [],
      availableSlotsText: "",
    };

    this.handleClose = this.handleClose.bind(this);
    this.getAvailableSlots = this.getAvailableSlots.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate available");
    console.log(this.props.selectedSlotDetails);
    if (this.props.selectedSlotDetails?.status !== prevProps.selectedSlotDetails?.status) {
      this.setState({ status: this.props.selectedSlotDetails.status });
    }
    console.log(this.state);
  }

  handleStatusChange(e){
    alert(this.props.selectedSlotDetails.attendanceId);
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
    const {teacher, student, startDate, disciplineId, comment} = this.props.selectedSlotDetails;
    console.log(this.props.selectedSlotDetails);
    
    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.selectedSlotDetails.isTrial? "Пробное занятие": "Занятие"} ({format(startDate, "dd.MM.yyyy")})
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
                      <div className="mb-1">Начало в {format(startDate, "HH:mm")}</div>
                      <div>
                        Ученик: <Link to={"/student/"+ student.teacherId}>{student.firstName}</Link>
                      </div>
                      <div>
                        Направление: <span><DisciplineIcon disciplineId={disciplineId}/> </span> {getDisciplineName(disciplineId)}
                      </div>
                      <div>
                        Преподаватель: <Link to={"/teacher/"+ teacher.teacherId}>{teacher.firstName}</Link>
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
              <Form.Select name="level" aria-label="Веберите..." value={status} onChange={this.handleStatusChange}>
                <option>выберите...</option>
                <option value="1">Новое</option>
                <option value="2">Проведено</option>
                <option value="3">Пропущено</option>
                <option value="4">Отменено учеником</option>
                <option value="5">Отменено преподавателем</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="comment">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control as="textarea" value={comment} style={{ height: "50px" }} placeholder="" />{" "}
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
