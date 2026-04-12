import React from "react";
import { ScheduleEditorNoRoom } from "../../components/schedule/ScheduleEditorNoRoom";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { Select } from "../../components/ui/Select";

interface Teacher {
  teacherId: string | number;
  firstName: string;
  lastName: string;
}

interface WaitingScheduleProps {
  type: "New" | "Edit";
}

interface WaitingScheduleState {
  isNew: boolean;
  student: any;
  disciplineId: string | number | undefined;
  teacherId: string | number | undefined;
  teachers: Teacher[];
  waitingSchedules: any[];
}

export class WaitingScheduleForm extends React.Component<
  WaitingScheduleProps,
  WaitingScheduleState
> {
  constructor(props: WaitingScheduleProps) {
    super(props);

    this.state = {
      isNew: props.type === "New",
      student: null,
      disciplineId: undefined,
      teacherId: undefined,
      teachers: [],
      waitingSchedules: [],
    };
  }

  handlePeriodsChange = (periods: any[]) => {
    this.setState({ waitingSchedules: periods });
  };

  handleSave = () => {
    console.log("Saving...", this.state);
  };

  render() {
    const { disciplineId, teacherId, teachers, isNew, waitingSchedules } =
      this.state;

    const disciplineOptions = [
      { value: "1", label: "Гитара" },
      { value: "2", label: "Электро гитара" },
      { value: "3", label: "Бас гитара" },
      { value: "4", label: "Укулеле" },
      { value: "5", label: "Вокал" },
      { value: "6", label: "Барабаны" },
      { value: "7", label: "Фортепиано" },
      { value: "8", label: "Скрипка" },
      { value: "9", label: "Экстрим вокал" },
    ];

    const teacherOptions = teachers.map((t) => ({
      value: t.teacherId.toString(),
      label: `${t.firstName} ${t.lastName}`,
    }));

    return (
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full max-w-xl">
          <Container className="p-8">
            <h2 className="text-2xl font-bold mb-8 text-center text-text-main">
              {isNew ? "Предзапись" : "Редактировать предзапись"}
            </h2>

            <div className="space-y-6">
              <Select
                label="Направление"
                value={disciplineId || ""}
                options={disciplineOptions}
                onChange={(name, value) =>
                  this.setState({ disciplineId: value })
                }
                name="discipline"
              />

              <Select
                label="Преподаватель"
                value={teacherId || ""}
                options={teacherOptions}
                onChange={(name, value) => this.setState({ teacherId: value })}
                name="teacher"
              />

              <div className="py-2">
                <ScheduleEditorNoRoom
                  periods={waitingSchedules}
                  handlePeriodsChange={this.handlePeriodsChange}
                />
              </div>

              <div className="border-t border-white/5 pt-6">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={this.handleSave}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default WaitingScheduleForm;
