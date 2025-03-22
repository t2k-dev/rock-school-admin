import React from "react";
import { Modal, Form, Button, Badge } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { CalendarWeek } from "../common/CalendarWeek";
import { formatTime, formatDate } from "../common/DateTimeHelper";

export class AvailableTeachersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,
      availableTeachers: [],
      availableSlots: [],
      availableSlotsText: "",
    };

    this.handleClose = this.handleClose.bind(this);
    this.getAvailableSlots = this.getAvailableSlots.bind(this);
  }

  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate available");
    if (this.props.availableTeachers !== prevProps.availableTeachers) {
      this.setState({ availableTeachers: this.props.availableTeachers });
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  getAvailableSlots() {
    let result = "";
    this.state.availableSlots.forEach((element) => {
      result = result + element.description + "\n";
    });
    this.setState({ availableSlotsText: result });
  }

  handleSelectSlot = (teacher, slotInfo) => {
    const teacherId = teacher.teacherId;

    const updatedTeachers = [...this.state.availableTeachers];
    const teacherIndex = updatedTeachers.findIndex((teacher) => teacher.teacherId === teacherId);

    let slotId = uuidv4();

    if (teacherIndex !== -1) {
      const newEvent = {
        id: slotId,
        title: "Окно",
        start: slotInfo.start,
        end: slotInfo.end,
        isNew: true,
      };

      // Update the teacher's events array
      updatedTeachers[teacherIndex] = {
        ...updatedTeachers[teacherIndex],
        events: [...updatedTeachers[teacherIndex].events, newEvent],
      };
    }

    // Add the selected slot to the availableSlots array
    const newSlot = {
      id: slotId,
      teacherId: teacherId,
      teacherFullName: teacher.firstName + " " + teacher.lastName,
      start: slotInfo.start,
      end: slotInfo.end,
      description: teacher.firstName + " " + teacher.lastName + ": " + formatDate(slotInfo.start) + " в " + formatTime(slotInfo.start)
    };

    const updatedAvailableSlots = [...this.state.availableSlots, newSlot];

    // Update the state with the modified array
    this.setState({
      availableTeachers: updatedTeachers,
      availableSlots: updatedAvailableSlots,
    });
    
    this.props.updateAvailableSlots(updatedAvailableSlots);
  };

  handleSelectEvent = (teacherId, slotInfo) => {
    if (!slotInfo.isNew){
      return;
    }
    // update available slots
    const updatedSlots = this.state.availableSlots.filter((s) => s.id !== slotInfo.id);

    // update teacher events
    const updatedTeachers = [...this.state.availableTeachers];
    const teacherIndex = updatedTeachers.findIndex((teacher) => teacher.teacherId === teacherId);

    if (teacherIndex !== -1) {
      updatedTeachers[teacherIndex] = {
        ...updatedTeachers[teacherIndex],
        events: [...updatedTeachers[teacherIndex].events.filter((s) => s.id !== slotInfo.id)],
      };
    }

    this.setState({ availableSlots: updatedSlots, availableTeachers: updatedTeachers });
  };

  render() {
    const { availableTeachers, availableSlotsText } = this.state;

    let availableTeachersList;
    if (availableTeachers && availableTeachers.length > 0) {
      availableTeachersList = availableTeachers.map((item, index) => {
        return (
          <div className="mb-4" key={index} id={`teacher-${item.teacherId}`}>
            <div className="mb-3">
              <span style={{ fontWeight: "bold" }}>
                {item.firstName} {item.lastName}
              </span>
              <Badge className="ms-1" bg="danger">
                Загруженность 11%
              </Badge>
            </div>
            <CalendarWeek
              backgroundEvents={item.workingPeriods}
              events={item.events}
              onSelectSlot={(slotInfo) => {
                this.handleSelectSlot(item, slotInfo);
              }}
              onSelectEvent={(slotInfo) => {
                this.handleSelectEvent(item.teacherId, slotInfo);
              }}
            />
          </div>
        );
      });
    } else {
      <h3>Нет доступных преподавателей.</h3>;
    }

    return (
      <>
        <Modal size="lg" show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Доступные преподаватели</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {availableTeachersList}
            <Form.Group className="mb-3" controlId="availableSlotsText">
              <Form.Label>Свободные окна</Form.Label>
              <Form.Control as="textarea" value={availableSlotsText} style={{ height: "100px" }} placeholder="" />
            </Form.Group>
            <Form.Group>
              <Button variant="outline-secondary" type="null" onClick={this.getAvailableSlots}>
                Получить доступыне окна
              </Button>
            </Form.Group>
          </Modal.Body>
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
