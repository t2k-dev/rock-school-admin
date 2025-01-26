import React from "react";
import { Form, Row, Col, FormCheck } from "react-bootstrap";

export class DisciplinesControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkboxes: [
        { id: 1, name: "Гитара", isChecked: false },
        { id: 2, name: "Электрогитара", isChecked: false },
        { id: 3, name: "Бас-гитара", isChecked: false },
        { id: 4, name: "Укулеле", isChecked: false },
        { id: 5, name: "Вокал", isChecked: false },
        { id: 6, name: "Ударные", isChecked: false },
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
      let checkbox = updatedCheckboxes.find(
        (checkbox) => checkbox.id === checkboxId
      );
      checkbox.isChecked = !checkbox.isChecked;
      return { checkboxes: updatedCheckboxes };
    });
    this.props.onCheck(
      checkboxId,
      !this.state.checkboxes.find((checkbox) => checkbox.id === checkboxId)
        .isChecked
    );
  };

  render() {
    return (
      <Form.Group className="mb-3">
        <b>Дисциплины</b>
        <Row>
          <Col>
            {this.state.checkboxes.map((checkbox) => (
              <div key={checkbox.id}>
                <FormCheck
                  id={checkbox.id}
                  key={checkbox.id}
                  label={checkbox.name}
                  checked={checkbox.isChecked}
                  onChange={() => this.handleChange(checkbox.id)}
                  style={{ marginTop: "10px" }}
                />
              </div>
            ))}
          </Col>
        </Row>
      </Form.Group>
    );
  }
}
