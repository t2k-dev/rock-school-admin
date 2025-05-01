import React from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { CalendarWeek } from "../common/CalendarWeek";
import { getSlotDescription } from "../common/attendanceHelper";

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
  }

  componentDidUpdate(prevProps) {
    if (this.props.availableTeachers !== prevProps.availableTeachers) {
      this.setState({
        availableTeachers: this.props.availableTeachers,
        availableSlots: [],
        availableSlotsText: "",
      });
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  getAvailableSlotsText() {
    let result = "";
    this.state.availableSlots.forEach((element) => {
      result = `${result}${getSlotDescription(element.teacherFullName, element.start)} \n`;
    });
    this.setState({ availableSlotsText: result });
  }

  handleSelectSlot = (teacher, slotInfo) => {
    const teacherId = teacher.teacherId;

    const updatedTeachers = [...this.state.availableTeachers];
    const teacherIndex = updatedTeachers.findIndex((teacher) => teacher.teacherId === teacherId);

    let slotId = uuidv4();

    if (teacherIndex !== -1) {
      const newAttendance = {
        attendanceId: slotId,
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
    if (!slotInfo.isNew) {
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
        attendancies: [...updatedTeachers[teacherIndex].attendancies.filter((a) => a.attendanceId !== slotInfo.id)],
      };
    }

    this.setState({ availableSlots: updatedSlots, availableTeachers: updatedTeachers });
    this.props.updateAvailableSlots(updatedSlots);
  };

  handleCloseModal = () => {
    this.props.handleClose();
    this.props.updateAvailableSlots(this.state.availableSlots);
  };

  render() {
    const { availableTeachers, availableSlotsText } = this.state;

    let availableTeachersList;
    if (availableTeachers && availableTeachers.length > 0) {
      availableTeachersList = availableTeachers.map((teacher, index) => {

        // Working periods
        let backgroundEvents;
        if (teacher.scheduledWorkingPeriods) {
          backgroundEvents = teacher.scheduledWorkingPeriods.map((period) => ({
            id: period.scheduledWorkingPeriodId,
            start: period.startDate,
            end: period.endDate,
          }));
        } else {
          backgroundEvents = [];
        }

        // Events
        let events;
        if (teacher.attendancies) {
          events = teacher.attendancies.map((attendance) => ({
            id: attendance.attendanceId,
            title: attendance.isNew ? "Окно" : "Занято",
            start: new Date(attendance.startDate),
            end: new Date(attendance.endDate),
            isNew: attendance.isNew,
          }));
        } else {
          events = [];
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
              <Form.Control
                as="textarea"
                value={availableSlotsText}
                style={{ height: "100px" }}
                placeholder=""
                onChange={(e) => this.setState({ availableSlotsText: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Button variant="outline-secondary" type="null" onClick={() => this.getAvailableSlotsText()}>
                Сгенерировать текст
              </Button>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleCloseModal()}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
