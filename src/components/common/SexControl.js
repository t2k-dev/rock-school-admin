import React from "react";
import {  Form } from "react-bootstrap";

export class SexControl extends React.Component {
  
  handleSexClick = (e) => {
    const { id } = e.target;
    if (e.target.id === "rb_male") {
        this.props.onChange(1);
    } else {
        this.props.onChange(2);
    }
  };

  render() {
    const isMale = this.props.value === 1;
    const isFemale = this.props.value === 2;
    return (
      <Form.Group className="mb-3" controlId="sex">
        <Form.Label>Пол</Form.Label>
        <div className="mb-3">
          <Form.Check
            inline
            label="Мужской"
            name="group1"
            type="radio"
            id="rb_male"
            checked={isMale}
            onChange={this.handleSexClick}
          />
          <Form.Check
            inline
            label="Женский"
            name="group1"
            type="radio"
            id="rb_female"
            checked={isFemale}
            onChange={this.handleSexClick}
          />
        </div>
      </Form.Group>
    );
  }
}
