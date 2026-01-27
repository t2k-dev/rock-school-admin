import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import SubscriptionType from "../../../constants/SubscriptionType";
import { getStudent } from "../../../services/apiStudentService";
import { addTrialSubscription } from "../../../services/apiSubscriptionService";
import { getTariffByType } from "../../../services/apiTariffService";
import { getAvailableTeachers } from "../../../services/apiTeacherService";
import { DisciplinePlate } from "../../shared/discipline/DisciplinePlate";
import { CalendarIcon } from "../../shared/icons";
import { AvailableTeachersModal } from "../../shared/modals/AvailableTeachersModal";
import { DisciplineSelectionModal } from "../../shared/modals/DisciplineSelectionModal";
import TariffCard from "../tariffs/TariffCard";
import { SubscriptionStudents } from "./SubscriptionStudents";

export class TrialSubscriptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExistingStudent: false,

      branchId: 0,
      disciplineId: null,
      student: null, // Add student to state as fallback
      tariff: null,
      trialTariffAmount: 0,

      backgroundEvents: [],
      availableTeachers: [],
      availableSlots: [],
      showAvailableTeacherModal: false,
      showDisciplineModal: false,
      selectedSlotId: 0,
    };

    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.showDisciplineModal = this.showDisciplineModal.bind(this);
    this.handleCloseDisciplineModal = this.handleCloseDisciplineModal.bind(this);
  }

  componentDidMount() {
    // Load student if not provided in props
    if (!this.props.student && !this.props.location?.state?.student) {
      this.loadStudent();
    }
    // Load trial tariff
    this.loadTrialTariff();
  }

  loadStudent = async () => {
    try {
      const studentId = this.props.match?.params?.id;
      if (studentId) {
        const student = await getStudent(studentId);
        this.setState({ student: student });
      }
    } catch (error) {
      console.error('Error loading student:', error);
    }
  };

  loadTrialTariff = async () => {
    try {
      const { disciplineId } = this.state;
      const tariff = await getTariffByType(SubscriptionType.TRIAL_LESSON, disciplineId);
      this.setState({ tariff: tariff, trialTariffAmount: tariff.amount });
    } catch (error) {
      console.error('Error loading trial tariff:', error);
      // Keep default amount if API call fails
    }
  };

  // AvailableTeachersModal
  generateAvailablePeriods = async (e) => {
    e.preventDefault();
    const response = await getAvailableTeachers(this.state.disciplineId, this.state.age, 1);
    this.setState({
      availableTeachers: response.data.availableTeachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    const { selectedSlotId, availableSlots } = this.state;
    const newSelectedSlotId = selectedSlotId === 0 && availableSlots.length > 0 && availableSlots[0].id;
    this.setState({ showAvailableTeacherModal: false, selectedSlotId: newSelectedSlotId });
  };

  handleSlotsChange = (availableSlots) => {
    this.setState({ availableSlots: availableSlots, selectedSlotId: availableSlots[0]?.id });
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
    }, () => {
      // Reload tariff when discipline changes
      this.loadTrialTariff();
    });
  };

  // Discipline Modal methods
  showDisciplineModal = () => {
    this.setState({ showDisciplineModal: true });
  };

  handleCloseDisciplineModal = () => {
    this.setState({ showDisciplineModal: false });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const selectedSlot = this.state.availableSlots.filter((s) => s.id === this.state.selectedSlotId)[0];
    const requestBody = {
      disciplineId: this.state.disciplineId,
      branchId: 1, // DEV: map after clarification
      teacherId: selectedSlot.teacherId,
      trialDate: selectedSlot.start,
      roomId: selectedSlot.roomId,
      tariffId: this.state.tariff ? this.state.tariff.tariffId : null,
      student: {
        studentId: this.props.match.params.id,
      },
    };

    const response = await addTrialSubscription(requestBody);
    const newStudentId = response.data;

    this.props.history.push(`/student/${newStudentId}`);
  };

  render() {
    const {
      disciplineId,
      showAvailableTeacherModal,
      showDisciplineModal,
      availableTeachers,
      availableSlots,
      selectedSlotId,
      student,
      trialTariffAmount,
    } = this.state;

    // Debug: Check what props are available
    console.log('TrialSubscriptionForm props:', this.props);
    console.log('Student from props:', this.props.student);
    console.log('Student from state:', student);
    console.log('Match params:', this.props.match?.params);

    // Try multiple sources for student data
    const currentStudent = this.props.student 
      || this.props.location?.state?.student 
      || student;
    
    const students = currentStudent ? [currentStudent] : [];

    let availableSlotsList;
    if (availableSlots && availableSlots.length > 0) {
      availableSlotsList = availableSlots.map((item, index) => (
        <option key={index} value={item.id}>
          {item.description}
        </option>
      ));
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="text-center mb-4">Пробное занятие</h2>
            <Form>

              {/* Discipline Selection */}
              <div className="mb-3">
                  <div 
                    onClick={this.showDisciplineModal}
                    style={{ cursor: 'pointer' }}
                  >
                    <DisciplinePlate 
                      disciplineId={disciplineId}
                      size="fill"
                    />
                  </div>
              </div>

              {/*Student*/}
              <Form.Group className="mb-3" controlId="students">
                <SubscriptionStudents
                  students={students}
                  allowRemove={false}
                  allowAdd={false}
                  />
              </Form.Group>

              <label htmlFor="GenerteSchedule"><CalendarIcon/> <strong>Расписание</strong></label>
              <InputGroup className="mb-3 mt-2 text-center" controlId="GenerteSchedule">
                <Form.Select
                  aria-label="Веберите..."
                  value={selectedSlotId}
                  onChange={(e) => this.setState({ selectedSlotId: e.target.value })}
                  style={{ width: "200px" }}
                  disabled={availableSlots.length === 0}
                >
                  <option>выберите...</option>
                  {availableSlotsList}
                </Form.Select>

                <Button 
                  variant="outline-secondary" 
                  type="null" 
                  onClick={(e) => this.generateAvailablePeriods(e)} 
                  disabled={!disciplineId}
                >
                  Доступные окна...
                </Button>

                <AvailableTeachersModal
                  show={showAvailableTeacherModal}
                  teachers={availableTeachers}
                  onSlotsChange={this.handleSlotsChange}
                  onClose={this.handleCloseAvailableTeachersModal}
                />

              </InputGroup>

              <DisciplineSelectionModal
                show={showDisciplineModal}
                onHide={this.handleCloseDisciplineModal}
                selectedDisciplineId={disciplineId}
                onDisciplineChange={this.handleDisciplineChange}
              />

              <hr></hr>
              <div className="text-center">
                <Button variant="success" type="null" onClick={this.handleSave}>
                  Записать
                </Button>
              </div>
            </Form>
          </Col>
          <Col md="4">
            {/* Tariff section */}
            <TariffCard
              title="Тариф"
              description="Пробное занятие"
              amount={trialTariffAmount}
              style={{ marginTop: '50px' }}
              showIcon={false}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
