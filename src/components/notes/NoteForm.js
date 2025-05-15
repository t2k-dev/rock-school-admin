import { parse } from "date-fns";
import React from "react";

import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import { addNote } from "../../services/apiNoteService";

import { ru } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class NoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      completeDate: "",
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSave = (e) => {
    e.preventDefault();

    const requestBody = {
      description: this.state.description,
      completeDate: "2025-05-10 12:00:00", //this.state.completeDate + " 12:00:00",
      branchId: 1, //DEV
    };
    const response = addNote(requestBody);
    this.props.history.push("/home");
  };

  render() {
    const { description, completeDate } = this.state;
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 style={{ textAlign: "center" }}>Новая активность</h2>
            <Form>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Описание</Form.Label>
                <Form.Control onChange={this.handleChange} value={description} placeholder="введите текст..." autoComplete="off" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Дата начала</Form.Label>
                <div style={{ display: "block" }}>
                  <InputGroup className="mb-3 " controlId="completeDate">
                    <Form.Control
                      as={DatePicker}
                      locale={ru} // Russian locale for date
                      selected={completeDate} // Correctly bind the date object
                      onChange={(date) => {
                        if (date) {
                          this.setState({ completeDate: date }); // Store the Date object in state
                        }
                      }}
                      onChangeRaw={(e) => {
                        const rawValue = e.target.value;
                        try {
                          // Parse the raw input based on the expected format
                          const parsedDate = parse(rawValue, "dd.MM.yyyy", new Date());
                          if (!isNaN(parsedDate)) {
                            this.setState({ completeDate: parsedDate }); // Only set valid dates
                          }
                        } catch (error) {
                          console.error("Invalid date format"); // Handle invalid format
                        }
                      }}
                      dateFormat="dd.MM.yyyy" // Format for the displayed date
                      placeholderText="дд.мм.гггг" // Input placeholder
                      shouldCloseOnSelect={true}
                    />
                    <Button variant="outline-secondary" onClick={() => this.setState({ completeDate: new Date() })}>
                      Сегодня
                    </Button>
                  </InputGroup>
                </div>
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

export default NoteForm;
