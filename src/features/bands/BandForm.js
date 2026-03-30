import React from "react";

import { Loading } from "../../components/Loading";
import { ScheduleEditorWithDelete } from "../../components/schedule/ScheduleEditorWithDelete";
import { Button, FormWrapper, Input } from "../../components/ui";
import { SectionTitle, SectionWrapper } from "../../layout";
import { addBand } from "../../services/apiBandService";
import { getAvailableTeachers, getRehearsableTeachers, getWorkingPeriods } from "../../services/apiTeacherService";
import { calculateAge } from "../../utils/dateTime";
import { convertSlotsToSchedules } from "../../utils/scheduleUtils";
import { AvailableTeachersModal } from "../attendances/AvailableTeachersModal";
import { AddStudentModal } from "../students/AddStudentModal";
import { BandStudents } from "./BandStudents";

export class BandForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: props.type === "New",
      
      name: "",
      teacherId: "",
      teacher: null,
      
      students: [],
      scheduleSlots: [],
      
      teachers: [],
      availableTeachers: [],
      selectedTeachers: [],
      availableSlots: [],
      showAddStudentModal: false,
      showAvailableTeacherModal: false,
      
      // Calendar configuration
      step: 60,
      slotDuration: 120,
      
      isLoading: false,
      isSaving: false,
      error: null,
    };

    // Bind methods
    this.showAddStudentModal = this.showAddStudentModal.bind(this);
    this.handleCloseAddStudentModal = this.handleCloseAddStudentModal.bind(this);
    this.showAvailableTeachersModal = this.showAvailableTeachersModal.bind(this);
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
  }

  componentDidMount() {
    this.loadTeachers();
    if (!this.state.isNew) {
      this.loadFormData();
    }
  }

  async loadTeachers() {
    try {
        this.setState({ isLoading: true });

        const response = await getRehearsableTeachers(1); // DEV

        this.setState({ teachers: response.teachers || [] });
    } catch (error) {
        this.setState({ teachers: [] });
      console.error("Failed to load teachers:", error);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  async loadFormData() {
    // TODO: Implement for edit mode
  }

  // AddStudentModal
  showAddStudentModal = async (e) => {
    e.preventDefault();
    this.setState({ showAddStudentModal: true });
  };

  handleAddStudent = (newStudent) => {
    this.setState((prevState) => ({
      students: [...prevState.students, newStudent],
    }));
  };

  handleCloseAddStudentModal = () => {
    this.setState({ showAddStudentModal: false });
  };

  handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    const selectedTeacher = this.state.teachers.find(t => t.teacherId.toString() === teacherId);
    this.setState({ 
      teacherId: teacherId,
      teacher: selectedTeacher || null
    });
  };

  // Available Teachers Modal (similar to SubscriptionForm)
  showAvailableTeachersModal = async (e) => {
    e.preventDefault();

    let teachers;
    if (this.state.teacher) {
      // If teacher already selected, get their working periods
      const response = await getWorkingPeriods(this.state.teacher.teacherId);
      teachers = response.data?.teacher ? [response.data.teacher] : [];
    } else {
      // Get available teachers based on students' average age
      if (this.state.students.length === 0) {
        alert("Сначала добавьте учеников в группу");
        return;
      }

      const sortedStudents = this.sortStudentsByAge(this.state.students);
      const age = calculateAge(sortedStudents[0].birthDate);

      // For bands, we don't need a specific discipline - get all available teachers
      const response = await getAvailableTeachers(null, age, 1); // null disciplineId for all teachers
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
        selectedTeachers: [] 
      });
      return;
    }

    const selectedTeacherIds = Array.from(new Set(
      this.state.availableSlots.map(slot => slot.teacherId)
    ));
    const selectedTeachers = this.state.availableTeachers.filter(
      teacher => selectedTeacherIds.includes(teacher.teacherId)
    ); 
    const newSelectedTeacherId = selectedTeachers.length > 0 && selectedTeachers[0].teacherId;

    this.setState({ 
      showAvailableTeacherModal: false, 
      teacherId: newSelectedTeacherId, 
      selectedTeachers: selectedTeachers 
    });
  };

  handleSlotsChange = (availableSlots) => {
    // Convert available slots to scheduleSlots format (with teacherId for bands)
    const periods = convertSlotsToSchedules(availableSlots, { includeTeacherId: true });
    
    this.setState({ 
      availableSlots: availableSlots,
      scheduleSlots: periods 
    });
  };

  handleScheduleChange = (periods) => {
    this.setState({ scheduleSlots: periods });
  };

  sortStudentsByAge = (students) => {
    return [...students].sort((a, b) => {
      return new Date(b.birthDate) - new Date(a.birthDate);
    });
  };

  deleteStudent = (index) => {
    const updatedStudents = [...this.state.students];
    updatedStudents.splice(index, 1);
    this.setState({ students: updatedStudents });
  }

  handleRoleChange = (studentIndex, disciplineId) => {
    const updatedStudents = [...this.state.students];
    updatedStudents[studentIndex] = {
      ...updatedStudents[studentIndex],
      roleId: disciplineId
    };
    this.setState({ students: updatedStudents });
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSave = async (e) => {
    e.preventDefault();

    if (!this.state.name.trim()) {
      alert("Введите название группы");
      return;
    }

    if (!this.state.teacherId) {
      alert("Выберите преподавателя");
      return;
    }

    if (this.state.students.length === 0) {
      alert("Добавьте хотя бы одного ученика");
      return;
    }

    if (this.state.scheduleSlots.length === 0) {
      alert("Добавьте расписание");
      return;
    }

    this.setState({ isSaving: true });

    try {
      const members = this.state.students.map(student => ({ studentId: student.studentId, bandRoleId: student.roleId || null }));

      const requestBody = {
        name: this.state.name,
        teacherId: this.state.teacherId,
        members: members,
        scheduleSlots: this.state.scheduleSlots,
        branchId: 1, // TODO: get from context or props
      };

      const response = await addBand(requestBody);
      const bandId = response.data;

      this.props.history.push(`/band/${bandId}`);
    } catch (error) {
      console.error("Failed to save band:", error);
      alert("Ошибка при создании группы");
    } finally {
      this.setState({ isSaving: false });
    }
  };

  render() {
    const {
      isNew,
      name,
      teachers,
      availableTeachers,
      teacherId,
      students,
      scheduleSlots,
      showAddStudentModal,
      showAvailableTeacherModal,
      step,
      slotDuration,
      isSaving,
      isLoading,
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    const sortedStudents = this.sortStudentsByAge(students);

    return (
      <SectionWrapper>
        <SectionTitle className="text-center">
          {isNew ? "Новая группа" : "Редактировать группу"}
        </SectionTitle>

        <FormWrapper>
          <form onSubmit={this.handleSave} className="flex flex-col gap-8">
            <label className="flex flex-col gap-3">
              <span className="text-[14px] text-text-main opacity-60">Название группы</span>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={this.handleChange}
                placeholder="Введите название группы"
                autoComplete="off"
              />
            </label>

            <div className="h-px bg-white/10" />

            <div className="flex flex-col gap-4">
              <BandStudents
                showLabel={true}
                bandMembers={sortedStudents}
                onAddStudent={this.showAddStudentModal}
                onDeleteStudent={this.deleteStudent}
                onRoleChange={this.handleRoleChange}
              />

              <AddStudentModal
                show={showAddStudentModal}
                onAddStudent={this.handleAddStudent}
                handleClose={this.handleCloseAddStudentModal}
                onlyExistingStudents={true}
              />
            </div>

            <div className="h-px bg-white/10" />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <label className="flex flex-col gap-3">
                <span className="text-[14px] text-text-main opacity-60">Преподаватель</span>
                <select
                  id="teacherId"
                  value={teacherId}
                  onChange={this.handleTeacherChange}
                  className="w-full rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[16px] text-text-main outline-none transition focus:border-white/20 focus:ring-2 focus:ring-accent"
                >
                  <option value="">Выберите преподавателя...</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.teacherId} value={teacher.teacherId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </label>

              <Button
                variant="ghost"
                type="button"
                onClick={this.showAvailableTeachersModal}
                disabled={!teacherId}
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
              step={step}
              slotDuration={slotDuration}
            />

            <div className="h-px bg-white/10" />

            <div className="flex flex-col gap-4">
              <span className="text-[14px] text-text-main opacity-60">Расписание</span>
              <ScheduleEditorWithDelete
                schedules={scheduleSlots}
                onChange={this.handleScheduleChange}
              />
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-center">
              <Button
                type="submit"
                size="lg"
                className="min-w-[220px]"
                disabled={isSaving}
              >
                {isSaving ? "Сохранение..." : isNew ? "Создать группу" : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </FormWrapper>
      </SectionWrapper>
    );
  }
}