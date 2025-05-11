import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import { DisciplinesDropDownControl } from "../common/DisciplinesDropDownControl";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

import { addTrialSubscription2 } from "../../services/apiSubscriptionService";
import { getAvailableTeachers } from "../../services/apiTeacherService";

export class TrialSubscriptionForm2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExistingStudent: false,

      firstName: "",
      lastName: "",
      age: "",
      level: 0,
      phone: "",
      branchId: 0,
      disciplineId: "",

      backgroundEvents: [],

      availableTeachers: [],
      availableSlots: [],
      showAvailableTeacherModal: false,
      fakeId: "",
      selectedSlotId: 0,
    };

    // AvailableTeachersModal
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  newStudentSelected = () => {
    this.setState({ isExistingStudent: false });
  };

  existingStudentSelected = () => {
    this.setState({ isExistingStudent: true });
  };

  generateAvailablePeriods = async (e) => {
    e.preventDefault();
    const response = await getAvailableTeachers(this.state.disciplineId, this.state.age, 1);
    this.setState({
      availableTeachers: response.data.availableTeachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
  };

  updateAvailableSlots = (availableSlots) => {
    this.setState({ availableSlots: availableSlots });
  };

  handleDisciplineCheck = (id, isChecked) => {
    const teacher = { ...this.state.teacher };
    let newDisciplines = teacher.disciplines;
    if (isChecked) {
      newDisciplines.push(id);
    } else {
      newDisciplines = newDisciplines.filter((discipline) => discipline !== id);
    }
    teacher.disciplines = newDisciplines;
    this.setState({ teacher });
  };

  handleSave = async (e) => {
    e.preventDefault();

    console.log(this.state)

    const selectedSlot = this.state.availableSlots.filter((s) => s.id === this.state.selectedSlotId)[0];
    const requestBody = {
      disciplineId: this.state.disciplineId,
      branchId: 1, // DEV: map after clarification
      teacherId: selectedSlot.teacherId,
      trialDate: selectedSlot.start,
      roomId: selectedSlot.roomId,
      student: {
        studentId: this.props.match.params.id,
      },
    };

    
    const response = await addTrialSubscription2(requestBody);
    const newStudentId = response.data;

    this.props.history.push(`/studentScreen/${newStudentId}`);
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSexChange = (isChecked) => {
    this.setState({
      sex: isChecked,
    });
  };
  handleDisciplineChange = (e) => {
    this.setState({ disciplineId: e.target.value });
  };

  render() {
    const {
      age,
      disciplineId,
      showAvailableTeacherModal,
      availableTeachers,
      availableSlots,
      selectedSlotId,
      fakeId,
    } = this.state;

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

              <DisciplinesDropDownControl value={disciplineId} onChange={(e) => this.handleDisciplineChange(e)} />
              <label for="GenerteSchedule">Окно для занятия</label>
              <InputGroup className="mb-3 mt-2 text-center" controlId="GenerteSchedule">
                <Form.Select
                  aria-label="Веберите..."
                  value={selectedSlotId}
                  onChange={(e) => this.setState({ selectedSlotId: e.target.value })}
                  style={{ width: "200px" }}
                >
                  <option>выберите...</option>
                  {availableSlotsList}
                </Form.Select>

                <Button variant="outline-secondary" type="null" onClick={(e) => this.generateAvailablePeriods(e)} disabled={false}>
                  Доступыне окна...
                </Button>
                <AvailableTeachersModal
                  show={showAvailableTeacherModal}
                  availableTeachers={availableTeachers}
                  updateAvailableSlots={this.updateAvailableSlots}
                  handleClose={this.handleCloseAvailableTeachersModal}
                />
              </InputGroup>

              <hr></hr>
              <div className="text-center">
                <Button variant="success" type="null" onClick={this.handleSave}>
                  Записать
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
