import React from "react";
import { Col, Form, FormCheck, Row } from "react-bootstrap";

export class DisciplinesListControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkboxes: [
        { id: 1, name: "Гитара", isChecked: false },
        { id: 2, name: "Электрогитара", isChecked: false },
        { id: 3, name: "Бас-гитара", isChecked: false },
        { id: 4, name: "Укулеле", isChecked: false },
        { id: 5, name: "Вокал", isChecked: false },
        { id: 6, name: "Барабаны", isChecked: false },
        { id: 7, name: "Фортепиано", isChecked: false },
        { id: 8, name: "Скрипка", isChecked: false },
        { id: 9, name: "Экстрим Вокал", isChecked: false },
      ],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.disciplines !== prevProps.disciplines) {
      this.setState((prevState) => {
        const updatedDisciplines = prevState.checkboxes.map((checkbox) => ({
          ...checkbox,
          isChecked: this.props.disciplines.includes(checkbox.id),
        }));
        return { checkboxes: updatedDisciplines };
      });
    }
  }

  handleChange = (checkboxId) => {
    this.setState((prevState) => {
      const updatedCheckboxes = prevState.checkboxes.map((checkbox) =>
        checkbox.id === checkboxId ? { ...checkbox, isChecked: !checkbox.isChecked } : checkbox
      );

      const updatedCheckbox = updatedCheckboxes.find((checkbox) => checkbox.id === checkboxId);
      this.props.onCheck(checkboxId, updatedCheckbox.isChecked); // Pass updated value to the parent

      return { checkboxes: updatedCheckboxes };
    });
  };

  render() {
    return (
      <Form.Group className="mb-3">
        <b>Направления</b>
        <Row>
          <Col>
            <FormCheck id={1} key={1} label="Гитара" checked={this.state.checkboxes[0].isChecked} onChange={() => this.handleChange(1)} style={{ marginTop: "10px" }}/>
            <FormCheck id={2} key={2} label="Электрогитара" checked={this.state.checkboxes[1].isChecked} onChange={() => this.handleChange(2)} style={{ marginTop: "10px" }}/>
            <FormCheck id={3} key={3} label="Бас-гитара" checked={this.state.checkboxes[2].isChecked} onChange={() => this.handleChange(3)} style={{ marginTop: "10px" }}/>
            <FormCheck id={4} key={4} label="Укулеле" checked={this.state.checkboxes[3].isChecked} onChange={() => this.handleChange(4)} style={{ marginTop: "10px" }}/>
          </Col>
          <Col>
            <FormCheck id={5} key={5} label="Вокал" checked={this.state.checkboxes[4].isChecked} onChange={() => this.handleChange(5)} style={{ marginTop: "10px" }}/>
            <FormCheck id={9} key={9} label="Экстрим Вокал" checked={this.state.checkboxes[8].isChecked} onChange={() => this.handleChange(9)} style={{ marginTop: "10px" }}/>

            <FormCheck id={6} key={6} label="Барабаны" checked={this.state.checkboxes[5].isChecked} onChange={() => this.handleChange(6)} style={{ marginTop: "20px" }}/>
            <FormCheck id={7} key={7} label="Фортепиано" checked={this.state.checkboxes[6].isChecked} onChange={() => this.handleChange(7)} style={{ marginTop: "10px" }}/>
            <FormCheck id={8} key={8} label="Скрипка" checked={this.state.checkboxes[7].isChecked} onChange={() => this.handleChange(8)} style={{ marginTop: "10px" }}/>
          </Col>
        </Row>
      </Form.Group>
    );
  }
}
