import React from "react";
import { Button, Container, Form, Row, Table } from "react-bootstrap";

import { getDayName } from "../../../constants/days";
import { getRoomName } from "../../../constants/rooms";

import { CalendarIcon } from "../icons/CalendarIcon";

export class ScheduleEditorWithDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schedules: this.props.schedules,
      selectedSlotId: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.schedules !== prevProps.schedules) {
      this.setState({ schedules: this.props.schedules });
    }
  }

  deleteRecord = (itemIndex) => {
    this.setState(
      (prevState) => ({
        schedules: prevState.schedules.filter((_, index) => index !== itemIndex),
      }),
      () => this.props.onChange(this.state.schedules)
    );
  };

  render() {
    const { schedules } = this.state;
    let schedulesList;
    if (schedules && schedules.length > 0) {
      schedulesList = schedules.map((item, index) => (
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
                  onClick={() => this.deleteRecord(index)}
                >
                  X
                </Button>
              </div>
            </Container>
          </td>
        </tr>
      ));
    } else {
      schedulesList = (
        <tr key={1}>
          <td colSpan="5" style={{ textAlign: "center" }}>
            Нет записей
          </td>
        </tr>
      );
    }

    return (
      <Form.Group className="mb-3">
        <b>
          <CalendarIcon />
          Расписание
        </b>
        <Row>
          <Container>
            <Table striped bordered hover style={{ marginTop: "20px" }}>
              <tbody>{schedulesList}</tbody>
            </Table>
          </Container>
        </Row>
      </Form.Group>
    );
  }
}
