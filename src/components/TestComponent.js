import React from "react";
import { Button } from "react-bootstrap";


export class TestComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disciplineId: this.props.location.state.disciplineId,
    };

    this.handleConfirmAndSubscribe = this.handleConfirmAndSubscribe.bind(this);
  }

  handleConfirmAndSubscribe = async (e) => {
    e.preventDefault();

    //const { student, teacher, disciplineId } = this.state.attendance;
    this.props.history.push(`/TestComponent2`, { disciplineId: 5 },
    );
  };

  render() {
    const { disciplineId } = this.state;

    return (
      <>
        <Button onClick={this.handleConfirmAndSubscribe}>Ok</Button>
      </>
    );
  }
}
