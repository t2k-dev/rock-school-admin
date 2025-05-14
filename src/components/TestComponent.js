import { parse } from "date-fns";

import React from "react";
import { Button } from "react-bootstrap";

import { ru } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class TestComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disciplineId: 0,
      startDate: null,
    };

    this.handleConfirmAndSubscribe = this.handleConfirmAndSubscribe.bind(this);
  }

  handleConfirmAndSubscribe = async (e) => {
    e.preventDefault();

    //const { student, teacher, disciplineId } = this.state.attendance;
    this.props.history.push(`/TestComponent2`, { disciplineId: 5 });
  };

  render() {
    const { disciplineId, startDate } = this.state;

    return (
      <>
        <DatePicker
          locale={ru} // Russian locale for date
          selected={startDate} // Correctly bind the date object
          onChange={(date) => {
            if (date) {
              this.setState({ startDate: date }); // Store the Date object in state
            }
          }}
          onChangeRaw={(e) => {
            const rawValue = e.target.value;
            try {
              // Parse the raw input based on the expected format
              const parsedDate = parse(rawValue, "dd.MM.yyyy", new Date());
              if (!isNaN(parsedDate)) {
                this.setState({ startDate: parsedDate }); // Only set valid dates
              }
            } catch (error) {
              console.error("Invalid date format"); // Handle invalid format
            }
          }}
          dateFormat="dd.MM.yyyy" // Format for the displayed date
          placeholderText="дд.мм.гггг" // Input placeholder
          isClearable // Allow clearing the input
        />
        <Button variant="outline-secondary" onClick={() => this.setState({ startDate: new Date() })}>
          Сегодня
        </Button>
        <Button onClick={this.handleConfirmAndSubscribe}>Ok</Button>
      </>
    );
  }
}
