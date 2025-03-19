import React from "react";
import { Form, Row, Col, FormCheck } from "react-bootstrap";

export class DisciplinesDropDownControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disciplineId:"",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.disciplines !== prevProps.disciplines) {
      this.setState((prevState) => {
        let updatedDisciplines = prevState.checkboxes.map((checkbox) => ({
          ...checkbox,
          isChecked: this.props.disciplines.includes(checkbox.id),
        }));
        return { checkboxes: updatedDisciplines };
      });
    }
  }

  handleChange = (checkboxId) => {
    this.setState((prevState) => {
      let updatedCheckboxes = [...prevState.checkboxes];
      let checkbox = updatedCheckboxes.find((checkbox) => checkbox.id === checkboxId);
      checkbox.isChecked = !checkbox.isChecked;
      return { checkboxes: updatedCheckboxes };
    });
    this.props.onCheck(checkboxId, !this.state.checkboxes.find((checkbox) => checkbox.id === checkboxId).isChecked);
  };

  render() {
    const {disciplineId} = this.state;
    return (
      <Form.Group className="mb-3" controlId="discipline">
        <Form.Label>Направление</Form.Label>
        <Form.Select aria-label="Веберите..." value={disciplineId} onChange={(e) => this.setState({ disciplineId: e.target.value })}>
          <option>выберите...</option>
          <option value="1">Гитара</option>
          <option value="2">Электро гитара</option>
          <option value="3">Бас гитара</option>
          <option value="4">Укулеле</option>
          <option value="5">Вокал</option>
          <option value="6">Ударные</option>
          <option value="7">Фортепиано</option>
          <option value="8">Скрипка</option>
          <option value="9">Экстрим вокал</option>
        </Form.Select>
      </Form.Group>
    );
  }
}
