import React from "react";
import { Form, Container, Row, Col, Table, Button } from "react-bootstrap";
import InputMask from "react-input-mask";
import { format } from "date-fns";

class SchedulePicker extends React.Component {
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
    this.setState(
      (prevState) => {
        const newPeriod = {
          weekDay: parseInt(this.state.periodDay),
          startTime: this.state.periodStart,
          endTime: this.state.periodEnd,
        };
        return { periods: [...prevState.periods, newPeriod] };
      },
      () => { this.props.handlePeriodsChange(this.state.periods); }
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
          <td>{this.getDayName(item.weekDay)}</td>
          <td>{item.startTime.substring(0, 5)}</td>
          <td>{item.endTime.substring(0, 5)}</td>
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
              <span className="mt-1" style={{margin:"6px 8px"}}>с</span>
              <Form.Control
                    as={InputMask}
                    mask="99:99"
                    maskChar=" "
                    placeholder="чч:мм"
                    value={this.state.periodStart}
                    onChange={(e) => this.setState({ periodStart: e.target.value })}
                    style={{width:"60px"}}
              />
              <span className="mt-1" style={{margin:"6px 8px"}}>по</span>
              <Form.Control
                  as={InputMask}
                  mask="99:99"
                  maskChar=" "
                  placeholder="чч:мм"
                  value={this.state.periodEnd}
                  onChange={(e) => this.setState({ periodEnd: e.target.value })}
                  style={{width:"60px"}}
                />
            </Container>
            <Container className="p-0" style={{width:"40px"}}>
              <Button style={{width:"40px"}} onClick={this.addPeriod}>
                <i>+</i>
              </Button>
            </Container>
          </Container>

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
