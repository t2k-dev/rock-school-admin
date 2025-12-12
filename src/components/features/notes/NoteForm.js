import { parse } from "date-fns";
import React from "react";

import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import { addNote, saveNote } from "../../../services/apiNoteService";

import { ru } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class NoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: props.type == "New",
      note: {
        branchId: 1,
        status: 1,
      },
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { state } = this.props.location;
    if (state && state.note) {
      this.setState({ note: state.note });
    }
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    const note = this.state.note;
    note[id] = value;
    this.setState({ note: note });
  };

  handleUpdateCompleteDate = (date) => {
    const note = { ...this.state.note };
    note.completeDate = date;
    this.setState({ note });
}

   handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
      branchId: this.state.note.branchId,
      description: this.state.note.description,
      status: this.state.note.status,
      comment: this.state.note.comment,
      completeDate: this.state.note.completeDate,
      actualCompleteDate: this.state.note.actualCompleteDate,
    };

    if (this.state.isNew) {
      const response = await addNote(requestBody);
    }
    else{
      await saveNote(this.state.note.noteId, requestBody)
    }

    this.props.history.push("/home");
  };

  render() {
    const { description, comment, completeDate, status } = this.state.note;
    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 style={{ textAlign: "center" }}>{this.state.isNew ? "Новая активность" : "Редактировать активность"}</h2>
            <Form>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Описание</Form.Label>
                <Form.Control onChange={this.handleChange} value={description} placeholder="введите текст..." autoComplete="off" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="status">
                <Form.Label>Статус</Form.Label>
                <Form.Select name="status" aria-label="Веберите..." value={status} onChange={this.handleChange}>
                  <option>выберите...</option>
                  <option value="1">Новое</option>
                  <option value="2">Отменено</option>
                  <option value="3">Выполнено</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="comment">
                <Form.Label>Комментарий</Form.Label>
                <Form.Control as="textarea" onChange={this.handleChange} value={comment} placeholder="введите текст..." autoComplete="off" />
              </Form.Group>

              <Form.Group>
                <Form.Label>Дата</Form.Label>
                <div style={{ display: "block" }}>
                  <InputGroup className="mb-3 " controlId="completeDate">
                    <Form.Control
                      as={DatePicker}
                      locale={ru} // Russian locale for date
                      selected={completeDate} // Correctly bind the date object
                      onChange={(date) => {
                        if (date) {
                          this.handleUpdateCompleteDate(date);
                        }
                      }}
                      onChangeRaw={(e) => {
                        const rawValue = e.target.value;
                        try {
                          // Parse the raw input based on the expected format
                          const parsedDate = parse(rawValue, "dd.MM.yyyy HH:mm", new Date());
                          if (!isNaN(parsedDate)) {
                            this.handleUpdateCompleteDate(parsedDate);
                          }
                        } catch (error) {
                          console.error("Invalid date format"); // Handle invalid format
                        }
                      }}
                      dateFormat="dd.MM.yyyy HH:mm" // Format for the displayed date
                      placeholderText="дд.мм.гггг чч:мм" // Input placeholder
                      shouldCloseOnSelect={true}
                    />
                    <Button variant="outline-secondary" onClick={() => this.handleUpdateCompleteDate(new Date())}>
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
