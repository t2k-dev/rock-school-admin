import { format } from "date-fns";
import { ru } from "date-fns/locale";

import React from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";

import { CalendarIcon } from "../../shared/icons/CalendarIcon";

import { getDisciplineName } from "../../../constants/disciplines";

import { missed } from "../../../services/apiAttendanceService";


export class AttendanceCancelationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendanceId: 0,
      statusReason: "",
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { state } = this.props.location;
    if (state && state.attendance) {
      this.setState({ attendance: state.attendance });
    }
  }

  handleSave = async (e) => {
    e.preventDefault();
    
    const request = {
      statusReason: this.state.statusReason
    }
    const response = await missed(this.state.attendance.attendanceId, request);
    
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
            <h2 className="text-center mb-4">Пропуск занятия</h2>
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
                <Form.Label>Причина</Form.Label>
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
                <Button variant="success" type="null" onClick={this.handleSave}>
                  Подтвердить пропуск
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
