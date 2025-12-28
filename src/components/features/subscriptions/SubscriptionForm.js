import { format, getDay, parse } from "date-fns";
import React from "react";
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";

import { getStudent } from "../../../services/apiStudentService";
import { addSubscription, getSubscription } from "../../../services/apiSubscriptionService";
import { getAvailableTeachers, getTeacher, getWorkingPeriods } from "../../../services/apiTeacherService";
import { calculateAge } from "../../../utils/dateTime";
import { DisciplineGridSelector } from "../../shared/discipline/DisciplineGridSelector";
import { DisciplinePlate } from "../../shared/discipline/DisciplinePlate";
import { Loading } from "../../shared/Loading";
import { ScheduleEditorWithDelete } from "../../shared/schedule/ScheduleEditorWithDelete";
import { AddStudentModal } from "../students/AddStudentModal";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";
import { SubscriptionStudents } from "./SubscriptionStudents";

export class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type === "New",
      isLoading: false,
      studentId: this.props.match.params.id,
      student: null,
      students: [],
      disciplineId: null,
      teacherId: "",
      selectedTeachers: [],
      startDate: format(new Date(), "dd.MM.yyyy"),
      attendanceCount: "",
      attendanceLength: 0,
      generatedSchedule: "",
      availableTeachers: [],
      schedules: [],
      basedOnSubscriptionId: null,

      showAvailableTeacherModal: false,
      showAddStudentModal: false,
    };

    // AvailableTeachersModal
    this.showAvailableTeachersModal = this.showAvailableTeachersModal.bind(this);
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
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
          attendanceCount: baseSubscription.isTrial ? null : baseSubscription.attendanceCount,
          attendanceLength: baseSubscription.attendanceLength || 0,
          selectedTeachers: [baseSubscription.teacher] || [],
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
    const id = this.props.match.params.id;
    const subscription = await getSubscription(id);
    
    const student = await getStudent(subscription.studentId);
    let students = [];
    if (student != null) 
      students.push(student);

    const teacher = await getTeacher(subscription.teacherId);
    let teachers = [];
    if (teacher != null) 
      teachers.push(teacher);

    this.setState({
      student: student || {},
      students: students,
      disciplineId: subscription.disciplineId || null,
      teacherId: subscription.teacherId || "",
      startDate: subscription.startDate ? format(new Date(subscription.startDate), "dd.MM.yyyy") : format(new Date(), "dd.MM.yyyy"),
      attendanceCount: subscription.attendanceCount || "",
      attendanceLength: subscription.attendanceLength || 0,
      teacherId: subscription.teacherId || "",
      availableTeachers: teachers,
      schedules: subscription.schedules || [],
      });
    console.log("onFormLoad done");
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
      teachers = response.data.availableTeachers;
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

  updateAvailableSlots = (availableSlots) => {
    let periods = [];
    availableSlots.forEach((slot) => {
      const newPeriod = {
        weekDay: getDay(slot.start),
        startTime: format(slot.start, "HH:mm"),
        endTime: format(slot.end, "HH:mm"),
        roomId: slot.roomId,
        teacherId: slot.teacherId,
      };
      periods.push(newPeriod);
    });

    this.setState({ availableSlots: availableSlots, schedules: periods });
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
    });
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

    // Parse dd.MM.yyyy format to Date object for backend
    const startDate = parse(this.state.startDate, "dd.MM.yyyy", new Date());

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
      availableSlots,
      basedOnSubscriptionId,
      attendanceCount,
      attendanceLength,
      startDate,
      schedules,
      availableTeachers,
      selectedTeachers,
      showAvailableTeacherModal,
      showAddStudentModal,
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

    let studentsList;
    if (students && students.length > 0) {
      studentsList = students.map((student, index) => (
        <tr key={index}>
          <td>
            <Container className="d-flex p-0">
              <div className="flex-grow-1">{`${student.firstName} ${student.lastName}`}</div>
              <div className="flex-shrink-1">
                <Button
                  variant="outline-danger"
                  style={{ fontSize: "10px", marginLeft: "10px", borderRadius: "25px" }}
                  onClick={() => this.deleteStudent(index)}
                >
                  X
                </Button>
              </div>
            </Container>
          </td>
        </tr>
      ));
    }
    
    return (
      <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="mb-4 text-center">{isNew ? "Новый абонемент" : "Редактировать абонемент"}</h2>

            <Form>

              {/*Discipline*/}
              {basedOnSubscriptionId != null ? (
                <DisciplinePlate 
                  disciplineId={disciplineId}
                  label=""
                  size="medium"
                />
              ) : (
                <DisciplineGridSelector
                  selectedDisciplineId={disciplineId}
                  onDisciplineChange={this.handleDisciplineChange}
                />
              )}

              {/*Students*/}
              <div className="mb-3"><b>Ученики</b></div>
              <Form.Group className="mb-3" controlId="discipline">
                {basedOnSubscriptionId != null 
                ? <SubscriptionStudents
                  students={students}
                  onRemoveStudent={this.deleteStudent}
                  />
                : 
                <>
                <Table striped bordered hover>
                  <tbody>{studentsList}</tbody>
                </Table>
                <div className="text-center">
                  <Button size="sm" variant="outline-success" style={{ marginTop: "10px" }} onClick={this.showAddStudentModal}>
                    + Добавить ещё ученика
                  </Button>
                </div>
                
                <AddStudentModal 
                  show={showAddStudentModal} 
                  handleClose={this.handleCloseAddStudentModal} 
                  onAddStudent={this.handleAddStudent}
                  />
                </>
                }
              
              </Form.Group>
              <hr></hr>

              <Form.Group className="mb-3">
                <Form.Label>Дата начала</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={startDate ? format(parse(startDate, "dd.MM.yyyy", new Date()), "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      const date = new Date(e.target.value);
                      this.setState({ startDate: format(date, "dd.MM.yyyy") });
                    } else {
                      this.setState({ startDate: "" });
                    }
                  }}
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

              <hr></hr>

              <b>Преподаватель</b>
              <InputGroup className="mb-3 mt-4 text-center" controlId="GenerteSchedule">
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

                <Button variant="outline-secondary" type="null" onClick={this.showAvailableTeachersModal}>
                  Доступные окна...
                </Button>
              </InputGroup>
              <AvailableTeachersModal
                show={showAvailableTeacherModal}
                availableTeachers={availableTeachers}
                onSlotsChange={this.updateAvailableSlots}
                onClose={this.handleCloseAvailableTeachersModal}
              />

              <Form.Group className="mb-3" controlId="Teacher"></Form.Group>
              <hr></hr>
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
