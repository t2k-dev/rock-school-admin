import React from "react";
import { Form, Container, Row, Col, Table, FormCheck, Button } from "react-bootstrap";
import { DisciplinesControl } from "../common/DisciplinesControl";
import { SexControl } from "../common/SexControl";
import InputMask from "react-input-mask";
import SchedulePicker from "../common/SchedulePicker";

import { addTeacher, saveTeacher, getTeacher } from "../../services/apiTeacherService";

class TeacherForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type == "New",
      teacher: {
        teacherId: "",
        //email: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        phone: "",
        sex: 1,
        //userId: 1,
        disciplines: [],
        brachId: 0,
        allowGroupLessons: false,
        ageLimit: "",
      },

      workingPeriods: [],
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getValueOrEmptyString = this.getValueOrEmptyString.bind(this);
    this.handlePeriodsChange = this.handlePeriodsChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    if (this.state.isNew) {
      return;
    }

    const id = this.props.match.params.id;
    const teacher = await getTeacher(id);

    const fakeWorkingPeriods = [
      {
        weekDay: 1,
        startTime: "09:00",
        endTime: "13:00",
      },
      {
        weekDay: 3,
        startTime: "09:00",
        endTime: "13:00",
      },
    ];

    console.log("onFormLoad");
    console.log(teacher);
    this.setState({
      teacher: {
        teacherId: this.props.match.params.id,
        //email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        birthDate: teacher.birthDate,
        phone: "7" + teacher.phone,
        disciplines: teacher.disciplines,
        sex: teacher.sex,
        ageLimit: teacher.ageLimit,
        allowGroupLessons: teacher.allowGroupLessons,
        branchId: teacher.branchId,
      },
      //workingPeriods: teacher.workingPeriods,
      workingPeriods: fakeWorkingPeriods,
    });
  }

  getValueOrEmptyString = (str) => {
    if (typeof str !== "undefined" && str) {
      return str;
    }

    return "";
  };

  handleSave = async (e) => {
    e.preventDefault();
    const requestBody = {
      teacher: {
        email: this.state.teacher.email,
        firstName: this.state.teacher.firstName,
        lastName: this.state.teacher.lastName,
        birthDate: this.state.teacher.birthDate,
        sex: this.state.teacher.sex,
        phone: this.state.teacher.phone.replace("+7 ", "").replace(/\s/g, ""),
        disciplines: this.state.teacher.disciplines,
        branchId: this.state.teacher.branchId,
        ageLimit: this.state.teacher.ageLimit,
        allowGroupLessons: this.state.teacher.allowGroupLessons,
      },
      workingPeriods: this.state.workingPeriods,
    };

    console.log(this.state);
    if (this.state.isNew) {
      const response = await addTeacher(requestBody);
    } else {
      const response = await saveTeacher(this.state.teacher.teacherId, requestBody);
    }
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    const teacher = { ...this.state.teacher };
    teacher[id] = value;
    //this.setState({ [id]: value });
    this.setState({ teacher });
  };

  handleSexChange = (isChecked) => {
    const teacher = { ...this.state.teacher };
    teacher.sex = isChecked;
    this.setState({ teacher });
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

  handleAllowGroupLessonsChange = (e) => {
    const teacher = { ...this.state.teacher };
    teacher.allowGroupLessons = e.target.isChecked;

    this.setState({ teacher });
  };

  handlePeriodsChange = (periods) => {
    this.setState({ workingPeriods: periods });
  };

  render() {
    const { email, firstName, lastName, birthDate, phone, sex, ageLimit, allowGroupLessons, disciplines, branchId } = this.state.teacher;
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 style={{ textAlign: "center" }}>{this.state.isNew ? "Новый преподаватель" : "Редактировать преподавателя"}</h2>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="firstName">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control onChange={this.handleChange} value={firstName} placeholder="введите имя..." autoComplete="off" />
                </Form.Group>
                <Form.Group as={Col} controlId="lastName">
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control onChange={this.handleChange} value={lastName} placeholder="введите фамилию..." />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="birthDate">
                  <Form.Label>Дата рождения</Form.Label>
                  <Form.Control
                    as={InputMask}
                    mask="9999-99-99"
                    maskChar=" "
                    onChange={this.handleChange}
                    value={birthDate}
                    placeholder="введите дату..."
                  />
                </Form.Group>
              </Row>
              <Row>
                <SexControl value={sex} onChange={this.handleSexChange}></SexControl>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="phone">
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

                <Form.Group as={Col} controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control onChange={this.handleChange} value={email} placeholder="введите email..." autoComplete="off" />
                </Form.Group>
              </Row>

              <hr></hr>
              <Form.Group className="mb-3" controlId="ageLimit">
                <Form.Label>Ученики от</Form.Label>
                <Form.Control onChange={this.handleChange} value={ageLimit} placeholder="введите возраст..." autoComplete="off" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="supportGroups">
                <FormCheck
                  id="supportGroups"
                  key="supportGroups"
                  label="Групповые занятия"
                  checked={allowGroupLessons}
                  onChange={this.handleAllowGroupLessonsChange}
                  style={{ marginTop: "10px" }}
                />
              </Form.Group>

              <hr></hr>
              <DisciplinesControl onCheck={this.handleDisciplineCheck} disciplines={disciplines}></DisciplinesControl>

              <hr></hr>

              <Form.Group className="mb-3" controlId="branchId">
                <Form.Label>Филиал</Form.Label>
                <Form.Select aria-label="Веберите..." value={branchId} onChange={this.handleChange}>
                  <option>выберите...</option>
                  <option value="1">На Абая</option>
                  <option value="2">На Аль-Фараби</option>
                </Form.Select>
              </Form.Group>

              <SchedulePicker 
                periods={this.state.workingPeriods} 
                handlePeriodsChange={this.handlePeriodsChange} 
              />

              <hr></hr>
              <Button variant="primary" type="null" onClick={this.handleSave}>
                Сохранить
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default TeacherForm;
