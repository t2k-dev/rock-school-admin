import moment from "moment";
import "moment/locale/ru";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { applyCalendarStyle } from "../../../utils/calendar";
import { DisciplineIcon } from "../../common/DisciplineIcon";

moment.locale("ru");
const localizer = momentLocalizer(moment);

const EventComponent = ({ event }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop:"5px", marginLeft:"5px" }}>
      {event.disciplineId && <DisciplineIcon disciplineId={event.disciplineId} color="white"/>}
      <span style={{marginLeft:"10px"}}>{event.title}</span> 
      
    </div>
  );
};

export class CalendarWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      backgroundEvents: this.props.backgroundEvents,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.events !== prevProps.events) {
      this.setState({ events: this.props.events });
    }
    if (this.props.backgroundEvents !== prevProps.backgroundEvents) {
      this.setState({ backgroundEvents: this.props.backgroundEvents });
    }
  }

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
          defaultDate={Date.now()}
          popup={false}
          selectable
          onShowMore={(events, date) => this.setState({ showModal: true, events })}
          onSelectSlot={this.props.onSelectSlot}
          onSelectEvent={this.props.onSelectEvent}
          eventPropGetter={(event) => applyCalendarStyle(event)}
          components={{event: EventComponent}}
        />
      </div>
    );
  }
}
