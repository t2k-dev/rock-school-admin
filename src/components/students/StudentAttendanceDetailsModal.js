import React from "react";
import { Button, Col, Container, Modal, Row, Stack } from "react-bootstrap";

import { format } from "date-fns";
import { Link } from "react-router-dom";

import { Avatar } from "../common/Avatar";
import { DisciplineIcon } from "../common/DisciplineIcon";
import { getAttendanceStatusName } from "../constants/attendancies";
import { getDisciplineName } from "../constants/disciplines";

export class StudentAttendanceDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    if (!this.props.selectedAttendanceDetails) {
      return <></>;
    }
    const { status, teacher, startDate, disciplineId } = this.props.selectedAttendanceDetails;
    console.log(this.props.selectedAttendanceDetails);

    return (
      <>
        <Modal show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Пробное занятие ({format(startDate, "dd.MM.yyyy")})</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mb-3">
              <Row>
                <Col md="4">
                  <Avatar />
                </Col>
                <Col>
                  <Container className="mt-3" style={{ fontSize: "14px" }}>
                    <Stack direction="vertical" gap={1}>
                      <div className="mb-1">Начало в {format(startDate, "HH:mm")}</div>
                      <div>
                        Преподаватель: <Link to={`/teacher/${teacher.teacherId}`}>{teacher.firstName}</Link>
                      </div>
                      <div>
                        Направление:
                        <span>
                          <DisciplineIcon disciplineId={disciplineId} />{" "}
                        </span>{" "}
                        {getDisciplineName(disciplineId)}
                      </div>
                      <div>
                        Статус: {getAttendanceStatusName(status)}
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
            <Stack direction="vertical" gap={2} style={{ width: "200px" }}>
              <Button variant="outline-secondary">Не пришёл</Button>
              <Button
                as={Link}
                to={{
                  pathname: `/attendance/${this.props.selectedAttendanceDetails.attendanceId}/cancelationForm`,
                  state: { disciplineId: "??" },
                }}
                variant="outline-secondary"
              >
                Перенести
              </Button>
            </Stack>
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
