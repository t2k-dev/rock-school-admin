import React from "react";
import { getDayName } from "../../constants/days";
import { getRoomName } from "../../constants/rooms";
import { CalendarIcon } from "../icons/Icons/CalendarIcon";
import { NoRecords } from "../NoRecords";

export class ScheduleEditorWithDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: this.props.schedules,
      selectedSlotId: 0,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.schedules !== prevProps.schedules) {
      this.setState({ schedules: this.props.schedules });
    }
  }

  deleteRecord = (itemIndex) => {
    this.setState(
      (prevState) => ({
        schedules: prevState.schedules.filter(
          (_, index) => index !== itemIndex,
        ),
      }),
      () => this.props.onChange(this.state.schedules),
    );
  };

  render() {
    const { schedules } = this.state;

    let schedulesList;
    if (schedules && schedules.length > 0) {
      schedulesList = (
        <div
          className="flex flex-col gap-3 mt-4"
          style={{ background: "none" }}
        >
          {schedules.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-4 p-4 rounded-[18px] border border-white/5 bg-white/5 transition-all hover:bg-white/10"
              style={{ background: "none" }}
            >
              {/* Номер строки */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-text-muted text-sm font-medium">
                {index + 1}
              </div>

              {/* Информация о расписании */}
              <div className="flex-grow text-[15px] text-text-main font-medium">
                {`${getDayName(item.weekDay)} в ${item.startTime}`}
                <span className="ml-2 opacity-40 font-normal">
                  ({getRoomName(item.roomId)})
                </span>
              </div>

              <button
                type="button"
                onClick={() => this.deleteRecord(index)}
                className="flex items-center justify-center w-8 h-8 rounded-full text-danger/40 hover:bg-danger transition-all"
                style={{ background: "none" }}
              >
                <span className="text-[12px] leading-none text-text-main">
                  ✕
                </span>
              </button>
            </div>
          ))}
        </div>
      );
    } else {
      schedulesList = <NoRecords />;
    }

    return (
      <div className="mb-6" style={{ background: "none" }}>
        <div className="flex items-center gap-2 text-text-main font-semibold text-[17px] mb-4">
          <CalendarIcon className="opacity-60" />
          <span>Расписание</span>
        </div>
        <div className="w-full" style={{ background: "none" }}>
          {schedulesList}
        </div>
      </div>
    );
  }
}
