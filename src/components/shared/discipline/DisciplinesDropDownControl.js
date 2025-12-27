import React from "react";
import { Form } from "react-bootstrap";

export class DisciplinesDropDownControl extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOnChange = (e) =>{
    this.props.onChange(e);
  }

  render() {
    return (
      <Form.Group className="mb-3" controlId="discipline">
        <Form.Label>Направление</Form.Label>
        <Form.Select aria-label="Веберите..." value={this.props.value} onChange={this.handleOnChange}>
          <option>выберите...</option>
          <option value="1">Гитара</option>
          <option value="2">Электро гитара</option>
          <option value="3">Бас гитара</option>
          <option value="4">Укулеле</option>
          <option value="5">Вокал</option>
          <option value="6">Барабаны</option>
          <option value="7">Фортепиано</option>
          <option value="8">Скрипка</option>
          <option value="9">Экстрим вокал</option>
        </Form.Select>
      </Form.Group>
    );
  }
}
