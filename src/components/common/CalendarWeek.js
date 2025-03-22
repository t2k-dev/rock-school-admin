import React from "react";
import { render } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ru";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("ru");
const localizer = momentLocalizer(moment);

export class CalendarWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      backgroundEvents: this.props.backgroundEvents,
    };
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate Week');
    if (this.props.events !== prevProps.events) {
      this.setState({ events: this.props.events });
    }
    if (this.props.backgroundEvents !== prevProps.backgroundEvents) {
      this.setState({ backgroundEvents: this.props.backgroundEvents });
    }

    console.log(this.state);
  }

  eventPropGetter = (event) => {
    if (event.isNew) {
      // Custom style for new events
      return {
        style: {
          backgroundColor: "#ffc839",
          color: "black", // Text color
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }
    // Default style for other events
    return {
      style: {
        backgroundColor: "#acacac",
        color: "white",
        borderRadius: "5px",
        border: "0",
        textAlign: "center",
      },
    };
  };

  render() {
    const messages = {
      next: "Вперед",
      previous: "Назад",
      today: "Сегодня",
      month: "Месяц",
      week: "Неделя",
      day: "День",
      agenda: "Расписание",
      date: "Дата",
      time: "Время",
      event: "Событие",
    };

    return (
      <div style={{ height: 550 }}>
        <Calendar
          events={this.state.events}
          backgroundEvents={this.state.backgroundEvents}
          localizer={localizer}
          messages={messages}
          step={60}
          timeslots={1}
          views={["week"]}
          defaultView="week"
          toolbar={true}
          min={new Date(1900, 9, 30, 10, 0)}
          max={new Date(2500, 9, 30, 22, 0)}
          defaultDate={new Date(1900, 0, 1)}
          popup={false}
          selectable
          onShowMore={(events, date) => this.setState({ showModal: true, events })}
          onSelectSlot={this.props.onSelectSlot}
          onSelectEvent={this.props.onSelectEvent}
          eventPropGetter={this.eventPropGetter}
        />
      </div>
    );
  }
}