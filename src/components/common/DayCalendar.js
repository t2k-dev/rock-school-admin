import React from "react";
import { render } from "react-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ru";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("ru");
const localizer = momentLocalizer(moment);

class DayCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      backgroundEvents: this.props.backgroundEvents,
    };
  }

  render() {
    return (
      
      <div style={{ height: 550 }}>
        <Calendar
          events={this.state.events}
          backgroundEvents={this.props.backgroundEvents}
          localizer={localizer}
          //step={60}
          views={["month", "week", "day"]}
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
        />
      </div>
    );
  }
}

export default DayCalendar;