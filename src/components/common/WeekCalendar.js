import React from "react";
import { render } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ru";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("ru");
const localizer = momentLocalizer(moment);

//const allViews = Object.keys(Calendar.Views).map(k => Calendar.Views[k]);
const backgroundEvents = [
  {
    title: "",
    start: new Date(1900, 0, 2, 11, 0, 0, 0),
    end: new Date(1900, 0, 2, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 2, 16, 0, 0, 0),
    end: new Date(1900, 0, 2, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 3, 10, 0, 0, 0),
    end: new Date(1900, 0, 3, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 3, 16, 0, 0, 0),
    end: new Date(1900, 0, 3, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 4, 10, 0, 0, 0),
    end: new Date(1900, 0, 4, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 4, 16, 0, 0, 0),
    end: new Date(1900, 0, 4, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 7, 10, 0, 0, 0),
    end: new Date(1900, 0, 7, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 7, 16, 0, 0, 0),
    end: new Date(1900, 0, 7, 21, 0, 0, 0),
  },
];

const events = [
  {
    title: "Алексей Кутузов",
    start: new Date(1900, 0, 2, 11, 0, 0, 0),
    end: new Date(1900, 0, 2, 12, 0, 0, 0),
  },
  {
    title: "Роман Камалиев",
    start: new Date(1900, 0, 2, 12, 0, 0, 0),
    end: new Date(1900, 0, 2, 13, 0, 0, 0),
  },
];

class WeekCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      backgroundEvents: this.props.backgroundEvents,
    };
  }

  render() {
    console.log('Render Cal Week');
    console.log(this.props.backgroundEvents)
    return (
      
      <div style={{ height: 550 }}>
        <Calendar
          events={this.state.events}
          backgroundEvents={this.props.backgroundEvents}
          localizer={localizer}
          //step={60}
          views={["month", "week"]}
          defaultView="week"
          toolbar={false}
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
        />
      </div>
    );
  }
}

export default WeekCalendar;