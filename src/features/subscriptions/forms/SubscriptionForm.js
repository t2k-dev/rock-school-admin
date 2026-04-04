import { format } from "date-fns";
import React from "react";

import { Loading } from "../../../components/Loading";
import { ScheduleEditorWithDelete } from "../../../components/schedule/ScheduleEditorWithDelete";
import { Button, FormLabel, FormWrapper, Input } from "../../../components/ui";
import { getAttendanceLengthName } from "../../../constants/AttendanceLength";
import AttendanceType from "../../../constants/AttendanceType";
import SubscriptionType from "../../../constants/SubscriptionType";
import { SectionTitle, SectionWrapper } from "../../../layout";
import { getStudent } from "../../../services/apiStudentService";
import { addSubscription } from "../../../services/apiSubscriptionService";
import { getCurrentTariffs } from "../../../services/apiTariffService";
import {
  getAvailableTeachers,
  getWorkingPeriods,
} from "../../../services/apiTeacherService";
import { calculateAge } from "../../../utils/dateTime";
import { toMoneyString } from "../../../utils/moneyUtils";
import { convertSlotsToSchedules } from "../../../utils/scheduleUtils";
import { AvailableTeachersModal } from "../../attendances/AvailableTeachersModal";
import { DisciplinePlate } from "../../disciplines/DisciplinePlate";
import { DisciplineSelectionModal } from "../../disciplines/DisciplineSelectionModal";
import { AddStudentModal } from "../../students/AddStudentModal";
import TariffCard from "../../tariffs/TariffCard";
import { SubscriptionStudents } from "../SubscriptionStudents";

