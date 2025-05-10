import { format, getDay } from "date-fns";
import React from "react";
import { Button, Container, Form, Row, Table } from "react-bootstrap";

import { formatTime, getWeekDayNameLong } from "../common/DateTimeHelper";
import { getDayName } from "../constants/days";
import { getRoomName } from "../constants/rooms";

import { CalendarIcon } from "../icons/CalendarIcon";

export class ScheduleEditorWithSlots extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      periods: this.props.periods,
      availableSlots: this.props.availableSlots,

      selectedSlotId: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.periods !== prevProps.periods) {
      this.setState({ periods: this.props.periods });
    }

    if (this.props.availableSlots !== prevProps.availableSlots) {
      this.setState({ availableSlots: this.props.availableSlots });
    }
  }

  addPeriod = () => {
    const selectedSlot = this.state.availableSlots.filter(p => p.id === this.state.selectedSlotId)[0];
    this.setState(
      (prevState) => {
        const newPeriod = {
          weekDay: getDay(selectedSlot.start),
          startTime: format(new Date(selectedSlot.start), "HH:mm"),
          endTime: format(new Date(selectedSlot.end), "HH:mm"),
          roomId: selectedSlot.roomId,
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

  render() {
    const { periods, availableSlots } = this.state;
    console.log("periods")
    console.log(periods)
    let periodsList;
    if (periods && periods.length > 0) {
      periodsList = periods.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            <Container className="d-flex p-0">
              <div className="flex-grow-1">
                {`${getDayName(item.weekDay)} в ${item.startTime} (${getRoomName(item.roomId)})`}
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

    let availableSlotsList;
    if (availableSlots && availableSlots.length > 0) {
      availableSlotsList = availableSlots.map((item, index) => {
        return(
        <option key={index} value={item.id}>
          {`${getWeekDayNameLong(item.start)}, в ${formatTime(item.start)} (${getRoomName(item.roomId)})`}
        </option>
        );
      });
    }

    return (
      <Form.Group className="mb-3">
        <b>
          <CalendarIcon />
          Расписание
        </b>
        <Row style={{ marginTop: "20px" }}>
          <Container className="d-flex">
            <Container className="p-0" style={{ marginRight: "10px" }}>
              <Form.Select aria-label="Веберите день..." value={this.state.selectedSlotId} onChange={(e) => this.setState({ selectedSlotId: e.target.value })}>
                <option>Выберите окно...</option>
                {availableSlotsList}
              </Form.Select>
            </Container>
            <Container className="p-0" style={{ width: "40px" }}>
              <Button variant="outline-success" style={{ width: "40px", fontSize: "14px" }} onClick={this.addPeriod}>
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
