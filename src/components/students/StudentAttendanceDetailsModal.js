import React from "react";
import { Modal, Form, Button, Row, Col, Card, Container, Stack } from "react-bootstrap";

import { Link } from "react-router-dom";
import { format } from "date-fns";

import { DisciplineIcon } from "../common/DisciplineIcon";
import { Avatar } from "../common/Avatar";
import { getDisciplineName } from "../constants/disciplines";

export class StudentAttendanceDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,

    };

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate(prevProps) {

  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    if (!this.props.selectedAttendanceDetails){
      return <></>;
    }
    const {teacher, student, startDate, disciplineId} = this.props.selectedAttendanceDetails;
    console.log(this.props.selectedAttendanceDetails);
    
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
                  <Link to={`/student/${this.props.selectedAttendanceDetails.studentId}`}>
                    <h3>
                      {this.props.selectedAttendanceDetails.firstName} {this.props.selectedAttendanceDetails.lastName}
                    </h3>
                  </Link>
                </Col>
              </Row>
            </Container>
            <hr></hr>
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
