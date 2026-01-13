import { format } from "date-fns";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import { getBusySlots } from "../../../services/apiBranchService";
import { addRentalSubscription } from "../../../services/apiRentalSubscriptionService";
import { getStudent } from "../../../services/apiStudentService";
import { convertSlotsToSchedules } from "../../../utils/scheduleUtils";
import { SubscriptionStudents } from "../../features/subscriptions/SubscriptionStudents";
import { Loading } from "../../shared/Loading";
import { AvailableSlotsModal } from "../../shared/modals/AvailableSlotsModal";
import { ScheduleEditorWithDelete } from "../../shared/schedule/ScheduleEditorWithDelete";

export class RoomRentalForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type === "New",
      isLoading: false,
      studentId: this.props.match.params.id,
      student: null,
      students: [],
      roomId: "",
      startDate: format(new Date(), "dd.MM.yyyy"),
      attendanceCount: "",
      attendanceLength: 1,
      purpose: "",
      notes: "",
      schedules: [],
      basedOnSubscriptionId: null,
      showAvailableSlotsModal: false,
      rooms: [],
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    this.setState({ isLoading: true });

    try {
      if (this.state.studentId) {
        const student = await getStudent(this.state.studentId);
        const students = student ? [student] : [];
        
        this.setState({
          student: student,
          students: students,
          isLoading: false,
        });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to load student data:", error);
      this.setState({ isLoading: false });
    }
  }

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

  handleSlotsChange = (availableSlots) => {
    // Convert available slots to schedules format (without teacherId for room rental)
    const periods = convertSlotsToSchedules(availableSlots, { includeTeacherId: false });
    this.setState({ schedules: periods });
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  onChange = (periods) => {
    this.setState({ schedules: periods });
  };

  deleteStudent = (index) => {
    const updatedStudents = [...this.state.students];
    updatedStudents.splice(index, 1);
    this.setState({ students: updatedStudents });
  }

  handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
        subscriptionDetails:{
            startDate: this.state.startDate,
            attendanceCount: this.state.attendanceCount,
            attendanceLength: this.state.attendanceLength,
            branchId: 1,
            studentId: this.state.studentId,
        },
        schedules: this.state.schedules,
    };

    console.log("Request body for saving room rental:", requestBody);
return;

    try {
      await addRentalSubscription(requestBody);
      
      this.props.history.push(`/student/${this.state.studentId}`);
    } catch (error) {
      console.error("Failed to save room rental:", error);
      alert("Ошибка при оформлении аренды комнаты");
    }
  };

  render() {
    const {
      isNew,
      isLoading,
      students,
      attendanceCount,
      attendanceLength,
      startDate,
      schedules,
      rooms,
      basedOnSubscriptionId,
      showAvailableSlotsModal,
    } = this.state;

    if (isLoading) {
      return <Loading message="Загрузка данных..." />;
    }

    return (
      <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="mb-4 text-center">{isNew ? "Аренда комнаты" : "Редактировать аренду"}</h2>

            <Form>

              {/*Students*/}
              <Form.Group className="mb-3" controlId="students">
                <SubscriptionStudents
                  students={students}
                  onRemoveStudent={this.deleteStudent}
                  allowRemove={false}
                  />
              </Form.Group>

              <hr></hr>

              <Form.Group className="mb-3">
                <Form.Label>Дата начала</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={startDate || ""}
                  onChange={(e) => this.setState({ startDate: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="AttendanceCount">
                <Form.Label>Количество сеансов</Form.Label>
                <Form.Select aria-label="Выберите..." value={attendanceCount} onChange={(e) => this.setState({ attendanceCount: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">1</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="AttendanceLength">
                <Form.Label>Длительность сеанса</Form.Label>
                <Form.Select 
                    aria-label="Выберите..." 
                    value={attendanceLength} 
                    onChange={(e) => this.setState({ attendanceLength: e.target.value })}
                    readOnly
                    >
                  <option value="1">Час</option>
                  <option value="2">Полтора часа</option>
                </Form.Select>
              </Form.Group>

              <hr></hr>
                <Button 
                    variant="outline-secondary" 
                    type="null" 
                    onClick={this.showAvailableSlotsModal}>
                  Доступные окна...
                </Button>

              <Form.Group className="mb-3 mt-3" controlId="Schedule">
                <ScheduleEditorWithDelete
                  schedules={schedules}
                  onChange={this.onChange}
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

        <AvailableSlotsModal
          show={showAvailableSlotsModal}
          rooms={rooms}
          onSlotsChange={this.handleSlotsChange}
          onClose={this.handleCloseAvailableSlotsModal}
          singleSelection={false}
        />
      </Container>
    );
  }
}