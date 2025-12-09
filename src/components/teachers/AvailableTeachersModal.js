import React from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { CalendarWeek } from "../common/CalendarWeek";
import { formatDate, formatTime } from "../common/DateTimeHelper";


export class AvailableTeachersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      availableTeachers: [],
      availableSlots: [],
      availableSlotsText: "",
      copySuccess: "",
      isLoading: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.availableTeachers !== prevProps.availableTeachers) {
      this.resetModalState();
    }
  }

    // Lifecycle and State Management
  resetModalState = () => {
    this.setState({
      availableTeachers: this.props.availableTeachers || [],
      availableSlots: [],
      availableSlotsText: "",
      copySuccess: "",
    });
  };

  getAvailableSlotsText(availableSlots) {
    return availableSlots
          .map(slot => slot.description)
          .join('\n');
  }

  getWorkloadBadgeColor = (workload) => {
    if (workload < 50) return "danger";
    if (workload >= 50 && workload < 65) return "warning";
    if (workload >= 65 && workload < 85) return "warning";
    if (workload >= 85) return "success";

    return "secondary";
  };

  createNewSlot = (teacher, slotInfo, slotId) =>{
      const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(slotInfo.start);

    // Find the matching backgroundEvent based on the slot's start and end times
    const matchingBackgroundEvent = teacher.scheduledWorkingPeriods?.find(
      (backgroundEvent) =>
        new Date(backgroundEvent.startDate).getTime() <= new Date(slotInfo.start).getTime() &&
        new Date(backgroundEvent.endDate).getTime() >= new Date(slotInfo.end).getTime()
    );

    const roomId = matchingBackgroundEvent?.roomId;

    return {
      id: slotId,
      teacherId: teacher.teacherId,
      teacherFullName: teacher.firstName + " " + teacher.lastName,
      start: slotInfo.start,
      end: slotInfo.end,
      roomId: roomId,
      description: this.createSlotDescription(teacher, dayName, slotInfo),
    };
  }

  createSlotDescription = (teacher, dayName, slotInfo) => {
    const timeString = `${formatDate(slotInfo.start)} в ${formatTime(slotInfo.start)}`;
    return `${teacher.firstName}: ${dayName}, ${timeString}`;
  };
  
  // Event Handlers
  
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

    // Add new attendance
    if (teacherIndex !== -1) {
      const newAttendance = {
        attendanceId: slotId,
        title: "Окно",
        startDate: slotInfo.start,
        endDate: slotInfo.end,
        isNew: true,
      };

      const currentAttendances = updatedTeachers[teacherIndex].attendances ?? [];
      // Update the teacher's events array
      updatedTeachers[teacherIndex] = {
        ...updatedTeachers[teacherIndex],
        attendances: [...currentAttendances, newAttendance],
      };
    }

    // Add the selected slot to the availableSlots array
    const newSlot = this.createNewSlot(teacher, slotInfo, slotId);
    const updatedAvailableSlots = [...this.state.availableSlots, newSlot];

    const availableSlotsTxt = this.getAvailableSlotsText(updatedAvailableSlots);

    // Update the state with the modified array
    this.setState({
      availableTeachers: updatedTeachers,
      availableSlots: updatedAvailableSlots,
      availableSlotsText: availableSlotsTxt,
    });

    this.props.updateAvailableSlots(updatedAvailableSlots);
  };

  handleSelectEvent = (teacherId, slotInfo) => {
    if (!slotInfo.isNew) return;

    // update available slots
    const updatedSlots = this.state.availableSlots.filter((s) => s.id !== slotInfo.id);

    // update teacher events
    const updatedTeachers = [...this.state.availableTeachers];
    const teacherIndex = updatedTeachers.findIndex((teacher) => teacher.teacherId === teacherId);

    if (teacherIndex !== -1) {
      updatedTeachers[teacherIndex] = {
        ...updatedTeachers[teacherIndex],
        attendances: [...updatedTeachers[teacherIndex].attendances.filter((a) => a.attendanceId !== slotInfo.id)],
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

  // Render Methods
  renderWorkloadBadge = (teacher) => (
    <Badge 
      className="ms-1" 
      bg={this.getWorkloadBadgeColor(teacher.workload)}
      aria-label={`Загруженность ${teacher.workload}%`}
    >
      Загруженность {teacher.workload}%
    </Badge>
  );

  renderTeacher = (teacher, index) => {
    const backgroundEvents = this.mapWorkingPeriodsToBackgroundEvents(teacher.scheduledWorkingPeriods);
    const events = this.mapAttendancesToEvents(teacher.attendances);

    return (
      <div className="mb-4" key={teacher.teacherId} id={`teacher-${teacher.teacherId}`}>
        <div className="mb-3">
          <span style={{ fontWeight: "bold" }}>
            {teacher.firstName} {teacher.lastName}
          </span>
          {typeof teacher.workload === 'number' && this.renderWorkloadBadge(teacher)}
        </div>
        <CalendarWeek
          backgroundEvents={backgroundEvents}
          events={events}
          onSelectSlot={(slotInfo) => this.handleSelectSlot(teacher, slotInfo)}
          onSelectEvent={(slotInfo) => this.handleSelectEvent(teacher.teacherId, slotInfo)}
        />
      </div>
    );
  };

  mapWorkingPeriodsToBackgroundEvents = (scheduledWorkingPeriods) => {
    if (!scheduledWorkingPeriods) return [];
    
    return scheduledWorkingPeriods.map(period => ({
      id: period.scheduledWorkingPeriodId,
      start: period.startDate,
      end: period.endDate,
      roomId: period.roomId,
    }));
  };

  mapAttendancesToEvents = (attendances) => {
    if (!attendances) return [];
    
    return attendances.map(attendance => ({
      id: attendance.attendanceId,
      title: attendance.isNew ? "Окно" : "Занято",
      start: new Date(attendance.startDate),
      end: new Date(attendance.endDate),
      isNew: attendance.isNew,
      roomId: attendance.roomId,
    }));
  };

  renderTeachersList = () => {
    const { availableTeachers } = this.state;

    if (!availableTeachers || availableTeachers.length === 0) {
      return (
        <div className="text-center p-4">
          <h5>Нет доступных преподавателей</h5>
        </div>
      );
    }

    return availableTeachers.map((teacher, index) => 
      this.renderTeacher(teacher, index)
    );
  };

  renderSidebar = () => {
    const { availableSlotsText, copySuccess } = this.state;

    return (
      <div style={{ width: "330px", paddingLeft: "15px" }}>
        <Form.Group className="mb-3" controlId="availableSlotsText">
          <Form.Label>Свободные окна</Form.Label>
          <Form.Control
            as="textarea"
            value={availableSlotsText}
            style={{ height: "300px" }}
            placeholder="Выберите свободные окна для отображения здесь"
            onChange={this.handleTextareaChange}
            aria-describedby="copy-help-text"
          />
        </Form.Group>

        {/*copySuccess && (
          <Alert 
            variant={copySuccess.includes("скопирован") ? "success" : "danger"}
            className="mb-3"
            role="status"
            aria-live="polite"
          >
            {copySuccess}
          </Alert>
        )*/}

        <Form.Group style={{ textAlign: "center" }}>
          <Button
            variant="outline-secondary"
            onClick={this.handleCopy}
            disabled={!availableSlotsText.trim()}
            id="copy-help-text"
            aria-describedby="copy-button-help"
          >
            Скопировать текст
          </Button>
          <Form.Text id="copy-button-help" className="d-block mt-2 text-muted">
            Скопирует текст в буфер обмена
          </Form.Text>
        </Form.Group>
      </div>
    );
  };

  render() {
        const { show } = this.props;

    if (!show) return null;

    return (
      <Modal 
        size="xl" 
        show={show} 
        onHide={this.props.handleClose}
        aria-labelledby="available-teachers-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="available-teachers-modal-title">
            Доступные преподаватели
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex" role="main">
            <div 
              className="flex-grow-1" 
              style={{ height: "640px", overflow: "auto", paddingRight: "15px" }}
              role="region"
              aria-label="Список преподавателей"
            >
              {this.renderTeachersList()}
            </div>
            {this.renderSidebar()}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
