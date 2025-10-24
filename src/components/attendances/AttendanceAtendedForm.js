import { format } from "date-fns";
import { ru } from "date-fns/locale";

import React from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";

import { CalendarIcon } from "../icons/CalendarIcon";

import { getDisciplineName } from "../constants/disciplines";

import { acceptTrial, attend, declineTrial } from "../../services/apiAttendanceService";

export class AttendanceAtendedForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceId: 0,
      statusReason: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleConfirmAndSubscribe = this.handleConfirmAndSubscribe.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
  }

  componentDidMount() {
    const { state } = this.props.location;
    if (state && state.attendance) {
      this.setState({ attendance: state.attendance });
    }
  }

  handleConfirmAndSubscribe = async (e) => {
    e.preventDefault();

    const request = {
        statusReason: this.state.statusReason,
    }

    const response = await acceptTrial(this.state.attendance.attendanceId, request);
    console.log("this.state.attendance");
    console.log(this.state.attendance)
    this.props.history.push({
      pathname: `/student/${this.state.attendance.student.studentId}/subscriptionForm`,
      state: {
        studentId: this.state.attendance.student.studentId,
        disciplineId: this.state.attendance.disciplineId,
        teacher: {
          teacherId: this.state.attendance.teacher.teacherId,
          firstName: this.state.attendance.teacher.firstName
        }
      }
    });

    //window.history.back();
  };

  handleDecline = async (e) =>{
    e.preventDefault();

    const request = {
        statusReason: this.state.statusReason,
    }

    const response = await declineTrial(this.state.attendance.attendanceId, request);
    console.log(response);
  }

  handleAttend = async (e) => {
    e.preventDefault();

    const request = {
        statusReason: this.state.statusReason,
    }

    const response = await attend(this.state.attendance.attendanceId, request);

    window.history.back();
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  render() {
    const { attendance, statusReason } = this.state;
    if (!attendance) {
      return;
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="text-center mb-4">{attendance?.isTrial ? "Пробное занятие посещено" : "Занятие посещено"}</h2>
            <Stack className="mb-3" gap={2} style={{ backgroundColor: "#e7e7e7", padding: "15px", borderRadius: "10px" }}>
              <div>
                <CalendarIcon />
                <span>
                  {format(attendance.startDate, "d MMMM, EEEE", { locale: ru })}, с {format(attendance.startDate, "HH:mm")} -{" "}
                  {format(attendance.endDate, "HH:mm")}
                </span>
              </div>
              <div>Ученик: {attendance.student.firstName}</div>
              <div>
                Направление: {getDisciplineName(attendance.disciplineId)} ({attendance.teacher.firstName})
              </div>
            </Stack>
            <hr></hr>

            <Form>
              <Form.Group className="mb-3" controlId="statusReason">
                <Form.Label>Описание</Form.Label>
                <Form.Control
                  onChange={this.handleChange}
                  value={statusReason}
                  placeholder="введите..."
                  autoComplete="off"
                  as="textarea"
                  style={{ height: "100px" }}
                />
              </Form.Group>
              <hr></hr>
              <div className="text-center">
                {attendance.isTrial && (
                  <>
                    <Button variant="outline-secondary" type="null" onClick={this.handleDecline}>
                      Отказаться
                    </Button>
                    <Button onClick={this.handleConfirmAndSubscribe} variant="outline-success" style={{ marginLeft: "10px" }}>
                      Оформить абонемент
                    </Button>
                  </>
                )}

                {attendance.isTrial === false && (
                  <>
                    <Button onClick={this.handleAttend} variant="outline-success" style={{ marginLeft: "10px" }}>
                      Подтвердить посещение
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
