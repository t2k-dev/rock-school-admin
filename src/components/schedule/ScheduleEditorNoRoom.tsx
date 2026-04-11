import React from "react";
import { Button, Select, FormLabel } from "../ui";
import { CalendarIcon } from "../icons/Icons/CalendarIcon";

interface Period {
  weekDay: number;
  startTime: string;
  endTime: string;
}

interface ScheduleEditorProps {
  periods: Period[];
  handlePeriodsChange: (periods: Period[]) => void;
}

interface ScheduleEditorState {
  periods: Period[];
  periodDay: string;
  periodStart: string;
  periodEnd: string;
  roomId: string;
}

export class ScheduleEditorNoRoom extends React.Component<
  ScheduleEditorProps,
  ScheduleEditorState
> {
  constructor(props: ScheduleEditorProps) {
    super(props);
    this.state = {
      periods: this.props.periods || [],
      periodDay: "",
      periodStart: "",
      periodEnd: "",
      roomId: "",
    };
  }

  componentDidUpdate(prevProps: ScheduleEditorProps) {
    if (this.props.periods !== prevProps.periods) {
      this.setState({ periods: this.props.periods });
    }
  }

  handleSelectChange = (name: string, value: string | number) => {
    this.setState({ [name]: value } as unknown as Pick<
      ScheduleEditorState,
      keyof ScheduleEditorState
    >);
  };

  addPeriod = () => {
    const { periodDay, periodStart, periodEnd, periods } = this.state;
    if (!periodDay || !periodStart || !periodEnd) return;

    const newPeriod: Period = {
      weekDay: parseInt(periodDay),
      startTime: periodStart,
      endTime: periodEnd,
    };

    const updatedPeriods = [...periods, newPeriod];
    this.setState({ periods: updatedPeriods }, () => {
      this.props.handlePeriodsChange(updatedPeriods);
    });
  };

  deletePeriod = (itemIndex: number) => {
    const updatedPeriods = this.state.periods.filter(
      (_, index) => index !== itemIndex,
    );
    this.setState({ periods: updatedPeriods }, () => {
      this.props.handlePeriodsChange(updatedPeriods);
    });
  };

  getDayName = (dayIndex: number): string => {
    const days: Record<number, string> = {
      1: "Понедельник",
      2: "Вторник",
      3: "Среда",
      4: "Четверг",
      5: "Пятница",
      6: "Суббота",
      0: "Воскресенье",
    };
    return days[dayIndex] || "";
  };

  render() {
    const { periods, roomId, periodDay, periodStart, periodEnd } = this.state;

    const sortedPeriods = [...periods].sort((a, b) => {
      if (a.weekDay === 0 && b.weekDay !== 0) return 1;
      if (b.weekDay === 0 && a.weekDay !== 0) return -1;
      return a.weekDay !== b.weekDay
        ? a.weekDay - b.weekDay
        : a.startTime.localeCompare(b.startTime);
    });

    const timeOptions = [
      { value: "10:00", label: "10:00" },
      { value: "11:00", label: "11:00" },
      { value: "12:00", label: "12:00" },
      { value: "13:00", label: "13:00" },
      { value: "14:00", label: "14:00" },
      { value: "15:00", label: "15:00" },
      { value: "16:00", label: "16:00" },
      { value: "17:00", label: "17:00" },
      { value: "18:00", label: "18:00" },
      { value: "19:00", label: "19:00" },
      { value: "20:00", label: "20:00" },
      { value: "21:00", label: "21:00" },
    ];

    const dayOptions = [
      { value: "1", label: "Понедельник" },
      { value: "2", label: "Вторник" },
      { value: "3", label: "Среда" },
      { value: "4", label: "Четверг" },
      { value: "5", label: "Пятница" },
      { value: "6", label: "Суббота" },
      { value: "0", label: "Воскресенье" },
    ];

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <FormLabel className="flex items-center gap-2 font-bold text-lg opacity-100">
            <CalendarIcon /> Расписание
          </FormLabel>

          <Select
            label="Комната"
            name="roomId"
            value={roomId}
            options={[
              { value: "1", label: "Красная" },
              { value: "2", label: "Вокальная" },
              { value: "4", label: "Барабанная" },
              { value: "5", label: "Желтая" },
              { value: "6", label: "Зеленая" },
            ]}
            onChange={this.handleSelectChange}
          />
        </div>

        <div className="flex flex-col gap-4 p-6 bg-inner-bg rounded-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select
              label="День недели"
              name="periodDay"
              value={periodDay}
              options={dayOptions}
              onChange={this.handleSelectChange}
            />
            <Select
              label="С"
              name="periodStart"
              value={periodStart}
              options={timeOptions}
              onChange={this.handleSelectChange}
            />
            <Select
              label="По"
              name="periodEnd"
              value={periodEnd}
              options={timeOptions}
              onChange={this.handleSelectChange}
            />
          </div>
          <Button variant="success" onClick={this.addPeriod} className="w-full">
            Добавить время в расписание
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {sortedPeriods.length > 0 ? (
            sortedPeriods.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-card-bg rounded-2xl border border-secondary/10"
              >
                <div className="flex items-center gap-4">
                  <span className="text-text-muted font-bold w-6">
                    {index + 1}
                  </span>
                  <span className="text-text-main font-medium">
                    {this.getDayName(item.weekDay)}
                  </span>
                  <span className="bg-accent/20 text-accent px-3 py-1 rounded-lg text-sm">
                    {item.startTime.substring(0, 5)} —{" "}
                    {item.endTime.substring(0, 5)}
                  </span>
                </div>
                <Button
                  variant="outlineDanger"
                  size="sm"
                  onClick={() => this.deletePeriod(index)}
                  className="rounded-full w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center p-8 text-text-muted bg-card-bg rounded-2xl opacity-50">
              Нет записей в расписании
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ScheduleEditorNoRoom;
