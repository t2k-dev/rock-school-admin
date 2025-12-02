import React from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { CalendarWeek } from "../common/CalendarWeek";
import { formatDate, formatTime } from "../common/DateTimeHelper";

import { getRoomName } from "../constants/rooms";

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

  getAvailableSlotsText(availableSlots) {
    let result = "";
    availableSlots.forEach((element) => {
      result = `${result} ${element.description}\n`;
    });
    return result;
  }

  handleCopy = () => {
    // Use the Clipboard API to copy the text
    navigator.clipboard
      .writeText(this.state.availableSlotsText)
      .then(() => this.setState({ copySuccess: "Text copied to clipboard!" })) // Success feedback
      .catch(() => this.setState({ copySuccess: "Failed to copy text." })); // Error feedback
  };

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

    const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(slotInfo.start);

    // Find the matching backgroundEvent based on the slot's start and end times
    const matchingBackgroundEvent = teacher.scheduledWorkingPeriods?.find(
      (backgroundEvent) =>
        new Date(backgroundEvent.startDate).getTime() <= new Date(slotInfo.start).getTime() &&
        new Date(backgroundEvent.endDate).getTime() >= new Date(slotInfo.end).getTime()
    );

    const roomId = matchingBackgroundEvent?.roomId;

    const newSlot = {
      id: slotId,
      teacherId: teacherId,
      teacherFullName: teacher.firstName + " " + teacher.lastName,
      start: slotInfo.start,
      end: slotInfo.end,
      roomId: roomId,
      description: `${teacher.firstName}: ${dayName}, ${formatDate(slotInfo.start)} в ${formatTime(slotInfo.start)} (${getRoomName(roomId)})`,
    };

    const updatedAvailableSlots = [...this.state.availableSlots, newSlot];

    const slotsTxt = this.getAvailableSlotsText(updatedAvailableSlots);

    // Update the state with the modified array
    this.setState({
      availableTeachers: updatedTeachers,
      availableSlots: updatedAvailableSlots,
      availableSlotsText: slotsTxt,
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
    const slotsTxt = this.getAvailableSlotsText(updatedSlots);

    this.setState({ availableSlots: updatedSlots, availableTeachers: updatedTeachers, availableSlotsText: slotsTxt });
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
      let backgroundEvents;
      let events;
      availableTeachersList = availableTeachers.map((teacher, index) => {
        // Working periods
        if (teacher.scheduledWorkingPeriods) {
          backgroundEvents = teacher.scheduledWorkingPeriods.map((period) => ({
            id: period.scheduledWorkingPeriodId,
            start: period.startDate,
            end: period.endDate,
            roomId: period.roomId,
            
          }));
        } else {
          backgroundEvents = [];
        }

        // Events
        if (teacher.attendancies) {
          events = teacher.attendancies.map((attendance) => ({
            id: attendance.attendanceId,
            title: attendance.isNew ? "Окно" : "Занято",
            start: new Date(attendance.startDate),
            end: new Date(attendance.endDate),
            isNew: attendance.isNew,
            roomId: attendance.roomId,
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
        <Modal size="xl" show={this.props.show} onHide={this.props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Доступные преподаватели</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex">
              <div className="flex-grow-1" style={{ height: "640px", overflow: "auto", paddingRight: "15px" }}>
                {availableTeachersList}
              </div>
              <div style={{ width: "330px", paddingLeft: "15px" }}>
                <Form.Group className="mb-3" controlId="availableSlotsText">
                  <Form.Label>Свободные окна</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={availableSlotsText}
                    style={{ height: "300px" }}
                    placeholder=""
                    onChange={(e) => this.setState({ availableSlotsText: e.target.value })}
                  />
                </Form.Group>
                <Form.Group style={{ textAlign: "center" }}>
                  <Button variant="outline-secondary" type="null" onClick={() => this.handleCopy()} disabled={!availableSlotsText.trim()}>
                    Скопироать текст
                  </Button>
                </Form.Group>
              </div>
            </div>
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
