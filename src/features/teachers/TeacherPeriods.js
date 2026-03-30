import React from "react";
import { ScheduleEditor } from "../../components/schedule/ScheduleEditor";
import { Button, FormWrapper } from "../../components/ui";
import { SectionTitle, SectionWrapper } from "../../layout";
import { getTeacher, saveWorkingPeriods } from "../../services/apiTeacherService";

export class TeacherPeriods extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherId: null,
      teacherName: "",
      workingPeriods: [],
      periodsChanged: false,
      isLoading: true,
    };

    this.handlePeriodsChange = this.handlePeriodsChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const teacherId = this.props.match.params.id;
    
    this.setState({ isLoading: true });
    try {
      const [teacher] = await Promise.all([
        getTeacher(teacherId),
      ]);

      this.setState({
        teacherId,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        workingPeriods: teacher.workingPeriods || [],
        periodsChanged: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      this.setState({ isLoading: false });
    }
  }

  handlePeriodsChange = (periods) => {
    this.setState({ workingPeriods: periods, periodsChanged: true });
  };

  handleSave = async () => {
    const { teacherId, workingPeriods } = this.state;

    try {
      await saveWorkingPeriods(teacherId, workingPeriods);
      this.props.history.push(`/teacher/${teacherId}`);
    } catch (error) {
      console.error("Error saving working periods:", error);
    }
  };

  render() {
    const { teacherName, workingPeriods, periodsChanged, isLoading } = this.state;

    return (
      <SectionWrapper>
        <SectionTitle className="text-center">
          Расписание{teacherName ? `: ${teacherName}` : ""}
        </SectionTitle>

        <FormWrapper>
          {isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-[20px] border border-white/10 bg-inner-bg px-6 py-10 text-[15px] text-text-muted">
              Загрузка...
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <ScheduleEditor
                periods={workingPeriods}
                handlePeriodsChange={this.handlePeriodsChange}
              />

              <div className="h-px bg-white/10" />

              <div className="text-center">
                <Button
                  onClick={this.handleSave}
                  disabled={!periodsChanged}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </FormWrapper>
      </SectionWrapper>
    );
  }
}

export default TeacherPeriods;
