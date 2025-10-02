import React from "react";
import { Button, Modal, Tab, Tabs } from "react-bootstrap";

import { sub } from "date-fns";

import { addStudent } from "../../services/apiStudentService";
import { StudentFormFields } from "./StudentFormFields";

export class AddStudentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      phone: "",
      level: 0,
      sex: 1,
      age: "",
    };
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleAgeChange = (e) => {
    const age = parseInt(e.target.value, 10); // Parse the age as an integer

    if (!isNaN(age) && age > 0) {
      const birthDate = sub(new Date(), { years: age });

      this.setState({
        age: age,
        birthDate: birthDate,
      });
    } else {
      // Clear the `birthDate` if the age is invalid
      this.setState({
        age: e.target.value,
        birthDate: "",
      });
    }
  };

  handleSexChange = (value) => {
    this.setState({ sex: value });
  };

  handleSave = async () => {
    const { email, firstName, lastName, birthDate, phone, level, sex } = this.state;

    const requestBody = {
      //email: this.state.email,
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
      sex: sex,
      phone: phone.replace("+7 ", "").replace(/\s/g, ""),
      level: level,
      branchId: 1, // DEV: ???
    };

    let studentId;

    const response = await addStudent(requestBody);
    studentId = response.data;

    const newStudent = { studentId, email, firstName, lastName, birthDate, phone, level, sex };
    if (this.props.onAddStudent) {
      this.props.onAddStudent(newStudent);
    }

    this.props.handleClose();
  };

  render() {
    const { show, handleClose } = this.props;
    const { email, firstName, lastName, birthDate, phone, level, sex, age } = this.state;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить ученика</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="new" id="students-tab" className="mb-3" fill>
            <Tab eventKey="new" title="Новый">
              <StudentFormFields
                isNew={true}
                email={email}
                firstName={firstName}
                lastName={lastName}
                birthDate={birthDate}
                phone={phone}
                level={level}
                sex={sex}
                age={age}
                handleChange={this.handleChange}
                handleAgeChange={this.handleAgeChange}
                handleSexChange={this.handleSexChange}
              />
            </Tab>
            <Tab eventKey="existing" title="Существующий"></Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleSave}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
