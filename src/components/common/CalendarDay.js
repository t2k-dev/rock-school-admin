import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ru";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AttendanceStatus from "../constants/AttendanceStatus";

moment.locale("ru");
const localizer = momentLocalizer(moment);

export class CalendarDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      backgroundEvents: this.props.backgroundEvents,
    };
  }

  eventPropGetter = (event) => {
    if (event.isTrial === true) {
      return {
        style: {
          backgroundColor: "#e1da77",
          color: "black",
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }

    if (event.status === AttendanceStatus.NEW) {
      return {
        style: {
          backgroundColor: "#697ac9",
          color: "white",
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }

    if (event.status === AttendanceStatus.ATTENDED) {
      return {
        style: {
          backgroundColor: "#8d9bdd",
          color: "white",
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }
    
    if (event.status === AttendanceStatus.MISSED) {
      return {
        style: {
          backgroundColor: "#ce6868",
          color: "white",
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }
    if (event.status === AttendanceStatus.CANCELED_BY_STUDENT) {
      return {
        style: {
          backgroundColor: "#949494",
          color: "white",
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }
    if (event.status === AttendanceStatus.CANCELED_BY_TEACHER) {
      return {
        style: {
          backgroundColor: "#646464",
          color: "white",
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }



    return {
      style: {
        backgroundColor: "red",
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
    const resources = [
      { resourceId: 1, resourceTitle: "Гитарная" },
      { resourceId: 2, resourceTitle: "Вокальная" },
      { resourceId: 3, resourceTitle: "Барабанная" },
      { resourceId: 4, resourceTitle: "Жёлтая" },
      { resourceId: 5, resourceTitle: "Зелёная" },
    ];

    return (
      <div style={{ height: 550 }}>
        <Calendar
          events={this.props.events}
          localizer={localizer}
          views={["day"]}
          defaultView="day"
          min={new Date(1900, 9, 30, 10, 0)}
          max={new Date(2500, 9, 30, 22, 0)}
          defaultDate={Date.now()}
          popup={false}
          onShowMore={(events, date) => this.setState({ showModal: true, events })}
          messages={messages}
          resources={resources}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          resourceGroupingLayout={false}
          now={() => new Date()}
          eventPropGetter={this.eventPropGetter}
          onSelectEvent={this.props.onSelectEvent}
        />
      </div>
    );
  }
}
