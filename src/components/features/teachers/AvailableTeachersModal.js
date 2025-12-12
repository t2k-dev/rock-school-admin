import React from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { formatDate, formatTime } from "../../../utils/dateTime";
import { CalendarWeek } from "../../shared/calendar/CalendarWeek";


export class AvailableTeachersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
      availableSlots: [],
      availableSlotsText: "",
      copySuccess: "",
      isLoading: false,
      error: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show && this.props.show) {
      this.resetState();
    }

    if (prevProps.availableTeachers !== this.props.availableTeachers) {
      this.resetState();
    }
  }

    // Lifecycle and State Management
  resetState = () => {
    const initialSlots = this.props.initialSlots || [];
    this.setState({
      teachers: this.props.availableTeachers || [],
      availableSlots: initialSlots,
      availableSlotsText: this.generateAvailableSlotsText(initialSlots),
      copySuccess: "",
    });
  };

  generateAvailableSlotsText(availableSlots) {
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
      teacherFullName: `${teacher.firstName} ${teacher.lastName}`,
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

  handleError = (message, error) => {
    console.error(message, error);
    this.setState({ error: message });
    this.props.onError(message, error);
  };

  handleCopy = async () => {
    if (!this.state.availableSlotsText.trim()) return;

    try {
      await navigator.clipboard.writeText(this.state.availableSlotsText);
      this.setState({ copySuccess: "Текст скопирован в буфер обмена!" });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.setState({ copySuccess: "" });
      }, 3000);
    } catch (error) {
      this.handleError("Не удалось скопировать текст", error);
    }
  };

  handleSelectSlot = (teacher, slotInfo) => {
    const teacherId = teacher.teacherId;

    const updatedTeachers = [...this.state.teachers];
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

    const availableSlotsTxt = this.generateAvailableSlotsText(updatedAvailableSlots);

    // Update the state with the modified array
    this.setState({
      teachers: updatedTeachers,
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
    const updatedTeachers = [...this.state.teachers];
    const teacherIndex = updatedTeachers.findIndex((teacher) => teacher.teacherId === teacherId);

    if (teacherIndex !== -1) {
      updatedTeachers[teacherIndex] = {
        ...updatedTeachers[teacherIndex],
        attendances: [...updatedTeachers[teacherIndex].attendances.filter((a) => a.attendanceId !== slotInfo.id)],
      };
    }
    const slotsTxt = this.getAvailableSlotsText(updatedSlots);

    this.setState({ availableSlots: updatedSlots, teachers: updatedTeachers, availableSlotsText: slotsTxt });
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
    const { teachers } = this.state;

    if (!teachers || teachers.length === 0) {
      return (
        <div className="text-center p-4">
          <h5>Нет доступных преподавателей</h5>
        </div>
      );
    }

    return teachers.map((teacher, index) => 
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
