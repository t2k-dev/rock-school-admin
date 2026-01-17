import { format } from "date-fns";
import React from "react";
import { Alert, Button, Col, Container, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

import { getAttendanceLengthName } from "../../../constants/attendancies";
import { getDisciplineName } from "../../../constants/disciplines";
import SubscriptionType from '../../../constants/SubscriptionType';
import { convertSlotsToSchedules } from "../../../utils/scheduleUtils";
import { DisciplineIcon } from "../../shared/discipline/DisciplineIcon";
import { CalendarIcon, CountIcon, TimeIcon } from "../../shared/icons";
import { Loading } from "../../shared/Loading";
import { AvailableSlotsModal } from "../../shared/modals/AvailableSlotsModal";
import { ScheduleEditorWithDelete } from "../../shared/schedule/ScheduleEditorWithDelete";
import { SubscriptionStudents } from "../subscriptions/SubscriptionStudents";

import { getBusySlots } from "../../../services/apiBranchService";
import { getSubscriptionFormData, updateSubscriptionSchedules } from "../../../services/apiSubscriptionService";
import { getWorkingPeriods } from "../../../services/apiTeacherService";
import { AvailableTeachersModal } from "../../shared/modals/AvailableTeachersModal";

const ERROR_MESSAGES = {
  LOAD_FAILED: "Не удалось загрузить данные абонемента",
  SAVE_FAILED: "Не удалось сохранить изменения",
  TEACHER_LOAD_FAILED: "Не удалось загрузить данные преподавателя",
  NO_SUBSCRIPTION_ID: "Не указан ID абонемента",
  VALIDATION_FAILED: "Пожалуйста, заполните все обязательные поля",
};

export class SubscriptionFormEditable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriptionId: this.props.match?.params?.id,
      student: null,
      students: [],
      disciplineId: 0,
      teacherId: "",
      selectedTeachers: [],
      startDate: "",
      attendanceCount: "",
      attendanceLength: 0,
      availableTeachers: [],
      rooms: [],
      schedules: [],

      // UI State
      showAvailableTeacherModal: false,
      isLoading: true,
      isSaving: false,
      error: null,
      modalError: null,
    };

    // AvailableTeachersModal
    this.showAvailableTeachersModal = this.showAvailableTeachersModal.bind(this);
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
  }

  
  componentDidMount() {
    this.loadFormData();
  }

  async loadFormData() {
    const { subscriptionId } = this.state;

    if (!subscriptionId) {
      this.setState({ 
        error: ERROR_MESSAGES.NO_SUBSCRIPTION_ID, 
        isLoading: false 
      });
      return;
    }

    try {
      this.setState({ isLoading: true, error: null });

      const formData = await getSubscriptionFormData(subscriptionId);

      const subscription = formData.subscription || {};
    
      this.setState({
        subscriptionId: subscription.subscriptionId,
        type: subscription.subscriptionType,
        students: formData.students,
        disciplineId: subscription.disciplineId || "",
        teacher: formData.teacher || {},
        startDate: subscription.startDate ? format(new Date(subscription.startDate), "dd.MM.yyyy") : "",
        attendanceCount: subscription.attendanceCount || "",
        attendanceLength: subscription.attendanceLength || 0,
        schedules: subscription.schedules || [],
        isLoading: false,
        });
    } catch (error) {
      console.error('Failed to load form data:', error);
      this.setState({
        error: ERROR_MESSAGES.LOAD_FAILED,
        isLoading: false,
      });
    }
  }

  // AvailableTeachersModal
  showAvailableTeachersModal = async (e) => {
    e.preventDefault();
    
    const { teacher } = this.state;

    const response = await getWorkingPeriods(teacher.teacherId);
    const teachers = response.data?.teacher ? [response.data.teacher] : [];

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

  showAvailableSlotsModal = async (e) => {
    e.preventDefault();
    
    const responseData = await getBusySlots(1); // BranchId

    this.setState({
        rooms: responseData,
        showAvailableSlotsModal: true,
    });
  }

  handleCloseAvailableSlotsModal = () => {
    this.setState({ showAvailableSlotsModal: false });
  };

  handleSlotsChange = (slots) => {
    const schedules = convertSlotsToSchedules(slots, { includeTeacherId: true });
    this.setState({ availableSlots: slots, schedules: schedules });
  };

  handleScheduleChange = (periods) => {
    this.setState({ schedules: periods });
  };

  handleSave = async (e) => {
    e.preventDefault();
    
    const { subscriptionId, students, schedules } = this.state;
    const studentIds = students.map(student => student.studentId);

    const requestBody = {
      subscriptionId: subscriptionId,
      schedules: schedules,
    };

    await updateSubscriptionSchedules(subscriptionId, requestBody);
    
    const firstStudentId = studentIds[0];
    this.props.history.push(`/student/${firstStudentId}`);
  };

  renderLoadingState = () => (
    <Container className="text-center" style={{ marginTop: "100px" }}>
      <Spinner animation="border" role="status" className="mb-3">
        <span className="visually-hidden">Загрузка...</span>
      </Spinner>
      <div>Загрузка данных...</div>
    </Container>
  );

  renderErrorState = () => (
    <Container style={{ marginTop: "40px" }}>
      <Alert variant="danger">
        <Alert.Heading>Ошибка</Alert.Heading>
        <p>{this.state.error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button 
            onClick={this.loadFormData} 
            variant="outline-danger"
            disabled={this.state.isLoading}
          >
            Попробовать снова
          </Button>
        </div>
      </Alert>
    </Container>
  );

  renderType = () => {
    const { disciplineId, type } = this.state;
    
    switch (type) { 
      case SubscriptionType.LESSON:
            return (
              <Form.Group className="mb-3 text-center">
                <Form.Label>
                  <DisciplineIcon disciplineId={disciplineId}/>
                  <span style={{marginLeft: "5px"}}>{getDisciplineName(disciplineId)}</span>
                </Form.Label>
              </Form.Group>
            );
      case SubscriptionType.RENT:
        return (
          <Form.Group className="mb-3 text-center">
            <Form.Label>
              Аренда комнаты
            </Form.Label>
          </Form.Group>
        )
      default:
        return null;
    }
  }

  renderSelectSlotSection = () => {
    const { teacher, isSaving, type } = this.state;
    switch (type) { 
      case SubscriptionType.LESSON:
        return (
          <>
            <div className="mb-3"><b>Преподаватель</b></div>
            <Form.Group className="mb-3" >
              <div className="mb-4">
                  <InputGroup className="mb-3 d-flex">
                    <Form.Label className="flex-grow-1">{teacher.firstName} {teacher.lastName}</Form.Label>
                    <Button 
                      variant="outline-secondary" 
                      onClick={this.showAvailableTeachersModal}
                      disabled={!teacher?.teacherId || isSaving}
                    >
                      Доступные окна...
                    </Button>

                  </InputGroup>
              </div>
            </Form.Group>
          </>
        );
      case SubscriptionType.RENT:
        return (
          <Button 
              variant="outline-secondary" 
              type="null" 
              onClick={this.showAvailableSlotsModal}>
            Доступные окна...
          </Button>
        );
      default:
        return null;
    }
  };

  render() {
    const {
      isLoading,
      isSaving,
      error,
      teacher,
      attendanceCount,
      attendanceLength,
      startDate,
      schedules,
      students,
      availableTeachers,
      showAvailableTeacherModal,
      showAvailableSlotsModal,
      rooms,
    } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    if (error && !teacher) {
      return this.renderErrorState();
    }

    return (
      <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="mb-4 text-center">Редактировать расписание</h2>

            <Form>
              {this.renderType()}

              <SubscriptionStudents
                students={students}
                allowRemove={false}
              />

              <Form.Group className="mb-2">
                <CalendarIcon />
                <Form.Label>Начало: {startDate}</Form.Label>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label><CountIcon /> Количество занятий: {attendanceCount}</Form.Label>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label><TimeIcon /> Длительность урока: {getAttendanceLengthName(attendanceLength)}</Form.Label>
              </Form.Group>

              {this.renderSelectSlotSection()}

              <AvailableTeachersModal
                show={showAvailableTeacherModal}
                teachers={availableTeachers}
                onSlotsChange={this.handleSlotsChange}
                onClose={this.handleCloseAvailableTeachersModal}
              />

              <AvailableSlotsModal
                show={showAvailableSlotsModal}
                rooms={rooms}
                onSlotsChange={this.handleSlotsChange}
                onClose={this.handleCloseAvailableSlotsModal}
                singleSelection={false}
              />

              <hr></hr>

              <Form.Group className="mb-3 mt-3">
                <ScheduleEditorWithDelete
                  schedules={schedules}
                  onChange={this.handleScheduleChange}
                  attendanceLength={attendanceLength}
                />
              </Form.Group>

              <hr></hr>
              <Container className="text-center">
                <Button variant="primary" disabled={isSaving} onClick={this.handleSave}>
                  {isSaving ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить'
                  )}
                </Button>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
