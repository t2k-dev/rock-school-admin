import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import { addBand } from "../../../services/apiBandService";
import { getAvailableTeachers, getTeachers, getWorkingPeriods } from "../../../services/apiTeacherService";
import { calculateAge } from "../../../utils/dateTime";
import { convertSlotsToSchedules } from "../../../utils/scheduleUtils";
import { Loading } from "../../shared/Loading";
import { AvailableTeachersModal } from "../../shared/modals/AvailableTeachersModal";
import { ScheduleEditorWithDelete } from "../../shared/schedule/ScheduleEditorWithDelete";
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
      schedules: [],
      
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
      const teachers = await getTeachers();
      this.setState({ teachers: teachers || [] });
    } catch (error) {
      console.error("Failed to load teachers:", error);
    }
  }

  async loadFormData() {
    // TODO: Implement for edit mode
    // const { bandId } = this.props.match.params;
    // Load band data for editing
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
    // Convert available slots to schedules format (with teacherId for bands)
    const periods = convertSlotsToSchedules(availableSlots, { includeTeacherId: true });
    
    this.setState({ 
      availableSlots: availableSlots,
      schedules: periods 
    });
  };

  handleScheduleChange = (periods) => {
    this.setState({ schedules: periods });
  };

  sortStudentsByAge = (students) => {
    return students.sort((a, b) => {
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

    if (this.state.schedules.length === 0) {
      alert("Добавьте расписание");
      return;
    }

    this.setState({ isSaving: true });

    try {
      const studentIds = this.state.students.map(student => student.studentId);

      const requestBody = {
        name: this.state.name,
        teacherId: this.state.teacherId,
        studentIds: studentIds,
        schedules: this.state.schedules,
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
      teacher,
      teachers,
      selectedTeachers,
      availableTeachers,
      teacherId,
      students,
      schedules,
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
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="text-center mb-5">
              {isNew ? "Новая группа" : "Редактировать группу"}
            </h2>
            <Form>
              {/* Band Name */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="name">Название группы</Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  value={name}
                  onChange={this.handleChange}
                  placeholder="Введите название группы"
                  autoComplete="off"
                />
              </Form.Group>

              {/* Students Section */}
              <div className="mb-3">
                <label htmlFor="students">Ученики</label>
                
                <BandStudents
                  students={sortedStudents}
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
              <hr />
              {/* Teacher Section */}
              <Form.Group className="mb-3">
                <Form.Label htmlFor="teacherId">Преподаватель</Form.Label>
                <InputGroup>
                  <Form.Control
                    as="select"
                    id="teacherId"
                    value={teacherId}
                    style={{ width: "200px" }}
                    onChange={this.handleTeacherChange}
                  >
                    <option value="">Выберите преподавателя...</option>
                    {teachers
                      .filter(teacher => teacher.isActive)
                      .map(teacher => (
                        <option key={teacher.teacherId} value={teacher.teacherId}>
                          {teacher.firstName} {teacher.lastName}
                        </option>
                      ))}
                  </Form.Control>
                  <Button 
                    variant="outline-secondary" 
                    type="button" 
                    onClick={this.showAvailableTeachersModal}
                  >
                    Доступные окна...
                  </Button>
                </InputGroup>
              </Form.Group>

              <AvailableTeachersModal
                show={showAvailableTeacherModal}
                teachers={availableTeachers}
                onSlotsChange={this.handleSlotsChange}
                onClose={this.handleCloseAvailableTeachersModal}
                step={step}
                slotDuration={slotDuration}
              />

              {/* Schedule Section */}
              
              <div className="mb-3">
                <ScheduleEditorWithDelete
                  schedules={schedules}
                  onChange={this.handleScheduleChange}
                />
              </div>
              

              <hr />
              <div className="text-center">
                <Button 
                  variant="primary" 
                  onClick={this.handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Сохранение..." : (isNew ? "Создать группу" : "Сохранить изменения")}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}