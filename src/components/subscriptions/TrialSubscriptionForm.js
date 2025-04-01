import React from "react";
import { Form, Container, Row, Col, Button, Nav } from "react-bootstrap";
import InputMask from "react-input-mask";

import { DisciplinesDropDownControl } from "../common/DisciplinesDropDownControl";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

import { addTrialSubscription } from "../../services/apiSubscriptionService";
import { getAvailableTeachers } from "../../services/apiTeacherService";

export class TrialSubscriptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExistingStudent: false,

      firstName: "",
      lastName: "",
      age: "",
      level: 0,
      phone:"",
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
    console.log("response.availableTeachers");
    console.log(response.data);
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


    const selectedSlot = this.state.availableSlots.filter((s)=> s.id === this.state.selectedSlotId)[0];
    
    console.log(this.state.selectedSlotId)
    console.log(this.state.availableSlots)
    console.log(selectedSlot)

    const requestBody = {
      disciplineId: this.state.disciplineId,
      branchId: 1,// DEV: map after clarification
      teacherId: selectedSlot.teacherId,
      trialDate: selectedSlot.start,
      studentInfo:{
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        age: this.state.age,
        phone: this.state.phone.replace("+7 ", "").replace(/\s/g, ""),
        level: this.state.level,
      }
    };

    console.log(requestBody)

    const response = await addTrialSubscription(requestBody);
    //const newStudentId = response.data;

    //this.props.history.push("/student/" + "01952471-c83f-7932-b28e-94bd45791589");
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
      isExistingStudent,
      firstName,
      lastName,
      phone,
      age,
      disciplineId,
      showAvailableTeacherModal,
      availableTeachers,
      availableSlots,
      selectedSlotId,
      level,
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
              <Nav variant="tabs" defaultActiveKey="new" className="mb-3" fill="true">
                <Nav.Item>
                  <Nav.Link
                    eventKey="new"
                    onClick={() => {
                      this.newStudentSelected();
                    }}
                  >
                    Новый ученик
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="existing"
                    onClick={() => {
                      this.existingStudentSelected();
                    }}
                    disabled
                  >
                    Существующий
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              {!isExistingStudent && (
                <>
                  {" "}
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control onChange={this.handleChange} value={firstName} placeholder="введите имя..." autoComplete="off" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="lastName">
                    <Form.Label>Фамилия</Form.Label>
                    <Form.Control onChange={this.handleChange} value={lastName} placeholder="введите фамилию..." />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Телефон</Form.Label>
                    <Form.Control
                      as={InputMask}
                      mask="+7 999 999 99 99"
                      maskChar=" "
                      onChange={this.handleChange}
                      value={phone}
                      placeholder="введите телефон..."
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="age">
                    <Form.Label>Возраст</Form.Label>
                    <Form.Control as={InputMask} mask="999" maskChar="" onChange={this.handleChange} value={age} placeholder="введите число..." autoComplete="off"/>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="level">
                    <Form.Label>Уровень</Form.Label>
                    <Form.Select name="level" aria-label="Веберите..." value={level} onChange={(e) => this.setState({ level: e.target.value })}>
                        <option>выберите...</option>
                        <option value="0">0 - Начинающий</option>
                        <option value="1">1 - Начинающий</option>
                        <option value="2">2 - Начинающий</option>
                        <option value="3">3 - Продолжающий</option>
                        <option value="4">4 - Продолжающий</option>
                        <option value="5">5 - Продолжающий</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10 - Бог</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}
              {isExistingStudent && (
                <>
                  {" "}
                  <Form.Group className="mb-3" controlId="studentId">
                    <Form.Label>Ученик</Form.Label>
                    <Form.Select aria-label="Веберите..." value={fakeId} onChange={(e) => this.setState({ fakeId: e.target.value })}>
                      <option>выберите...</option>
                      <option value="1">Аделаида</option>
                      <option value="2">Семён</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}

              <DisciplinesDropDownControl value={disciplineId} onChange={(e) => this.handleDisciplineChange(e)} />

              <Form.Group className="mb-3 mt-4 text-center" controlId="GenerteSchedule">
                <Button variant="outline-secondary" type="null" onClick={(e) => this.generateAvailablePeriods(e)} disabled={false}>
                  Получить доступыне окна
                </Button>
                <AvailableTeachersModal
                  show={showAvailableTeacherModal}
                  availableTeachers={availableTeachers}
                  updateAvailableSlots={this.updateAvailableSlots}
                  handleClose={this.handleCloseAvailableTeachersModal}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="selectedSlot">
                <Form.Label>Выбранное окно</Form.Label>
                <Form.Select aria-label="Веберите..." value={selectedSlotId} onChange={(e) => this.setState({ selectedSlotId: e.target.value })}>
                  <option>выберите...</option>
                  {availableSlotsList}
                </Form.Select>
              </Form.Group>

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
