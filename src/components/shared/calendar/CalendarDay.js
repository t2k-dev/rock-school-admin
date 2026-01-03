import moment from "moment";
import "moment/locale/ru";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { applyCalendarStyle } from "../../../utils/calendar";
import { DisciplineIcon } from "../discipline/DisciplineIcon";


moment.locale("ru");
const localizer = momentLocalizer(moment);

const EventComponent = ({ event }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop:"5px", marginLeft:"5px" }}>
      <DisciplineIcon 
        disciplineId={event.disciplineId} 
        color={event.isTrial ? "black" : "white"}
        />
      <span style={{marginLeft:"10px"}}>{event.title}</span> 
      
    </div>
  );
};

export class CalendarDay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      backgroundEvents: this.props.backgroundEvents,
    };
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
    const resources = [
      { resourceId: 1, resourceTitle: "Гитарная" },
      { resourceId: 2, resourceTitle: "Вокальная" },
      { resourceId: 4, resourceTitle: "Барабанная" },
      { resourceId: 5, resourceTitle: "Жёлтая" },
      { resourceId: 6, resourceTitle: "Зелёная" },
    ];

    return (
      <div style={{ height: 550 }}>
        <Calendar
          events={this.props.events}
          localizer={localizer}
          views={["day", "week", "month"]}
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
          eventPropGetter={(event) => applyCalendarStyle(event)}
          onSelectEvent={this.props.onSelectEvent}
          components={{event: EventComponent}}
        />
      </div>
    );
  }
}