export class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type === "New",
      basedOnSubscriptionId: null,
      studentId: this.props.match.params.id,
      student: null,
      students: [],

      disciplineId: null,
      teacherId: "",
      selectedTeachers: [],
      availableTeachers: [],

      startDate: format(new Date(), "yyyy-MM-dd"),
      attendanceCount: "",
      attendanceLength: 0,

      tariffs: [],
      selectedTariff: null,

      schedules: [],

      isLoading: false,
      showAvailableTeacherModal: false,
      showAddStudentModal: false,
      showDisciplineModal: false,
    };

    // AvailableTeachersModal
    this.showAvailableTeachersModal =
      this.showAvailableTeachersModal.bind(this);
    this.handleCloseAvailableTeachersModal =
      this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showDisciplineModal = this.showDisciplineModal.bind(this);
    this.handleCloseDisciplineModal =
      this.handleCloseDisciplineModal.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    this.setState({ isLoading: true });

    // New
    if (this.state.isNew) {
      // Based on prev subscription
      if (
        this.props.location.state &&
        this.props.location.state.baseSubscription
      ) {
        const baseSubscription = this.props.location.state.baseSubscription;

        const student = await getStudent(this.state.studentId);
        const students = student ? [student] : [];

        this.setState({
          students: students || [],
          disciplineId: baseSubscription.disciplineId || null,
          attendanceCount:
            baseSubscription.attendanceType === AttendanceType.TRIAL_LESSON
              ? null
              : baseSubscription.attendanceCount,
          attendanceLength: baseSubscription.attendanceLength || 0,
          selectedTeachers: [baseSubscription.teacher] || [],
          teacher: baseSubscription.teacher || null,
          teacherId: baseSubscription.teacher.teacherId || "",
          schedules: baseSubscription.schedules || [],
          basedOnSubscriptionId: baseSubscription.subscriptionId || null,
          isLoading: false,
        });

        // Load tariffs for discipline
        this.loadTariffs();
      } else {
        const student = await getStudent(this.state.studentId);
        const students = student ? [student] : [];

        this.setState({
          students: students,
          disciplineId: this.props.location.state.disciplineId,
          isLoading: false,
        });

        // Load tariffs for discipline
        this.loadTariffs();
      }

      return;
    }

    // Edit
  }

  loadTariffs = async () => {
    try {
      // Load all tariffs for lessons
      const tariffs = await getCurrentTariffs();
      this.setState({ tariffs: tariffs || [] });
    } catch (error) {
      console.error("Error loading tariffs:", error);
    }
  };

  // AddStudentModal
  showAddStudentModal = async (e) => {
    e.preventDefault();

    this.setState({
      showAddStudentModal: true,
    });
  };

  handleAddStudent = (newStudent) => {
    this.setState((prevState) => ({
      students: [...prevState.students, newStudent],
    }));

    this.getFilteredTariffs();
  };

  handleCloseAddStudentModal = () => {
    this.setState({ showAddStudentModal: false });
  };

  // AvailableTeachersModal
  showAvailableTeachersModal = async (e) => {
    e.preventDefault();

    let teachers;
    if (this.state.teacher) {
      // TODO: refactor for non array
      const response = await getWorkingPeriods(this.state.teacher.teacherId);
      teachers = response.data?.teacher ? [response.data.teacher] : [];
    } else {
      // TODO: branchId
      const sortedStudents = this.sortStudentsByBirthDate(this.state.students);
      const age = calculateAge(sortedStudents[0].birthDate);

      const response = await getAvailableTeachers(
        this.state.disciplineId,
        age,
        1,
      );
      teachers = response.data.availableTeachers;
    }

    this.setState({
      availableTeachers: teachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    if (!this.state.availableSlots || this.state.availableSlots.length === 0) {
      this.setState({
        showAvailableTeacherModal: false,
        teacherId: "",
        selectedTeachers: [],
      });
      return;
    }

    const selectedTeacherIds = Array.from(
      new Set(this.state.availableSlots.map((slot) => slot.teacherId)),
    );
    const selectedTeachers = this.state.availableTeachers.filter((teacher) =>
      selectedTeacherIds.includes(teacher.teacherId),
    );
    const newSelectedTeacherId =
      selectedTeachers.length > 0 && selectedTeachers[0].teacherId;

    this.setState({
      showAvailableTeacherModal: false,
      teacherId: newSelectedTeacherId,
      selectedTeachers: selectedTeachers,
    });
  };

  handleSlotsChange = (slots) => {
    const schedules = convertSlotsToSchedules(slots, {
      includeTeacherId: true,
    });
    this.setState({ availableSlots: slots, schedules: schedules });
  };

  handleTariffChange = (tariffId) => {
    const selectedTariff = this.state.tariffs.find(
      (tariff) => tariff.tariffId === tariffId,
    );
    if (selectedTariff) {
      this.setState({
        selectedTariff: selectedTariff,
        attendanceCount: selectedTariff.attendanceCount,
        attendanceLength: selectedTariff.attendanceLength,
      });
    }
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleDisciplineChange = (disciplineId) => {
    this.setState({
      disciplineId: disciplineId,
      availableSlots: [],
      selectedSlotId: 0,
      showDisciplineModal: false,
      selectedTariff: null,
      attendanceCount: "",
      attendanceLength: 0,
    });
  };

  handleTariffChange = (tariffId) => {
    const selectedTariff = this.state.tariffs.find(
      (tariff) => tariff.tariffId === tariffId,
    );
    if (selectedTariff) {
      this.setState({
        selectedTariff: selectedTariff,
        attendanceCount: selectedTariff.attendanceCount,
        attendanceLength: selectedTariff.attendanceLength,
      });
    }
  };

  // Discipline Modal methods
  showDisciplineModal = () => {
    this.setState({ showDisciplineModal: true });
  };

  handleCloseDisciplineModal = () => {
    this.setState({ showDisciplineModal: false });
  };

  onChange = (periods) => {
    this.setState({ schedules: periods });
  };

  sortStudentsByBirthDate = (students) => {
    return [...students].sort((a, b) => {
      if (!a.birthDate || !b.birthDate) return 0;
      return new Date(b.birthDate) - new Date(a.birthDate);
    });
  };

  deleteStudent = (index) => {
    const updatedStudents = [...this.state.students];
    updatedStudents.splice(index, 1);
    this.setState({ students: updatedStudents });
  };

  handleSave = async (e) => {
    e.preventDefault();

    // Parse yyyy-MM-dd format to Date object for backend
    const startDate = new Date(this.state.startDate);

    let studentIds = [];
    this.state.students.forEach((student) => {
      studentIds.push(student.studentId);
    });

    const requestBody = {
      studentIds: studentIds,
      subscription: {
        disciplineId: this.state.disciplineId,
        teacherId: this.state.teacherId,
        attendanceCount: this.state.attendanceCount,
        attendanceLength: this.state.attendanceLength,
        startDate: format(startDate, "yyyy.MM.dd"),
        branchId: 1,

        tariffId: this.state.selectedTariff.tariffId,
        price: this.state.selectedTariff.amount,
        amountOutstanding: this.state.selectedTariff.amount,
        finalPrice: this.state.selectedTariff.amount,
      },
      schedules: this.state.schedules,
    };

    await addSubscription(requestBody);

    this.props.history.push(`/student/${this.state.studentId}`);
  };

  getFilteredTariffs = () => {
    const { tariffs, disciplineId, students } = this.state;
    if (!disciplineId) return tariffs;

    let availableTariffs = [];
    if (students.length > 1) {
      //console.log("Filtering for group lesson, subscriptionType:", tariff.subscriptionType);
      console.log("Filtering for group lesson, disciplineId: ", disciplineId);
      // Group Lessons
      const disciplineTariffs = tariffs.filter(
        (tariff) =>
          tariff.disciplineId === parseInt(disciplineId) &&
          tariff.subscriptionType === SubscriptionType.GROUP_LESSON,
      );
      console.log("Discipline tariffs: ", disciplineTariffs);
      if (disciplineTariffs.length > 0) {
        availableTariffs = disciplineTariffs;
      } else {
        availableTariffs = tariffs.filter(
          (tariff) => tariff.subscriptionType === SubscriptionType.GROUP_LESSON,
        );
      }
    } else {
      // Single Lessons
      const disciplineTariffs = tariffs.filter(
        (tariff) =>
          tariff.disciplineId === parseInt(disciplineId) &&
          tariff.subscriptionType === SubscriptionType.LESSON,
      );

      if (disciplineTariffs.length > 0) {
        availableTariffs = disciplineTariffs;
      } else {
        availableTariffs = tariffs.filter(
          (tariff) =>
            tariff.subscriptionType === SubscriptionType.LESSON &&
            tariff.disciplineId === null,
        );
      }
    }
    console.log("all: ", tariffs);
    console.log("availableTariffs: ", availableTariffs);
    return availableTariffs;
  };

  render() {
    const {
      isNew,
      isLoading,
      disciplineId,
      students,
      teacherId,
      basedOnSubscriptionId,
      attendanceCount,
      attendanceLength,
      startDate,
      schedules,
      availableTeachers,
      selectedTeachers,
      showAvailableTeacherModal,
      showAddStudentModal,
      showDisciplineModal,
      selectedTariff,
    } = this.state;

    const filteredTariffs = this.getFilteredTariffs();

    if (isLoading) {
      return <Loading message="Загрузка данных..." />;
    }

    let filteredSchedules;
    if (schedules && schedules.length > 0) {
      if (basedOnSubscriptionId != null) {
        filteredSchedules = schedules;
      } else {
        filteredSchedules = schedules.filter(
          (schedule) => schedule.teacherId === teacherId,
        );
      }
    }

    const selectClassName =
      "w-full rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[16px] text-text-main outline-none transition focus:border-white/20 focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60";

    return (
      <SectionWrapper>
        <SectionTitle className="text-center">
          {isNew ? "Новый абонемент" : "Редактировать абонемент"}
        </SectionTitle>

        <FormWrapper>
          <form onSubmit={this.handleSave} className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-3">
              <FormLabel>Направление</FormLabel>
              <button
                type="button"
                onClick={
                  basedOnSubscriptionId === null
                    ? this.showDisciplineModal
                    : undefined
                }
                disabled={basedOnSubscriptionId !== null}
                className={`text-left transition p-0 ${basedOnSubscriptionId === null ? "cursor-pointer" : "cursor-default"}`}
                style={{ background: "none", border: "none" }}
              >
                <DisciplinePlate disciplineId={disciplineId} size="fill" />
              </button>
            </div>

            <div className="h-px bg-white/10" />

            <SubscriptionStudents
              students={students}
              onAddStudent={this.showAddStudentModal}
              allowAdd={basedOnSubscriptionId === null}
              allowRemove={basedOnSubscriptionId === null}
              onRemoveStudent={this.deleteStudent}
            />

            <AddStudentModal
              show={showAddStudentModal}
              handleClose={this.handleCloseAddStudentModal}
              onAddStudent={this.handleAddStudent}
            />

            <div className="h-px bg-white/10" />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:items-start">
              <div className="flex flex-col gap-5">
                <label className="flex flex-col gap-3">
                  <FormLabel>Дата начала</FormLabel>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate || ""}
                    onChange={(e) =>
                      this.setState({ startDate: e.target.value })
                    }
                  />
                </label>

                <label className="flex flex-col gap-3">
                  <FormLabel>Тариф</FormLabel>
                  <select
                    aria-label="Выберите тариф"
                    value={selectedTariff?.tariffId || ""}
                    onChange={(e) => this.handleTariffChange(e.target.value)}
                    disabled={!disciplineId || filteredTariffs.length === 0}
                    className={selectClassName}
                  >
                    <option value="">выберите тариф...</option>
                    {filteredTariffs.map((tariff) => (
                      <option key={tariff.tariffId} value={tariff.tariffId}>
                        {tariff.attendanceCount} уроков,{" "}
                        {getAttendanceLengthName(tariff.attendanceLength)} -{" "}
                        {toMoneyString(tariff.amount)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <TariffCard
                title="Тариф"
                description={
                  selectedTariff
                    ? `${selectedTariff.attendanceCount} уроков, ${getAttendanceLengthName(selectedTariff.attendanceLength)}`
                    : "Урок"
                }
                amount={selectedTariff ? selectedTariff.amount : 0}
                showIcon={false}
              />
            </div>

            <div className="h-px bg-white/10" />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <label className="flex flex-col gap-3">
                <FormLabel>Преподаватель</FormLabel>
                <select
                  aria-label="Выберите преподавателя"
                  value={teacherId}
                  onChange={(e) => this.setState({ teacherId: e.target.value })}
                  disabled={!teacherId}
                  className={selectClassName}
                >
                  <option value="">выберите...</option>
                  {selectedTeachers.map((teacher, index) => (
                    <option key={index} value={teacher.teacherId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </label>

              <Button
                variant="ghost"
                type="button"
                onClick={this.showAvailableTeachersModal}
                disabled={!disciplineId}
                className="lg:min-w-[220px]"
              >
                Доступные окна...
              </Button>
            </div>

            <AvailableTeachersModal
              show={showAvailableTeacherModal}
              teachers={availableTeachers}
              onSlotsChange={this.handleSlotsChange}
              onClose={this.handleCloseAvailableTeachersModal}
            />

            <DisciplineSelectionModal
              show={showDisciplineModal}
              onHide={this.handleCloseDisciplineModal}
              selectedDisciplineId={disciplineId}
              onDisciplineChange={this.handleDisciplineChange}
            />

            <div className="h-px bg-white/10" />

            <div className="flex flex-col gap-4">
              <ScheduleEditorWithDelete
                schedules={filteredSchedules}
                onChange={this.onChange}
                attendanceLength={attendanceLength}
              />
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-center">
              <Button type="submit" size="lg" className="min-w-[220px]">
                Сохранить
              </Button>
            </div>
          </form>
        </FormWrapper>
      </SectionWrapper>
    );
  }
}
