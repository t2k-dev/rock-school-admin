import React from "react";
import { Form, Container, Row, Col, FormCheck, Button } from "react-bootstrap";

import { DisciplinesListControl } from "../common/DisciplinesListControl";
import { SexControl } from "../common/SexControl";
import InputMask from "react-input-mask";
import { ScheduleEditor } from "../common/ScheduleEditor";
import { format, parse } from "date-fns";

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

    console.log("on Teacher FormLoad");
    console.log(teacher);
    this.setState({
      teacher: {
        teacherId: this.props.match.params.id,
        //email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        birthDate: format(teacher.birthDate, "dd-MM-yyyy"),
        phone: "7" + teacher.phone,
        disciplines: teacher.disciplines,
        sex: teacher.sex,
        ageLimit: teacher.ageLimit,
        allowGroupLessons: teacher.allowGroupLessons,
        branchId: teacher.branchId,
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
    console.log("handleSave");
    console.log(this.state);
    
    e.preventDefault();
    const requestBody = {
      teacher: {
        email: this.state.teacher.email,
        firstName: this.state.teacher.firstName,
        lastName: this.state.teacher.lastName,
        birthDate: parse(this.state.teacher.birthDate, "dd-MM-yyyy", new Date()),
        sex: this.state.teacher.sex,
        phone: this.state.teacher.phone.replace("+7 ", "").replace(/\s/g, ""),
        disciplines: this.state.teacher.disciplines,
        branchId: this.state.teacher.branchId,
        ageLimit: this.state.teacher.ageLimit,
        allowGroupLessons: this.state.teacher.allowGroupLessons,
      },
      workingPeriods: this.state.workingPeriods,
    };

    let response;
    if (this.state.isNew) {
      response = await addTeacher(requestBody);

    } else {
      response = await saveTeacher(this.state.teacher.teacherId, requestBody);
    }

    const teacherId = response.data.teacherId;
    this.props.history.push(`/teacher/${teacherId}`);
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
  
    // Update disciplines array based on the isChecked value
    const newDisciplines = isChecked
      ? [...new Set([...teacher.disciplines, id])] // Add ID, ensuring no duplicates
      : teacher.disciplines.filter((discipline) => discipline !== id); // Remove ID
  
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

  handleDateChange = (date) =>{
    console.log(date);

    this.setState((prevState) => ({
      teacher: {
        ...prevState.teacher,
        birthDate: format(date, "dd-MM-yyyy"),
      }
    }));
  }

  render() {
    const { email, firstName, lastName, birthDate, phone, sex, ageLimit, allowGroupLessons, disciplines, branchId } = this.state.teacher;
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="mb-4 text-center">{this.state.isNew ? "Новый преподаватель" : "Редактировать преподавателя"}</h2>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="firstName">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control onChange={this.handleChange} value={firstName} placeholder="введите имя..." autoComplete="off" />
                </Form.Group>
                <Form.Group as={Col} controlId="lastName">
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control onChange={this.handleChange} value={lastName} placeholder="введите фамилию..." autoComplete="off"/>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="birthDate">
                  <Form.Label>Дата рождения</Form.Label>
                  <Form.Control
                    as={InputMask}
                    mask="99-99-9999"
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
              <DisciplinesListControl onCheck={this.handleDisciplineCheck} disciplines={disciplines}></DisciplinesListControl>

              <hr></hr>

              <Form.Group className="mb-4" controlId="branchId">
                <Form.Label>Филиал</Form.Label>
                <Form.Select aria-label="Веберите..." value={branchId} onChange={this.handleChange}>
                  <option>выберите...</option>
                  <option value="1">На Абая</option>
                  <option value="2">На Аль-Фараби</option>
                </Form.Select>
              </Form.Group>

              <ScheduleEditor 
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
