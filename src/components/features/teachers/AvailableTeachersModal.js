import React from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { formatDate, formatTime } from "../../../utils/dateTime";
import { CalendarWeek } from "../../shared/calendar/CalendarWeek";
import { CopyIcon } from "../../shared/icons/CopyIcon";


export class AvailableTeachersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
      availableSlots: [],
      selectedSlotsText: "",
      singleSelection: false,
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
      selectedSlotsText: this.generateSelectedSlotsText(initialSlots),
      copySuccess: "",
    });
  };

  generateSelectedSlotsText(availableSlots) {
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
      description: this.generateSlotDescription(teacher, dayName, slotInfo),
    };
  }

  generateSlotDescription = (teacher, dayName, slotInfo) => {
    const timeString = `${formatDate(slotInfo.start)} в ${formatTime(slotInfo.start)}`;
    return `${teacher.firstName}: ${dayName}, ${timeString}`;
  };
  
  createNewAttendance = (slotId, slotInfo) => ({
    attendanceId: slotId,
    title: "Окно",
    startDate: slotInfo.start,
    endDate: slotInfo.end,
    isNew: true,
  });

  updateTeacherAttendances = (teachers, teacherId, newAttendance) => {
    return teachers.map(teacher => {
      if (teacher.teacherId !== teacherId) return teacher;

      const currentAttendances = teacher.attendances || [];
      return {
        ...teacher,
        attendances: [...currentAttendances, newAttendance],
      };
    });
  };

  removeAttendanceFromTeacher = (teachers, teacherId, attendanceId) => {
    return teachers.map(teacher => {
      if (teacher.teacherId !== teacherId) return teacher;

      return {
        ...teacher,
        attendances: teacher.attendances?.filter(a => a.attendanceId !== attendanceId) || [],
      };
    });
  };

  // Event Handlers

  handleError = (message, error) => {
    console.error(message, error);
    this.setState({ error: message });
    this.props.onError(message, error);
  };

  handleCopy = async () => {
    if (!this.state.selectedSlotsText.trim()) return;

    try {
      await navigator.clipboard.writeText(this.state.selectedSlotsText);
      this.setState({ copySuccess: "Текст скопирован в буфер обмена!" });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.setState({ copySuccess: "" });
      }, 3000);
    } catch (error) {
      this.handleError("Не удалось скопировать текст", error);
    }
  };

  notifyParent = (slots) => {
    // New prop pattern
    if (this.props.onSlotsChange) {
      this.props.onSlotsChange(slots);
    }
    
    // Legacy prop pattern (for backward compatibility)
    if (this.props.updateAvailableSlots) {
      this.props.updateAvailableSlots(slots);
    }
  };

  handleSelectSlot = (teacher, slotInfo) => {
    const { singleSelection } = this.props;

    if (singleSelection && this.state.availableSlots.length > 0) {
      this.clearAllSlots();
      // Wait for state to update before adding new slot
      setTimeout(() => {
        this.addSlot(teacher, slotInfo);
      }, 0);
      return;
    }

    this.addSlot(teacher, slotInfo);
  };

  addSlot = (teacher, slotInfo) => {
    const slotId = uuidv4();

    // Add new attendance
    const newAttendance = this.createNewAttendance(slotId, slotInfo);
    const updatedTeachers = this.updateTeacherAttendances(
      this.state.teachers,
      teacher.teacherId,
      newAttendance
    );

    // Add the selected slot to the availableSlots array
    const newSlot = this.createNewSlot(teacher, slotInfo, slotId);
    const updatedAvailableSlots = [...this.state.availableSlots, newSlot];
    const availableSlotsTxt = this.generateSelectedSlotsText(updatedAvailableSlots);

    // Update the state with the modified array
    this.setState({
      teachers: updatedTeachers,
      availableSlots: updatedAvailableSlots,
      selectedSlotsText: availableSlotsTxt,
      error: null, // Clear any previous errors
    });

    // Notify parent components
    this.notifyParent(updatedAvailableSlots);
  };

  clearAllSlots = () => {
    // Remove all new attendances from teachers
    const updatedTeachers = this.state.teachers.map(teacher => ({
      ...teacher,
      attendances: teacher.attendances?.filter(a => !a.isNew) || [],
    }));

    this.setState({
      teachers: updatedTeachers,
      availableSlots: [],
      selectedSlotsText: "",
      error: null,
    });

    // Notify parent components
    this.notifyParent([]);
  };

  handleSelectEvent = (teacherId, slotInfo) => {
    if (!slotInfo.isNew) return;

    // update available slots
    const updatedSlots = this.state.availableSlots.filter((s) => s.id !== slotInfo.id);

    // update teacher events
    const updatedTeachers = this.removeAttendanceFromTeacher(
      this.state.teachers,
      teacherId,
      slotInfo.id
    );

    const slotsTxt = this.generateSelectedSlotsText(updatedSlots);

    this.setState({ availableSlots: updatedSlots, teachers: updatedTeachers, selectedSlotsText: slotsTxt });
    this.props.onSlotsChange(updatedSlots);
  };

  handleCloseModal = () => {
    this.props.onClose();
    this.props.onSlotsChange(this.state.availableSlots);
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
    const { selectedSlotsText, copySuccess } = this.state;

    return (
      <div style={{ width: "330px", paddingLeft: "15px" }}>
        <Form.Group className="mb-3" controlId="selectedSlotsText">
          <div className="d-flex mb-1">
            <span className="flex-grow-1">Свободные окна</span>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={this.handleCopy}
                disabled={!selectedSlotsText.trim()}
                id="copy-help-text"
                aria-describedby="copy-button-help"
              >
              <CopyIcon size="15px" style={{ cursor: "pointer" }} onClick={this.handleCopy}></CopyIcon>
            </Button>
          </div>

          <Form.Control
            as="textarea"
            value={selectedSlotsText}
            style={{ height: "300px" }}
            aria-describedby="copy-help-text"
            readOnly
          />
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
        onHide={this.props.onClose}
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
