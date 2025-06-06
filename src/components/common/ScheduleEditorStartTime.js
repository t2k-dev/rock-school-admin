import React from "react";
import { Form, Container, Row, Table, Button } from "react-bootstrap";
import { addMinutes, format } from "date-fns";
import { CalendarIcon } from "../icons/CalendarIcon";

export class ScheduleEditorStartTime extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      periods: this.props.periods,

      periodDay: "",
      periodStart: "",
      periodEnd: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.periods !== prevProps.periods) {
      this.setState({ periods: this.props.periods });
    }
  }

  addPeriod = () => {
    const [hours, minutes] = this.state.periodStart.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    const minutesToAdd = this.props.attendanceLength === "1" ? 60 : 90;

    const updatedDate = addMinutes(date, minutesToAdd);

    const endTime = format(updatedDate, "HH:mm");

    this.setState(
      (prevState) => {
        const newPeriod = {
          weekDay: parseInt(this.state.periodDay),
          startTime: this.state.periodStart,
          endTime: endTime,
        };
        return { periods: [...prevState.periods, newPeriod] };
      },
      () => {
        this.props.handlePeriodsChange(this.state.periods);
      }
    );
  };

  deletePeriod = (itemIndex) => {
    this.setState(
      (prevState) => ({
        periods: prevState.periods.filter((_, index) => index !== itemIndex),
      }),
      () => this.props.handlePeriodsChange(this.state.periods)
    );
  };

  getDayName = (dayIndex) => {
    switch (dayIndex) {
      case 1:
        return "Понедельник";
      case 2:
        return "Вторник";
      case 3:
        return "Среда";
      case 4:
        return "Четверг";
      case 5:
        return "Пятница";
      case 6:
        return "Суббота";
      case 0:
        return "Воскресенье";
    }
  };

  render() {
    const { periods } = this.state;

    let periodsList;
    if (periods && periods.length > 0) {
      periodsList = periods.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            <Container className="d-flex p-0">
              <div className="flex-grow-1">
                {this.getDayName(item.weekDay)} {item.startTime} - {item.endTime}
              </div>
              <div className="flex-shrink-1">
                <Button
                  variant="outline-danger"
                  style={{ fontSize: "10px", marginLeft: "10px", borderRadius: "25px" }}
                  onClick={() => this.deletePeriod(index)}
                >
                  X
                </Button>
              </div>
            </Container>
          </td>
        </tr>
      ));
    } else {
      periodsList = (
        <tr key={1}>
          <td colSpan="5" style={{ textAlign: "center" }}>
            Нет записей
          </td>
        </tr>
      );
    }

    return (
      <Form.Group className="mb-3">
        <b><CalendarIcon/>Расписание</b>
        <Row style={{ marginTop: "20px" }}>
          <Container className="d-flex">
            <Container className="p-0">
              <Form.Select aria-label="Веберите день..." value={this.state.periodDay} onChange={(e) => this.setState({ periodDay: e.target.value })}>
                <option>День недели...</option>
                <option value="1">Понедельник</option>
                <option value="2">Вторник</option>
                <option value="3">Среда</option>
                <option value="4">Четверг</option>
                <option value="5">Пятница</option>
                <option value="6">Суббота</option>
                <option value="0">Воскресенье</option>
              </Form.Select>
            </Container>
            <Container className="d-flex p-0 flex-fill">
              <span className="mt-1" style={{ margin: "6px 8px" }}>
                начало в
              </span>
              <Form.Select
                aria-label="Веберите день..."
                value={this.state.periodStart}
                onChange={(e) => this.setState({ periodStart: e.target.value })}
                style={{ width: "100px" }}
              >
                <option>чч:мм</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00</option>
                <option value="21:00">21:00</option>
                <option value="22:00">22:00</option>
              </Form.Select>
            </Container>
            <Container className="p-0" style={{ width: "40px" }}>
              <Button variant="outline-success"style={{ width: "40px", fontSize:"14px" }} onClick={this.addPeriod}>
                +
              </Button>
            </Container>
          </Container>
        </Row>
        <Row>
          <Container>
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <tbody>{periodsList}</tbody>
          </Table>
          </Container>
        </Row>
      </Form.Group>
    );
  }
}
