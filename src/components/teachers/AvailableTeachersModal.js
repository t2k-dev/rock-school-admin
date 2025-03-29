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
    console.log("handleSelectSlot")
    const teacherId = teacher.teacherId;

    const updatedTeachers = [...this.state.availableTeachers];
    const teacherIndex = updatedTeachers.findIndex((teacher) => teacher.teacherId === teacherId);

    let slotId = uuidv4();

    if (teacherIndex !== -1) {
      //TODO: refactor
      const newAttendance = {
        id: slotId,
        title: "Окно",
        startDate: slotInfo.start,
        endDate: slotInfo.end,
        isNew: true,
      };

      const currentAttendancies = updatedTeachers[teacherIndex].attendancies ?? [];

      // Update the teacher's events array
      updatedTeachers[teacherIndex] = {
        ...updatedTeachers[teacherIndex],
        attendancies: [...currentAttendancies, newAttendance],
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
    console.log("handleSelectEvent")
    if (!slotInfo.isNew){
      return;
    }
    // update available slots
    const updatedSlots = this.state.availableSlots.filter((s) => s.id !== slotInfo.id);

    // update teacher events
    const updatedTeachers = [...this.state.availableTeachers];
    const teacherIndex = updatedTeachers.findIndex((teacher) => teacher.teacherId === teacherId);
    console.log(updatedTeachers);
    console.log("slotInfo");
    console.log(slotInfo);

    if (teacherIndex !== -1) {
      updatedTeachers[teacherIndex] = {
        ...updatedTeachers[teacherIndex],
        attendancies: [...updatedTeachers[teacherIndex].attendancies.filter((s) => s.id !== slotInfo.id)],
      };
    }

    this.setState({ availableSlots: updatedSlots, availableTeachers: updatedTeachers });
  };

  render() {
    const { availableTeachers, availableSlotsText } = this.state;

    let availableTeachersList;
    if (availableTeachers && availableTeachers.length > 0) {
      let backgroundEvents;
      let events;
      availableTeachersList = availableTeachers.map((teacher, index) => {
        // Working periods
        if (teacher.scheduledWorkingPeriods){
          backgroundEvents = teacher.scheduledWorkingPeriods.map((period) => ({
           id: period.scheduledWorkingPeriodId,
           start: period.startDate,
           end: period.endDate,
         }));
       
         // Events
         events = teacher.attendancies.map((attendance) => ({
          id: attendance.attendanceId,
          title: "Окно",
          start: attendance.startDate,
          end: attendance.endDate,
          isNew: attendance.isNew,
         }));
       }

        return (
          <div className="mb-4" key={index} id={`teacher-${teacher.teacherId}`}>
            <div className="mb-3">
              <span style={{ fontWeight: "bold" }}>
                {teacher.firstName} {teacher.lastName}
              </span>
              <Badge className="ms-1" bg="danger">
                Загруженность {teacher.workLoad} %
              </Badge>
            </div>
            <CalendarWeek
              backgroundEvents={backgroundEvents}
              events={events}
              onSelectSlot={(slotInfo) => {
                this.handleSelectSlot(teacher, slotInfo);
              }}
              onSelectEvent={(slotInfo) => {
                this.handleSelectEvent(teacher.teacherId, slotInfo);
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
              <Form.Control as="textarea" value={availableSlotsText} style={{ height: "100px" }} placeholder="" onChange={(e) => this.setState({ availableSlotsText: e.target.value })}/>
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
