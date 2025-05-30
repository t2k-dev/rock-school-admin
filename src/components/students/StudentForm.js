import { parse } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";

import { addStudent, getStudent, saveStudent } from "../../services/apiStudentService";
import { calculateDateFromAge } from "../common/DateTimeHelper";
import { SexControl } from "../common/SexControl";

class StudentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: props.type === "New",
      email: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      phone: "",
      userId: "",
      level: 0,
      sex: 1,
      studentId: "",
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    if (this.state.isNew) return;

    const id = this.props.match.params.id;
    const student = await getStudent(id);

    this.setState({
      studentId: id,
      email: student.data.email,
      firstName: student.data.firstName,
      lastName: student.data.lastName,
      birthDate: student.data.birthDate,
      phone: "7" + student.data.phone,
      age: 0,
      sex: student.data.sex,
      level: student.data.level,
    });

    console.log(this.state);
  }

  handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
      //email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      birthDate: this.state.birthDate,
      sex: this.state.sex,
      phone: this.state.phone.replace("+7 ", "").replace(/\s/g, ""),
      level: this.state.level,
      branchId: 1,
    };

    let studentId;
    if (this.state.isNew) {
      const response = await addStudent(requestBody);
      studentId = response.data;
    } else {
      const response = await saveStudent(this.state.studentId, requestBody);
      studentId = response.data;
    }

    this.props.history.push(`/student/${studentId}`);
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleAgeChange = (e) => {
    const age = e.target.value;
    const birthDate = calculateDateFromAge(age);
    this.setState({ birthDate: birthDate });
  };

  handleSexChange = (isChecked) => {
    this.setState({
      sex: isChecked,
    });
  };

  render() {
    const { isNew, email, firstName, lastName, birthDate, phone, level, sex, age } = this.state;
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="mb-4 text-center">{this.state.isNew ? "Новый ученик" : "Редактировать ученика"}</h2>
            <Form>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>Имя</Form.Label>
                <Form.Control onChange={this.handleChange} value={firstName} placeholder="введите имя..." autoComplete="off" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Фамилия</Form.Label>
                <Form.Control onChange={this.handleChange} value={lastName} placeholder="введите фамилию..." autoComplete="off" />
              </Form.Group>
              {isNew === false && (
                <Form.Group className="mb-3" controlId="birthDate">
                  <Form.Label>Дата рождения</Form.Label>
                  <div>
                    <Form.Control
                      as={DatePicker}
                      locale={ru}
                      selected={birthDate}
                      onChange={(date) => {
                        if (date) {
                          this.setState({ birthDate: date });
                        }
                      }}
                      onChangeRaw={(e) => {
                        const rawValue = e.target.value;
                        try {
                          // Parse the raw input based on the expected format
                          const parsedDate = parse(rawValue, "dd.MM.yyyy", new Date());
                          if (!isNaN(parsedDate)) {
                            this.setState({ birthDate: parsedDate }); // Only set valid dates
                          }
                        } catch (error) {
                          console.error("Invalid date format"); // Handle invalid format
                        }
                      }}
                      dateFormat="dd.MM.yyyy" // Format for the displayed date
                      placeholderText="дд.мм.гггг" // Input placeholder
                      shouldCloseOnSelect={true}
                    />
                  </div>
                </Form.Group>
              )}
              {isNew && (
                <Form.Group className="mb-3" controlId="age">
                  <Form.Label>Возраст</Form.Label>
                  <Form.Control onChange={this.handleAgeChange} value={age} placeholder="введите возраст..." autoComplete="off" />
                </Form.Group>
              )}
              <SexControl value={sex} onChange={this.handleSexChange}></SexControl>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control onChange={this.handleChange} value={email} placeholder="введите email..." autoComplete="off" />
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

              <hr></hr>

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

export default StudentForm;
