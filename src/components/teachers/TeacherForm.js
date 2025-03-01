import React from "react";
import { Form, Container, Row, Col, Table, FormCheck, Button } from "react-bootstrap";
import { DisciplinesControl } from "../common/DisciplinesControl";
import { SexControl } from "../common/SexControl";
import InputMask from "react-input-mask";
import WorkingPeriods from "./WorkingPeriods";

import { addTeacher, saveTeacher, getTeacher } from "../../services/apiTeacherService";

class TeacherForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type == "New",
      teacher:{
        teacherId: this.props.match.params.id,
        email: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        phone: "",
        sex: 1,
        userId: 1,
        disciplines: [] 
      },

      workingPeriods: [],

      periodDay: 0,
      periodStart: "",
      periodEnd: "",
      ageLimit: "",
      allowGroupLessons: false,
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getDayName = this.getDayName.bind(this);
    this.getValueOrEmptyString = this.getValueOrEmptyString.bind(this);
    this.addWorkingPeriod = this.addWorkingPeriod.bind(this);
    this.deleteWorkingPeriod = this.deleteWorkingPeriod.bind(this);
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

    console.log("onFormLoad");
    console.log(teacher);
    this.setState({
      teacher: {
        teacherId: this.props.match.params.id,
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        birthDate: teacher.birthDate,
        phone: "7" + teacher.phone,
        disciplines: teacher.disciplines,
        sex: teacher.sex,
        ageLimit: teacher.ageLimit,
        allowGroupLessons: teacher.allowGroupLessons,
      },
      workingPeriods: teacher.workingPeriods,
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
    if (this.state.isNew) {
      const response = await addTeacher(requestBody);
    } else {
      const response = await saveTeacher(this.state.teacher.teacherId, requestBody);
    }
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    const teacher = {...this.state.teacher};
    teacher[id] = value;
    //this.setState({ [id]: value });
    this.setState({teacher});
  };

  handleSexChange = (isChecked) => {
    const teacher = {...this.state.teacher};
    teacher.sex = isChecked;
    this.setState({teacher})
    
  };

  handlePeriodsChange = () => {};

  handleDisciplineCheck = (id, isChecked) => {
    this.setState((prevState) => {
      let newDisciplines = [...prevState.disciplines];
      if (isChecked) {
        newDisciplines.push(id);
      } else {
        newDisciplines = newDisciplines.filter((discipline) => discipline !== id);
      }
      return { disciplines: newDisciplines };
    });
  };

  handleAllowGroupLessonsChange = (e) => {
    this.setState({
      allowGroupLessons: e.target.isChecked,
    });
  };

  addWorkingPeriod = () => {
    console.log(this.state.periodDay);
    console.log(this.state);

    this.setState((prevState) => ({
      workingPeriods: [
        ...prevState.workingPeriods,
        {
          day: parseInt(this.state.periodDay),
          startTime: this.state.periodStart,
          endTime: this.state.periodEnd,
        },
      ],
    }));
  };

  deleteWorkingPeriod = (itemIndex) => {
    this.setState({
      WorkingPeriods: this.state.WorkingPeriods.filter(function (workingPeriod, index) {
        return index !== itemIndex;
      }),
    });
  };

  getDayName = (dayIndex) => {
    switch (dayIndex) {
      case 1:
        return "Понедельник";
      case 2:
        return "Вторник";
      case 3:
        return "Среда";
      case 4:
        return "Четверг";
      case 5:
        return "Пятница";
      case 6:
        return "Суббота";
      case 7:
        return "Воскресенье";
    }
  };

  render() {
    const { email, firstName, lastName, birthDate, phone, sex, ageLimit, allowGroupLessons, disciplines, branchId } = this.state.teacher;
    const { workingPeriods } = this.state;

    let workingPeriodsList;
    if (workingPeriods && workingPeriods.length > 0) {
      workingPeriodsList = workingPeriods.map((item, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{this.getDayName(item.day)}</td>
          <td>{item.startTime}</td>
          <td>{item.endTime}</td>
          <td>
            <Button onClick={() => this.deleteWorkingPeriod(index)}>
              <i>-</i>
            </Button>
          </td>
        </tr>
      ));
    } else {
      workingPeriodsList = (
        <tr key={1}>
          <td colSpan="5" style={{ textAlign: "center" }}>
            Нет записей
          </td>
        </tr>
      );
    }

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
                <Form.Select aria-label="Веберите..." value={branchId} onChange={(e) => this.setState({ branchId: e.target.value })}>
                  <option>выберите...</option>
                  <option value="1">На Абая</option>
                  <option value="2">На Аль-Фараби</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <b>Расписание</b>
                <Row style={{ marginTop: "20px" }}>
                  <Col md="5">
                    <Form.Select
                      aria-label="Веберите день..."
                      value={this.state.periodDay}
                      onChange={(e) => this.setState({ periodDay: e.target.value })}
                    >
                      <option>День недели...</option>
                      <option value="1">Понедельник</option>
                      <option value="2">Вторник</option>
                      <option value="3">Среда</option>
                      <option value="4">Четверг</option>
                      <option value="5">Пятница</option>
                      <option value="6">Суббота</option>
                      <option value="7">Воскресенье</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Row>
                      <Form.Label column md={1}>
                        с
                      </Form.Label>
                      <Col md={4}>
                        <Form.Control
                          as={InputMask}
                          mask="99:99"
                          maskChar=" "
                          placeholder="чч:мм"
                          value={this.state.periodStart}
                          onChange={(e) => this.setState({ periodStart: e.target.value })}
                        />
                      </Col>
                      <Form.Label column md={1}>
                        по
                      </Form.Label>
                      <Col md={4}>
                        <Form.Control
                          as={InputMask}
                          mask="99:99"
                          maskChar=" "
                          placeholder="чч:мм"
                          value={this.state.periodEnd}
                          onChange={(e) => this.setState({ periodEnd: e.target.value })}
                        />
                      </Col>
                      <Col md={2}>
                        <Button onClick={this.addWorkingPeriod}>
                          <i>+</i>
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Table striped bordered hover style={{ marginTop: "20px" }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>День</th>
                        <th>С</th>
                        <th>До</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {workingPeriodsList}
                    </tbody>
                  </Table>
                </Row>
              </Form.Group>

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
