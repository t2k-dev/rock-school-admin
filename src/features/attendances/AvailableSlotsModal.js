import React from "react";
import { v4 as uuidv4 } from "uuid";

import { CalendarWeek } from "../../components/calendar/CalendarWeek";
import { CopyIcon, DoorIcon } from "../../components/icons";
import { formatDate, formatTime } from "../../utils/dateTime";

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
    return availableSlots.map((slot) => slot.description).join("\n");
  }

  getWorkloadBadgeColor = (workload) => {
    if (workload < 50) return "bg-danger";
    if (workload >= 50 && workload < 85) return "bg-warning";
    if (workload >= 85) return "bg-success";
    return "bg-secondary";
  };

  createNewSlot = (room, slotInfo, slotId) => {
    const dayName = new Intl.DateTimeFormat("ru-RU", {
      weekday: "long",
    }).format(slotInfo.start);

    return {
      id: slotId,
      roomId: room.id,
      roomName: room.name,
      start: slotInfo.start,
      end: slotInfo.end,
      description: this.generateSlotDescription(room, dayName, slotInfo),
    };
  };

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
    return rooms.map((room) => {
      if (room.id !== roomId) return room;
      const currentAttendances = room.attendances || [];
      return {
        ...room,
        attendances: [...currentAttendances, newAttendance],
      };
    });
  };

  removeAttendanceFromRoom = (rooms, roomId, attendanceId) => {
    return rooms.map((room) => {
      if (room.id !== roomId) return room;
      return {
        ...room,
        attendances:
          room.attendances?.filter(
            (a) => a.attendanceId !== attendanceId && a.id !== attendanceId,
          ) || [],
      };
    });
  };

  handleError = (message, error) => {
    console.error(message, error);
    this.setState({ error: message });
    if (this.props.onError) this.props.onError(message, error);
  };

  handleCopy = async () => {
    if (!this.state.selectedSlotsText.trim()) return;
    try {
      await navigator.clipboard.writeText(this.state.selectedSlotsText);
      this.setState({ copySuccess: "Скопировано!" });
      setTimeout(() => this.setState({ copySuccess: "" }), 3000);
    } catch (error) {
      this.handleError("Не удалось скопировать", error);
    }
  };

  notifyParent = (slots) => {
    if (this.props.onSlotsChange) {
      this.props.onSlotsChange(slots);
    }
  };

  handleSelectSlot = (room, slotInfo) => {
    const { singleSelection } = this.props;
    if (singleSelection && this.state.availableSlots.length > 0) {
      this.clearAllSlots();
      setTimeout(() => this.addSlot(room, slotInfo), 0);
      return;
    }
    this.addSlot(room, slotInfo);
  };

  handleSelectEvent = (room, slotInfo) => {
    if (!slotInfo.isNew) return;
    const updatedSlots = this.state.availableSlots.filter(
      (s) => s.id !== slotInfo.id,
    );
    const updatedRooms = this.removeAttendanceFromRoom(
      this.state.rooms,
      room.id,
      slotInfo.id,
    );
    const slotsTxt = this.generateSelectedSlotsText(updatedSlots);
    this.setState({
      availableSlots: updatedSlots,
      rooms: updatedRooms,
      selectedSlotsText: slotsTxt,
    });
    this.notifyParent(updatedSlots);
  };

  addSlot = (room, slotInfo) => {
    const slotId = uuidv4();
    const newAttendance = this.createNewAttendance(slotId, slotInfo);
    const updatedRooms = this.updateRoomAttendances(
      this.state.rooms,
      room.id,
      newAttendance,
    );
    const newSlot = this.createNewSlot(room, slotInfo, slotId);
    const updatedAvailableSlots = [...this.state.availableSlots, newSlot];
    const availableSlotsTxt = this.generateSelectedSlotsText(
      updatedAvailableSlots,
    );
    this.setState({
      rooms: updatedRooms,
      availableSlots: updatedAvailableSlots,
      selectedSlotsText: availableSlotsTxt,
      error: null,
    });
    this.notifyParent(updatedAvailableSlots);
  };

  clearAllSlots = () => {
    const updatedRooms = this.state.rooms.map((room) => ({
      ...room,
      attendances: room.attendances?.filter((a) => !a.isNew) || [],
    }));
    this.setState({
      rooms: updatedRooms,
      availableSlots: [],
      selectedSlotsText: "",
      error: null,
    });
    this.notifyParent([]);
  };

  handleCloseModal = () => {
    this.props.onClose();
    if (this.props.onSlotsChange) {
      this.props.onSlotsChange(this.state.availableSlots);
    }
  };

  renderWorkloadBadge = (teacher) => (
    <span
      className={`ml-2 px-2 py-0.5 rounded text-[10px] text-white font-bold ${this.getWorkloadBadgeColor(teacher.workload)}`}
    >
      Загруженность {teacher.workload}%
    </span>
  );

  mapWorkingPeriodsToBackgroundEvents = (scheduledWorkingPeriods) => {
    if (!scheduledWorkingPeriods) return [];
    return scheduledWorkingPeriods.map((period) => ({
      id: period.scheduledWorkingPeriodId,
      start: period.startDate,
      end: period.endDate,
      roomId: period.roomId,
    }));
  };

  mapAttendancesToEvents = (attendances) => {
    if (!attendances) return [];
    return attendances.map((attendance) => ({
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
    if (!rooms || rooms.length === 0) {
      return (
        <div className="text-center p-8 text-text-muted">
          <h5>Нет доступных комнат</h5>
        </div>
      );
    }
    return rooms.map((room) => this.renderRoomCalendar(room));
  };

  renderRoomCalendar = (room) => {
    const attendanceEvents = this.mapAttendancesToEvents(room.attendances);
    return (
      <div className="mb-8 last:mb-0" key={room.id}>
        <div className="flex items-center gap-2 mb-4">
          <DoorIcon color="var(--text-muted)" />
          <span className="font-bold text-lg text-text-main">{room.name}</span>
        </div>
        <div className="bg-inner-bg rounded-xl border border-secondary/10 overflow-hidden">
          <CalendarWeek
            backgroundEvents={[]}
            events={attendanceEvents}
            onSelectSlot={(slotInfo) => this.handleSelectSlot(room, slotInfo)}
            onSelectEvent={(slotInfo) => this.handleSelectEvent(room, slotInfo)}
          />
        </div>
      </div>
    );
  };

  renderSidebar = () => {
    const { selectedSlotsText, copySuccess } = this.state;
    return (
      <div className="w-[330px] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
            Свободные окна
          </span>
          <div className="flex items-center gap-2">
            {copySuccess && (
              <span className="text-[10px] text-success font-medium">
                {copySuccess}
              </span>
            )}
            <button
              onClick={this.handleCopy}
              disabled={!selectedSlotsText.trim()}
              className="p-2 bg-input-bg border border-secondary/20 rounded-lg hover:bg-secondary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <CopyIcon
                size="16px"
                color={
                  selectedSlotsText.trim()
                    ? "var(--text-main)"
                    : "var(--text-muted)"
                }
              />
            </button>
          </div>
        </div>

        <textarea
          value={selectedSlotsText}
          readOnly
          className="flex-grow w-full h-[550px] bg-input-bg border border-secondary/20 rounded-xl p-4 text-sm text-text-main outline-none focus:border-accent transition-all resize-none custom-scrollbar"
          placeholder="Выберите время на календаре..."
        />
      </div>
    );
  };

  render() {
    const { show } = this.props;
    if (!show) return null;

    return (
      <div className="fixed inset-0 z-[1050] flex items-center justify-center outline-none">
        <div
          className="fixed inset-0 bg-main-bg/80 backdrop-blur-sm transition-opacity"
          onClick={this.props.onClose}
        />

        <div className="relative w-full max-w-6xl mx-auto z-[1060] animate-in fade-in zoom-in duration-200">
          <div className="relative flex flex-col w-full bg-card-bg border border-secondary/20 rounded-2xl shadow-2xl outline-none overflow-hidden max-h-[95vh]">
            <div className="flex items-center justify-between p-6 border-b border-secondary/10">
              <h3 className="text-xl font-bold text-text-main">
                Выбор доступных окон
              </h3>
              <button
                onClick={this.props.onClose}
                className="text-text-muted hover:text-text-main text-2xl outline-none"
                style={{ border: "none", background: "none" }}
              >
                ×
              </button>
            </div>

            <div className="p-6 flex gap-6 overflow-hidden">
              <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar h-[640px]">
                {this.renderTeachersList()}
              </div>
              {this.renderSidebar()}
            </div>

            <div className="flex items-center justify-end p-6 border-t border-secondary/10 gap-3">
              <button
                onClick={this.props.onClose}
                className="px-6 py-2 rounded-xl text-text-muted hover:bg-secondary/10 transition-colors font-medium"
                style={{ border: "none", background: "none" }}
              >
                Отмена
              </button>
              <button
                onClick={this.handleCloseModal}
                className="px-8 py-2 bg-accent hover:bg-accent/80 text-white rounded-xl transition-all font-bold shadow-lg shadow-accent/20 active:scale-95"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
