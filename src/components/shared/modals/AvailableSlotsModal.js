import React from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { formatDate, formatTime } from "../../../utils/dateTime";
import { CalendarWeek } from "../calendar/CalendarWeek";
import { CopyIcon } from "../icons/CopyIcon";
import { DoorIcon } from "../icons/DoorIcon";

export class AvailableSlotsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
      rooms: [],
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

    if (prevProps.rooms !== this.props.rooms) {
      this.resetState();
    }

    if (prevProps.teachers !== this.props.teachers) {
      this.resetState();
    }
  }

  // Lifecycle and State Management
  resetState = () => {
    const initialSlots = this.props.initialSlots || [];
    this.setState({
      teachers: this.props.teachers || [],
      rooms: this.props.rooms || [],
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

  createNewSlot = (room, slotInfo, slotId) => {
    const dayName = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(slotInfo.start);

    return {
      id: slotId,
      roomId: room.id,
      roomName: room.name,
      start: slotInfo.start,
      end: slotInfo.end,
      description: this.generateSlotDescription(room, dayName, slotInfo),
    };
  }

  generateSlotDescription = (room, dayName, slotInfo) => {
    const timeString = `${formatDate(slotInfo.start)} в ${formatTime(slotInfo.start)}`;
    return `${room.name}: ${dayName}, ${timeString}`;
  };
  
  createNewAttendance = (slotId, slotInfo) => ({
    attendanceId: slotId,
    id: slotId,
    title: "Окно",
    startDate: slotInfo.start,
    endDate: slotInfo.end,
    start: slotInfo.start,
    end: slotInfo.end,
    isNew: true,
  });

  updateRoomAttendances = (rooms, roomId, newAttendance) => {
    return rooms.map(room => {
      if (room.id !== roomId) return room;

      const currentAttendances = room.attendances || [];
      return {
        ...room,
        attendances: [...currentAttendances, newAttendance],
      };
    });
  };

  removeAttendanceFromRoom = (rooms, roomId, attendanceId) => {
    return rooms.map(room => {
      if (room.id !== roomId) return room;

      return {
        ...room,
        attendances: room.attendances?.filter(a => a.attendanceId !== attendanceId && a.id !== attendanceId) || [],
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
  };

  handleSelectSlot = (room, slotInfo) => {
    const { singleSelection } = this.props;

    if (singleSelection && this.state.availableSlots.length > 0) {
      this.clearAllSlots();
      // Wait for state to update before adding new slot
      setTimeout(() => {
        this.addSlot(room, slotInfo);
      }, 0);
      return;
    }

    this.addSlot(room, slotInfo);
  };

  handleSelectEvent = (room, slotInfo) => {
    if (!slotInfo.isNew) return;

    // Update available slots
    const updatedSlots = this.state.availableSlots.filter((s) => s.id !== slotInfo.id);

    // Update room attendances
    const updatedRooms = this.removeAttendanceFromRoom(
      this.state.rooms,
      room.id,
      slotInfo.id
    );

    const slotsTxt = this.generateSelectedSlotsText(updatedSlots);

    this.setState({ 
      availableSlots: updatedSlots, 
      rooms: updatedRooms, 
      selectedSlotsText: slotsTxt 
    });
    
    this.notifyParent(updatedSlots);
  };

  addSlot = (room, slotInfo) => {
    const slotId = uuidv4();

    // Add new attendance to room
    const newAttendance = this.createNewAttendance(slotId, slotInfo);
    const updatedRooms = this.updateRoomAttendances(
      this.state.rooms,
      room.id,
      newAttendance
    );

    // Add the selected slot to the availableSlots array
    const newSlot = this.createNewSlot(room, slotInfo, slotId);
    const updatedAvailableSlots = [...this.state.availableSlots, newSlot];
    const availableSlotsTxt = this.generateSelectedSlotsText(updatedAvailableSlots);

    // Update the state with the modified arrays
    this.setState({
      rooms: updatedRooms,
      availableSlots: updatedAvailableSlots,
      selectedSlotsText: availableSlotsTxt,
      error: null, // Clear any previous errors
    });

    // Notify parent components
    // Notify parent components
    this.notifyParent(updatedAvailableSlots);
  };

  clearAllSlots = () => {
    // Remove all new attendances from rooms
    const updatedRooms = this.state.rooms.map(room => ({
      ...room,
      attendances: room.attendances?.filter(a => !a.isNew) || [],
    }));

    this.setState({
      rooms: updatedRooms,
      availableSlots: [],
      selectedSlotsText: "",
      error: null,
    });

    // Notify parent components
    this.notifyParent([]);
  };

  handleCloseModal = () => {
    this.props.onClose();
    if (this.props.onSlotsChange) {
      this.props.onSlotsChange(this.state.availableSlots);
    }
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
    const attendanceEvents = this.mapAttendancesToEvents(teacher.attendances);
    const busySlotEvents = this.mapBusySlotsToEvents(this.state.busySlots);
    
    // Combine all events
    const events = [...attendanceEvents, ...busySlotEvents];

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
      id: attendance.attendanceId || attendance.id,
      title: attendance.isNew ? "Окно" : "Занято",
      start: new Date(attendance.startDate || attendance.start),
      end: new Date(attendance.endDate || attendance.end),
      isNew: attendance.isNew || false,
      roomId: attendance.roomId,
    }));
  };

  renderTeachersList = () => {
    const { rooms } = this.state;

    // If no rooms found, show empty state
    if (!rooms || rooms.length === 0) {
      return (
        <div className="text-center p-4">
          <h5>Нет доступных комнат</h5>
        </div>
      );
    }

    // Render a calendar for each room
    return rooms.map(room => this.renderRoomCalendar(room));
  };

  renderRoomCalendar = (room) => {
    // Map room attendances to events for this specific room
    const attendanceEvents = this.mapAttendancesToEvents(room.attendances);
    
    return (
      <div className="mb-4" key={room.id}>
        <div className="mb-3">
          <span style={{ fontWeight: "bold" }}>
            <DoorIcon/> {room.name}
          </span>
        </div>
        <CalendarWeek
          backgroundEvents={[]} // No background events needed for room rental
          events={attendanceEvents}
          onSelectSlot={(slotInfo) => this.handleSelectSlot(room, slotInfo)}
          onSelectEvent={(slotInfo) => this.handleSelectEvent(room, slotInfo)}
        />
      </div>
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
        aria-labelledby="available-slots-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="available-slots-modal-title">
            Выбор доступных окон
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="d-flex" role="main">
            <div 
              className="flex-grow-1" 
              style={{ height: "640px", overflow: "auto", paddingRight: "15px" }}
              role="region"
              aria-label="Список комнат"
            >
              {this.renderTeachersList()}
            </div>
            {this.renderSidebar()}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal}>
            Продолжить
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
