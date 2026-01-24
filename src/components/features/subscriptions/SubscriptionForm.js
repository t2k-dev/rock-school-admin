import { format } from "date-fns";
import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import AttendanceType from "../../../constants/AttendanceType";
import { getStudent } from "../../../services/apiStudentService";
import { addSubscription } from "../../../services/apiSubscriptionService";
import { getAvailableTeachers, getWorkingPeriods } from "../../../services/apiTeacherService";
import { calculateAge } from "../../../utils/dateTime";
import { convertSlotsToSchedules } from "../../../utils/scheduleUtils";
import { DisciplinePlate } from "../../shared/discipline/DisciplinePlate";
import { Loading } from "../../shared/Loading";
import { AvailableTeachersModal } from "../../shared/modals/AvailableTeachersModal";
import { DisciplineSelectionModal } from "../../shared/modals/DisciplineSelectionModal";
import { ScheduleEditorWithDelete } from "../../shared/schedule/ScheduleEditorWithDelete";
import { AddStudentModal } from "../students/AddStudentModal";
import { SubscriptionStudents } from "./SubscriptionStudents";

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

      schedules: [],
      
      isLoading: false,
      showAvailableTeacherModal: false,
      showAddStudentModal: false,
      showDisciplineModal: false,
    };

    // AvailableTeachersModal
    this.showAvailableTeachersModal = this.showAvailableTeachersModal.bind(this);
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showDisciplineModal = this.showDisciplineModal.bind(this);
    this.handleCloseDisciplineModal = this.handleCloseDisciplineModal.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {

    this.setState({ isLoading: true });

    // New
    if (this.state.isNew) {
    
      // Based on prev subscription
      if (this.props.location.state && this.props.location.state.baseSubscription) {
        const baseSubscription = this.props.location.state.baseSubscription;

        const student = await getStudent(this.state.studentId);
        const students = student ? [student] : [];

        this.setState({
          students: students || [],
          disciplineId: baseSubscription.disciplineId || null,
          attendanceCount: baseSubscription.attendanceType === AttendanceType.TRIAL_LESSON ? null : baseSubscription.attendanceCount,
          attendanceLength: baseSubscription.attendanceLength || 0,
          selectedTeachers: [baseSubscription.teacher] || [],
          teacher: baseSubscription.teacher || null,
          teacherId: baseSubscription.teacher.teacherId || "",
          schedules: baseSubscription.schedules || [],
          basedOnSubscriptionId: baseSubscription.subscriptionId || null,
          isLoading: false,
        });
        
      }
      else{
        const student = await getStudent(this.state.studentId);
        const students = student ? [student] : [];

        this.setState({
            students: students,
            disciplineId: this.props.location.state.disciplineId,
            isLoading: false,
        });
      }

      return;
    }

    // Edit
  }

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

      const response = await getAvailableTeachers(this.state.disciplineId, age, 1);
      teachers = response.data.availableTeachers;
    }

    this.setState({
      availableTeachers: teachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    if (!this.state.availableSlots || this.state.availableSlots.length === 0) {
      this.setState({ showAvailableTeacherModal: false, teacherId: "" , selectedTeachers: [] });
      return;
    }

    const selectedTeacherIds = Array.from(new Set(this.state.availableSlots.map(slot => slot.teacherId)));
    const selectedTeachers = this.state.availableTeachers.filter(teacher => selectedTeacherIds.includes(teacher.teacherId)); 
    const newSelectedTeacherId = selectedTeachers.length > 0 && selectedTeachers[0].teacherId;

    this.setState({ showAvailableTeacherModal: false, teacherId: newSelectedTeacherId , selectedTeachers: selectedTeachers });
  };

  handleSlotsChange = (slots) => {
    const schedules = convertSlotsToSchedules(slots, { includeTeacherId: true });
    this.setState({ availableSlots: slots, schedules: schedules });
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
    });
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
    return students.sort((a, b) => {
      if (!a.birthDate || !b.birthDate) return 0;
      return new Date(b.birthDate) - new Date(a.birthDate);
    });
  };

  deleteStudent = (index) => {
    const updatedStudents = [...this.state.students];
    updatedStudents.splice(index, 1);
    this.setState({ students: updatedStudents });
  }

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
      },
      schedules: this.state.schedules,
    };

    await addSubscription(requestBody);

    this.props.history.push(`/student/${this.state.studentId}`);
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
    } = this.state;

    if (isLoading) {
      return <Loading
        message="Загрузка данных..."
      />
    }

    let filteredSchedules;
    if (schedules && schedules.length > 0){
      if (basedOnSubscriptionId != null){
        filteredSchedules = schedules;
      } else{
        filteredSchedules = schedules.filter(schedule => schedule.teacherId === teacherId) ;
      }
    }
console.log("att", attendanceLength);
    return (
      <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="mb-4 text-center">{isNew ? "Новый абонемент" : "Редактировать абонемент"}</h2>

            <Form>

              {/*Discipline*/}
              <div className="mb-3">
                <div 
                  onClick={basedOnSubscriptionId === null ? this.showDisciplineModal : undefined}
                  style={{ cursor: 'pointer' }}
                >
                  <DisciplinePlate 
                    disciplineId={disciplineId}
                    size="fill"
                  />
                </div>
              </div>

              {/*Students*/}
              <Form.Group className="mb-3" controlId="students">
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
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Дата начала</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={startDate || ""}
                  onChange={(e) => this.setState({ startDate: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="Subscription">
                <Form.Label>Количество занятий</Form.Label>
                <Form.Select aria-label="Веберите..." value={attendanceCount} onChange={(e) => this.setState({ attendanceCount: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">1</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="AttendanceLength">
                <Form.Label>Длительность урока</Form.Label>
                <Form.Select aria-label="Веберите..." value={attendanceLength} onChange={(e) => this.setState({ attendanceLength: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">Час</option>
                  <option value="2">Полтора часа</option>
                </Form.Select>
              </Form.Group>

              <b>Преподаватель</b>
              <InputGroup className="mb-3 mt-4 text-center">
                <Form.Select
                  aria-label="Веберите..."
                  value={teacherId}
                  onChange={(e) => this.setState({ teacherId: e.target.value })}
                  style={{ width: "200px" }}
                >
                  <option>выберите...</option>
                  {selectedTeachers.map((teacher, index) => (
                    <option key={index} value={teacher.teacherId}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </Form.Select>

                <Button 
                  variant="outline-secondary" 
                  type="null" 
                  onClick={this.showAvailableTeachersModal}
                  disabled={!disciplineId}
                  >
                  Доступные окна...
                </Button>
              </InputGroup>

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

              <Form.Group className="mb-3 mt-3" controlId="Schedule">
                <ScheduleEditorWithDelete
                  schedules={filteredSchedules}
                  onChange={this.handlePeriodsChange}
                  attendanceLength={attendanceLength}
                />
              </Form.Group>

              <hr></hr>
              <Container className="text-center">
                <Button variant="primary" type="null" onClick={this.handleSave}>
                  Сохранить
                </Button>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
