import React from "react";
import { Button, Container, Form, Row, Table } from "react-bootstrap";
import { getRoomName } from "../../../constants/rooms";
import { CalendarIcon } from "../icons/CalendarIcon";

export class ScheduleEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      periods: this.props.periods,

      periodDay: "",
      periodStart: "",
      periodEnd: "",
      roomId: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.periods !== prevProps.periods) {
      this.setState({ periods: this.props.periods });
    }
  }

  addPeriod = () => {
    this.setState(
      (prevState) => {
        const newPeriod = {
          weekDay: parseInt(this.state.periodDay),
          startTime: this.state.periodStart,
          endTime: this.state.periodEnd,
          roomId: this.state.roomId,
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
      const sortedPeriods = periods.sort((a, b) => {
        // Special condition: Always place `weekDay = 0` at the end
        if (a.weekDay === 0 && b.weekDay !== 0) {
          return 1; // Move `a` to after `b`
        }
        
        if (b.weekDay === 0 && a.weekDay !== 0) {
          return -1; // Move `b` to after `a`
        }
        // Sort by `weekDay` first
        if (a.weekDay !== b.weekDay) {
          return a.weekDay - b.weekDay;
        }

        // If `weekDay` is the same, sort by `startTime`
        return a.startTime.localeCompare(b.startTime);
      });

      periodsList = sortedPeriods.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            <Container className="d-flex p-0">
              <div className="flex-grow-1">
                {this.getDayName(item.weekDay)} {item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)} ({getRoomName(item.roomId)})
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
        <Form.Label>
          <b>
            <CalendarIcon />
            Расписание
          </b>
        </Form.Label>

        <Row>
          <Container>
            <Form.Select aria-label="Веберите день..." value={this.state.roomId} onChange={(e) => this.setState({ roomId: e.target.value })}>
              <option>выберите комнату...</option>
              <option value="1">Красная</option>
              <option value={2}>Вокальная</option>
              <option value={4}>Барабанная</option>
              <option value={5}>Желтая</option>
              <option value={6}>Зеленая</option>
            </Form.Select>
          </Container>
        </Row>

        <Row style={{ marginTop: "20px" }}>
          <Container className="d-flex">
            <div style={{ width: "150px" }}>
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
            </div>
            <div className="d-flex flex-fill">
              <span className="mt-1" style={{ margin: "6px 8px" }}>
                с
              </span>
              <Form.Select
                aria-label="Веберите день..."
                value={this.state.periodStart}
                onChange={(e) => this.setState({ periodStart: e.target.value })}
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
                <option value="23:00">23:00</option>
              </Form.Select>
              <span className="mt-1" style={{ margin: "6px 8px" }}>
                по
              </span>
              <Form.Select value={this.state.periodEnd} onChange={(e) => this.setState({ periodEnd: e.target.value })}>
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
                <option value="23:00">23:00</option>
              </Form.Select>
            </div>
            <div style={{ width: "40px", marginLeft: "10px" }}>
              <Button variant="outline-success" style={{ width: "40px" }} onClick={this.addPeriod}>
                +
              </Button>
            </div>
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
