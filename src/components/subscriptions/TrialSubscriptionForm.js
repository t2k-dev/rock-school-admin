import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import { DisciplinesDropDownControl } from "../common/DisciplinesDropDownControl";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

import { addTrialSubscription } from "../../services/apiSubscriptionService";
import { getAvailableTeachers } from "../../services/apiTeacherService";

export class TrialSubscriptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExistingStudent: false,

      branchId: 0,
      disciplineId: "",

      backgroundEvents: [],
      availableTeachers: [],
      availableSlots: [],
      showAvailableTeacherModal: false,
      selectedSlotId: 0,
    };

    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

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

  updateAvailableSlots = (availableSlots) => {
    this.setState({ availableSlots: availableSlots });
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleDisciplineChange = (e) => {
    this.setState({ disciplineId: e.target.value });
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

    const response = await addTrialSubscription(requestBody);
    const newStudentId = response.data;

    this.props.history.push(`/student/${newStudentId}`);
  };

  render() {
    console.log(this.state)
    const {
      disciplineId,
      showAvailableTeacherModal,
      availableTeachers,
      availableSlots,
      selectedSlotId,
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
