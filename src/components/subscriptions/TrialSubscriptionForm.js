import React from "react";
import { Form, Container, Row, Col, Button, Nav } from "react-bootstrap";
import InputMask from "react-input-mask";

import { DisciplinesDropDownControl } from "../common/DisciplinesDropDownControl";
import { AvailableTeachersModal } from "../teachers/AvailableTeachersModal";

import { addStudent } from "../../services/apiStudentService";
import { getAvailablePeriods } from "../../services/apiTeacherService";

const backgroundEvents = [
  {
    title: "",
    start: new Date(1900, 0, 2, 11, 0, 0, 0),
    end: new Date(1900, 0, 2, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 2, 16, 0, 0, 0),
    end: new Date(1900, 0, 2, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 3, 10, 0, 0, 0),
    end: new Date(1900, 0, 3, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 3, 16, 0, 0, 0),
    end: new Date(1900, 0, 3, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 4, 10, 0, 0, 0),
    end: new Date(1900, 0, 4, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 4, 16, 0, 0, 0),
    end: new Date(1900, 0, 4, 21, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 7, 10, 0, 0, 0),
    end: new Date(1900, 0, 7, 15, 0, 0, 0),
  },
  {
    title: "",
    start: new Date(1900, 0, 7, 16, 0, 0, 0),
    end: new Date(1900, 0, 7, 21, 0, 0, 0),
  },
];
const events = [
  {
    title: "Занято",
    start: new Date(1900, 0, 2, 11, 0, 0, 0),
    end: new Date(1900, 0, 2, 12, 0, 0, 0),
  },
  {
    title: "Занято",
    start: new Date(1900, 0, 2, 14, 0, 0, 0),
    end: new Date(1900, 0, 2, 15, 0, 0, 0),
  },
  {
    title: "Занято",
    start: new Date(1900, 0, 4, 18, 0, 0, 0),
    end: new Date(1900, 0, 4, 19, 0, 0, 0),
  },
  {
    title: "Занято",
    start: new Date(1900, 0, 4, 19, 0, 0, 0),
    end: new Date(1900, 0, 4, 20, 0, 0, 0),
  },
];

export class TrialSubscriptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExistingStudent: false,
      firstName: "",
      age: "",
      branchId: 0,

      backgroundEvents: backgroundEvents,
      events: events,
      generatedSchedule: "",

      disciplineId: "",
      availableTeachers: [],
      showAvailableTeacherModal: false,
      fakeId: "",
    };

    // AvailableTeachersModal
    this.generateAvailablePeriods = this.generateAvailablePeriods.bind(this);
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.newStudentSelected = this.newStudentSelected.bind(this);
    this.existingStudentSelected = this.existingStudentSelected.bind(this);
  }
  newStudentSelected = () => {
    this.setState({ isExistingStudent: false });
  };
  existingStudentSelected = () => {
    this.setState({ isExistingStudent: true });
  };

  generateAvailablePeriods = async (e) => {
    e.preventDefault();
    const fakeAvailableTeachers = [
      {
        teacherId: "01958931-da30-780a-aadc-e99ae26bd87f",
        firstName: "Варвара",
        lastName: "Епанчина",
        workingPeriods: backgroundEvents,
        events: events,
      },
    ];

    //const response = await getAvailablePeriods(this.state.disciplineId, this.state.studentId, 1);

    this.setState({
      teachers: ["Варвара", "2"],
      availableTeachers: fakeAvailableTeachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
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

    const requestBody = {
      firstName: this.state.firstName,
      age: this.state.age,
      sex: this.state.sex,
      phone: this.state.phone.replace("+7 ", "").replace(/\s/g, ""),
      level: this.state.level,
      branchId: this.state.branchId,
    };

    const response = await addStudent(requestBody);
    const newStudentId = response.data;

    this.props.history.push("/student/" + newStudentId);
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

  render() {
    const { isExistingStudent, firstName, age, showAvailableTeacherModal, availableTeachers, fakeId } = this.state;
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="text-center mb-4">Пробное занятие</h2>
            <Form>
              <Nav variant="tabs" defaultActiveKey="new" className="mb-3" fill="true">
                <Nav.Item>
                  <Nav.Link eventKey="new" onClick={this.newStudentSelected}>
                    Новый ученик
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="existing" onClick={this.existingStudentSelected}>Существующий</Nav.Link>
                </Nav.Item>
              </Nav>
              {!isExistingStudent && (
                <>
                  {" "}
                  <Form.Group className="mb-3" controlId="firstName">
                    <Form.Label>Имя</Form.Label>
                    <Form.Control onChange={this.handleChange} value={firstName} placeholder="введите имя..." autoComplete="off" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="age">
                    <Form.Label>Возраст</Form.Label>
                    <Form.Control as={InputMask} mask="999" maskChar=" " onChange={this.handleChange} value={age} placeholder="введите число..." />
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
              <DisciplinesDropDownControl />

              <Form.Group className="mb-3 mt-4 text-center" controlId="GenerteSchedule">
                <Button variant="outline-secondary" type="null" onClick={this.generateAvailablePeriods}>
                  Получить доступыне окна
                </Button>
                <AvailableTeachersModal
                  show={showAvailableTeacherModal}
                  availableTeachers={availableTeachers}
                  handleClose={this.handleCloseAvailableTeachersModal}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="fakeId">
                <Form.Label>Выбранное окно</Form.Label>
                <Form.Select aria-label="Веберите..." value={fakeId} onChange={(e) => this.setState({ fakeId: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">Варвара: 22.03.2025 12:00</option>
                  <option value="2">Варвара: 22.03.2025 14:00</option>
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
