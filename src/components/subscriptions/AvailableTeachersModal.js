import React from "react";
import { Modal, Button } from "react-bootstrap";
import WeekCalendar from "../common/WeekCalendar";

class AvailableTeachersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    const availableTeachers = this.props.availableTeachers;

    let availableTeachersList;
    if (availableTeachers && availableTeachers.length > 0) {
      availableTeachersList = availableTeachers.map((item, index) => {
        return (
          <div key={index} id={`teacher-${item.teacherId}`}>
            <h3>{item.FirstName}</h3>
            <WeekCalendar backgroundEvents={item.WorkingPeriods} />
          </div>
        );
      });
    } else {
        <h3>Нет доступных преподавателей.</h3>
    }

    return (
      <>
        <Modal size="lg" show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Доступные преподаватели</Modal.Title>
          </Modal.Header>
          <Modal.Body>{availableTeachersList}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default AvailableTeachersModal;