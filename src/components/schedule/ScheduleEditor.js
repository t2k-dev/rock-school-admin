import React from "react";
import { getDayName } from "../../constants/days";
import { getRoomName } from "../../constants/rooms";
import { NoRecords } from "../NoRecords";
import { Button, FormLabel, RemoveItemButton } from "../ui";

const ROOM_OPTIONS = [
  { value: "", label: "выберите комнату..." },
  { value: "1", label: "Красная" },
  { value: "2", label: "Вокальная" },
  { value: "4", label: "Барабанная" },
  { value: "5", label: "Желтая" },
  { value: "6", label: "Зеленая" },
];

const DAY_OPTIONS = [
  { value: "", label: "День недели..." },
  { value: "1", label: "Понедельник" },
  { value: "2", label: "Вторник" },
  { value: "3", label: "Среда" },
  { value: "4", label: "Четверг" },
  { value: "5", label: "Пятница" },
  { value: "6", label: "Суббота" },
  { value: "0", label: "Воскресенье" },
];

const TIME_OPTIONS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

const selectClassName =
  "w-full rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[16px] text-text-main outline-none transition focus:border-white/20 focus:ring-2 focus:ring-accent";

export class ScheduleEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      periodDay: "",
      periodStart: "",
      periodEnd: "",
      roomId: 0,
    };
  }

  get periods() {
    return Array.isArray(this.props.periods) ? this.props.periods : [];
  }

  addPeriod = () => {
    const newPeriod = {
      weekDay: parseInt(this.state.periodDay),
      startTime: this.state.periodStart,
      endTime: this.state.periodEnd,
      roomId: this.state.roomId,
    };
    this.props.handlePeriodsChange([...this.periods, newPeriod]);
  };

  deletePeriod = (itemIndex) => {
    const updatedPeriods = this.periods.filter(
      (_, index) => index !== itemIndex,
    );
    this.props.handlePeriodsChange(updatedPeriods);
  };

  render() {
    const periods = this.periods;

    let periodsList;
    if (periods && periods.length > 0) {
      const sortedPeriods = [...periods].sort((a, b) => {
        // Special condition: Always place `weekDay = 0` at the end
        if (a.weekDay === 0 && b.weekDay !== 0) {
          return 1; // Move `a` to after `b`
        }

        if (b.weekDay === 0 && a.weekDay !== 0) {
          return -1; // Move `b` to after `a`
        }
        // Sort by `weekDay` first
        if (a.weekDay !== b.weekDay) {
          return a.weekDay - b.weekDay;
        }

        // If `weekDay` is the same, sort by `startTime`
        return a.startTime.localeCompare(b.startTime);
      });

      periodsList = sortedPeriods.map((item, index) => (
        <div
          key={`${item.weekDay}-${item.startTime}-${item.endTime}-${item.roomId}-${index}`}
          className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-inner-bg px-4 py-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[13px] font-semibold text-text-main">
            {index + 1}
          </div>
          <div className="grid min-w-0 flex-1 gap-3 text-[15px] text-text-main sm:grid-cols-[minmax(0,1fr)_160px_140px] sm:items-center">
            <div className="min-w-0">
              <div className="font-medium capitalize">
                {getDayName(item.weekDay)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-text-muted">
                {item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-text-muted">{getRoomName(item.roomId)}</div>
            </div>
          </div>
          <div className="shrink-0">
            <RemoveItemButton onClick={() => this.deletePeriod(index)} >
              X
            </RemoveItemButton>
          </div>
        </div>
      ));
    } else {
      periodsList = (
        <div className="rounded-[18px] border border-dashed border-white/10 bg-inner-bg px-4 py-6 text-center text-[15px] text-text-muted">
          <NoRecords />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5 rounded-[24px] p-5 sm:p-6">
        <div className="grid gap-5">
          <div className="grid gap-4 rounded-[20px] bg-inner-bg p-4 sm:grid-cols-[160px_minmax(0,1fr)_auto] sm:items-end">
            <label className="flex flex-col gap-3 sm:col-span-3">
              <FormLabel>Новый слот</FormLabel>
              <select
                aria-label="Выберите комнату"
                value={this.state.roomId}
                onChange={(e) => this.setState({ roomId: e.target.value })}
                className={selectClassName}
              >
                {ROOM_OPTIONS.map((option) => (
                  <option key={option.value || "empty-room"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-3">
              <select
                aria-label="Выберите день"
                value={this.state.periodDay}
                onChange={(e) => this.setState({ periodDay: e.target.value })}
                className={selectClassName}
              >
                {DAY_OPTIONS.map((option) => (
                  <option key={option.value || "empty-day"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
              <div className="pb-3 text-center text-[14px] font-medium text-text-muted">с</div>
              <label className="flex flex-col gap-3">
                <select
                  aria-label="Время начала"
                  value={this.state.periodStart}
                  onChange={(e) => this.setState({ periodStart: e.target.value })}
                  className={selectClassName}
                >
                  <option value="">чч:мм</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>

              <div className="pb-3 text-center text-[14px] font-medium text-text-muted">по</div>

              <label className="flex flex-col gap-3">
                <select
                  aria-label="Время окончания"
                  value={this.state.periodEnd}
                  onChange={(e) => this.setState({ periodEnd: e.target.value })}
                  className={selectClassName}
                >
                  <option value="">чч:мм</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Button variant="outlineSuccess" onClick={this.addPeriod} className="sm:self-end">
              +
            </Button>
          </div>
          <div className="flex flex-col gap-3">{periodsList}</div>
        </div>
      </div>
    );
  }
}
