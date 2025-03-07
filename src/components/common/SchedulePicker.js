import React from "react";
import { Form, Container, Row, Col, Table, Button } from "react-bootstrap";
import InputMask from "react-input-mask";

class SchedulePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      periods: this.props.periods,

      periodDay: 0,
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
    this.setState(
      (prevState) => {
        const newPeriod = {
          weekDay: parseInt(this.state.periodDay),
          startTime: this.state.periodStart,
          endTime: this.state.periodEnd,
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
      case 7:
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
          <td>{this.getDayName(item.weekDay)}</td>
          <td>{item.startTime}</td>
          <td>{item.endTime}</td>
          <td>
            <Button onClick={() => this.deletePeriod(index)}>
              <i>-</i>
            </Button>
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
        <b>Расписание</b>
        <Row style={{ marginTop: "20px" }}>
          <Col md="5">
            <Form.Select aria-label="Веберите день..." value={this.state.periodDay} onChange={(e) => this.setState({ periodDay: e.target.value })}>
              <option>День недели...</option>
              <option value="1">Понедельник</option>
              <option value="2">Вторник</option>
              <option value="3">Среда</option>
              <option value="4">Четверг</option>
              <option value="5">Пятница</option>
              <option value="6">Суббота</option>
              <option value="7">Воскресенье</option>
            </Form.Select>
          </Col>
          <Col>
            <Row>
              <Form.Label column md={1}>
                с
              </Form.Label>
              <Col md={4}>
                <Form.Control
                  as={InputMask}
                  mask="99:99"
                  maskChar=" "
                  placeholder="чч:мм"
                  value={this.state.periodStart}
                  onChange={(e) => this.setState({ periodStart: e.target.value })}
                />
              </Col>
              <Form.Label column md={1}>
                по
              </Form.Label>
              <Col md={4}>
                <Form.Control
                  as={InputMask}
                  mask="99:99"
                  maskChar=" "
                  placeholder="чч:мм"
                  value={this.state.periodEnd}
                  onChange={(e) => this.setState({ periodEnd: e.target.value })}
                />
              </Col>
              <Col md={2}>
                <Button onClick={this.addPeriod}>
                  <i>+</i>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>День</th>
                <th>С</th>
                <th>До</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{periodsList}</tbody>
          </Table>
        </Row>
      </Form.Group>
    );
  }
}

export default SchedulePicker;
