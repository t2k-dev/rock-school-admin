import { format } from "date-fns";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

import AttendanceType from "../../../constants/AttendanceType";
import { getBusySlots } from "../../../services/apiBranchService";
import { addRentalSubscription } from "../../../services/apiRentalSubscriptionService";
import { getStudent } from "../../../services/apiStudentService";
import { getTariffsByType } from "../../../services/apiTariffService";
import { toMoneyString } from "../../../utils/moneyUtils";
import { convertSlotsToSchedules } from "../../../utils/scheduleUtils";
import { SubscriptionStudents } from "../../features/subscriptions/SubscriptionStudents";
import { Loading } from "../../shared/Loading";
import { AvailableSlotsModal } from "../../shared/modals/AvailableSlotsModal";
import { ScheduleEditorWithDelete } from "../../shared/schedule/ScheduleEditorWithDelete";
import TariffCard from "../tariffs/TariffCard";

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
      
      tariffs: [],
      selectedTariff: null,
      
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
        
        // Load tariffs for room rental
        this.loadTariffs();
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to load student data:", error);
      this.setState({ isLoading: false });
    }
  }

  loadTariffs = async () => {
    try {
      // Load all tariffs for room rental
      const tariffs = await getTariffsByType(AttendanceType.RENT);
      this.setState({ tariffs: tariffs || [] });
    } catch (error) {
      console.error('Error loading tariffs:', error);
    }
  };

  handleTariffChange = (tariffId) => {
    const selectedTariff = this.state.tariffs.find(tariff => tariff.tariffId === tariffId);
    if (selectedTariff) {
      this.setState({
        selectedTariff: selectedTariff,
        attendanceCount: selectedTariff.attendanceCount,
        attendanceLength: selectedTariff.attendanceLength
      });
    }
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

  handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
        subscriptionDetails:{
            startDate: this.state.startDate,
            attendanceCount: this.state.attendanceCount,
            attendanceLength: this.state.attendanceLength,
            branchId: 1,
            studentId: this.state.studentId,
            
            tariffId: this.state.selectedTariff?.tariffId,
            price: this.state.selectedTariff?.amount,
            amountOutstanding: this.state.selectedTariff?.amount,
            finalPrice: this.state.selectedTariff?.amount,
        },
        schedules: this.state.schedules,
    };

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
      tariffs,
      selectedTariff,
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
                  allowRemove={false}
                  allowAdd={false}
                  />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><b>Дата начала</b></Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={startDate || ""}
                  onChange={(e) => this.setState({ startDate: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="TariffSelection">
                <Form.Label><b>Тариф</b></Form.Label>
                <Form.Select 
                  aria-label="Выберите тариф..." 
                  value={selectedTariff?.tariffId || ""} 
                  onChange={(e) => this.handleTariffChange(e.target.value)}
                  disabled={tariffs.length === 0}
                >
                  <option value="">выберите тариф...</option>
                  {tariffs.map((tariff) => (
                    <option key={tariff.tariffId} value={tariff.tariffId}>
                      {tariff.attendanceCount} сеансов, {tariff.attendanceLength === 1 ? 'час' : 'полтора часа'} - {toMoneyString(tariff.amount)}
                    </option>
                  ))}
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
          <Col md="4">
            {/* Tariff section */}
            <TariffCard
              title="Тариф"
              description="Аренда комнаты"
              amount={selectedTariff ? toMoneyString(selectedTariff.amount) : toMoneyString(0)}
              style={{ marginTop: '60px' }}
              showIcon={false}
            />
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