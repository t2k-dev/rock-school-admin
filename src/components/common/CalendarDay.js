import React from "react";
import { render } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ru";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
      { resourceId: 1, resourceTitle: 'Гитарная' },
      { resourceId: 2, resourceTitle: 'Вокальная' },
      { resourceId: 3, resourceTitle: 'Барабанная' },
      { resourceId: 4, resourceTitle: 'Жёлтая' },
      { resourceId: 5, resourceTitle: 'Зелёная' },
    ]
    return (
      
      <div style={{ height: 550 }}>
        <Calendar
          events={this.state.events}
          backgroundEvents={this.props.backgroundEvents}
          localizer={localizer}
          //step={60}
          views={["day"]}
          defaultView="day"
          //toolbar={false}
          /*views = {{
                month: false,
                week: true,
              }}*/
          min={new Date(1900, 9, 30, 10, 0)}
          max={new Date(2500, 9, 30, 22, 0)}
          //defaultDate={new Date(2015, 3, 9)}
          defaultDate={new Date(1900, 0, 1)}
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