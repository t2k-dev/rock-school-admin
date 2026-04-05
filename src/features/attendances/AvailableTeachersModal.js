import React from "react";
import { v4 as uuidv4 } from "uuid";

import { CalendarWeek } from "../../components/calendar/CalendarWeek";
import { CopyIcon } from "../../components/icons";
import { Button, CloseButton, ToneBadge } from "../../components/ui";
import { formatDate, formatTime } from "../../utils/dateTime";

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

  componentDidMount() {
    this.syncBodyScrollLock(this.props.show);
    document.addEventListener("keydown", this.handleDocumentKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.syncBodyScrollLock(this.props.show);
    }

    if (prevProps.show !== this.props.show && this.props.show) {
      this.resetState();
    }

    if (prevProps.teachers !== this.props.teachers) {
      this.resetState();
    }
  }

  componentWillUnmount() {
    this.syncBodyScrollLock(false);
    document.removeEventListener("keydown", this.handleDocumentKeyDown);
  }

  handleDocumentKeyDown = (event) => {
    if (event.key === "Escape" && this.props.show) {
      this.handleCloseModal();
    }
  };

  syncBodyScrollLock = (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  // Lifecycle and State Management
  resetState = () => {
    const initialSlots = this.props.initialSlots || [];
    this.setState({
      teachers: this.props.teachers || [],
      availableSlots: initialSlots,
      selectedSlotsText: this.generateSelectedSlotsText(initialSlots),
      copySuccess: "",
    });
  };

  generateSelectedSlotsText(availableSlots) {
    return availableSlots.map((slot) => slot.description).join("\n");
  }

  getWorkloadBadgeColor = (workload) => {
    if (workload < 50) return "danger";
    if (workload >= 50 && workload < 65) return "warning";
    if (workload >= 65 && workload < 85) return "warning";
    if (workload >= 85) return "success";

    return "secondary";
  };

  createNewSlot = (teacher, slotInfo, slotId) => {
    const dayName = new Intl.DateTimeFormat("ru-RU", {
      weekday: "long",
    }).format(slotInfo.start);

    // Find the matching backgroundEvent based on the slot's start and end times
    const matchingBackgroundEvent = teacher.scheduledWorkingPeriods?.find(
      (backgroundEvent) =>
        new Date(backgroundEvent.startDate).getTime() <=
          new Date(slotInfo.start).getTime() &&
        new Date(backgroundEvent.endDate).getTime() >=
          new Date(slotInfo.end).getTime(),
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
  };

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
    return teachers.map((teacher) => {
      if (teacher.teacherId !== teacherId) return teacher;

      const currentAttendances = teacher.attendances || [];
      return {
        ...teacher,
        attendances: [...currentAttendances, newAttendance],
      };
    });
  };

  removeAttendanceFromTeacher = (teachers, teacherId, attendanceId) => {
    return teachers.map((teacher) => {
      if (teacher.teacherId !== teacherId) return teacher;

      return {
        ...teacher,
        attendances:
          teacher.attendances?.filter((a) => a.attendanceId !== attendanceId) ||
          [],
      };
    });
  };

  // Event Handlers

  handleError = (message, error) => {
    console.error(message, error);
    this.setState({ error: message });
    this.props.onError?.(message, error);
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
      newAttendance,
    );

    // Add the selected slot to the availableSlots array
    const newSlot = this.createNewSlot(teacher, slotInfo, slotId);
    const updatedAvailableSlots = [...this.state.availableSlots, newSlot];
    const availableSlotsTxt = this.generateSelectedSlotsText(
      updatedAvailableSlots,
    );

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
    const updatedTeachers = this.state.teachers.map((teacher) => ({
      ...teacher,
      attendances: teacher.attendances?.filter((a) => !a.isNew) || [],
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
    const updatedSlots = this.state.availableSlots.filter(
      (s) => s.id !== slotInfo.id,
    );

    // update teacher events
    const updatedTeachers = this.removeAttendanceFromTeacher(
      this.state.teachers,
      teacherId,
      slotInfo.id,
    );

    const slotsTxt = this.generateSelectedSlotsText(updatedSlots);

    this.setState({
      availableSlots: updatedSlots,
      teachers: updatedTeachers,
      selectedSlotsText: slotsTxt,
    });
    this.props.onSlotsChange(updatedSlots);
  };

  handleCloseModal = () => {
    this.props.onClose();
    this.notifyParent(this.state.availableSlots);
  };

  // Render Methods
  renderWorkloadBadge = (teacher) => {
    const toneByWorkload = {
      danger: "danger",
      warning: "warning",
      success: "success",
      secondary: "secondary",
    };

    return (
      <ToneBadge
        label={`Загруженность ${teacher.workload}%`}
        tone={toneByWorkload[this.getWorkloadBadgeColor(teacher.workload)]}
        className="text-[11px]"
      />
    );
  };

  renderTeacher = (teacher, index) => {
    const backgroundEvents = this.mapWorkingPeriodsToBackgroundEvents(
      teacher.scheduledWorkingPeriods,
    );
    const events = this.mapAttendancesToEvents(teacher.attendances);

    return (
      <div
        className="mb-5 rounded-[24px] border border-white/10 bg-main-bg/35 p-4 sm:p-5"
        key={teacher.teacherId}
        id={`teacher-${teacher.teacherId}`}
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-[17px] font-semibold text-text-main">
            {teacher.firstName} {teacher.lastName}
          </span>
          {typeof teacher.workload === "number" &&
            this.renderWorkloadBadge(teacher)}
        </div>
        <div className="overflow-hidden rounded-[18px] bg-card-bg/80 p-2">
          <CalendarWeek
            backgroundEvents={backgroundEvents}
            events={events}
            onSelectSlot={(slotInfo) => this.handleSelectSlot(teacher, slotInfo)}
            onSelectEvent={(slotInfo) =>
              this.handleSelectEvent(teacher.teacherId, slotInfo)
            }
            step={this.props.step}
            slotDuration={this.props.slotDuration}
          />
        </div>
      </div>
    );
  };

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
        <div className="flex min-h-[240px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-main-bg/25 px-6 text-center text-[15px] text-text-muted">
          Нет доступных преподавателей
        </div>
      );
    }

    return teachers.map((teacher, index) => this.renderTeacher(teacher, index));
  };

  renderSidebar = () => {
    const { selectedSlotsText, copySuccess, availableSlots, error } = this.state;

    return (
      <aside className="w-full bg-main-bg/35 p-5 pt-0 xl:w-[340px] xl:self-start">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="mt-1 text-[18px] font-semibold text-text-main">
              Выбранные окна
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={this.handleCopy}
            disabled={!selectedSlotsText.trim()}
            id="copy-help-text"
            aria-describedby="copy-button-help"
            className="min-w-0 px-3"
          >
            <CopyIcon size="15px" />
          </Button>
        </div>

        <label className="flex flex-col gap-3">
          <textarea
            value={selectedSlotsText}
            aria-describedby="copy-help-text"
            readOnly
            rows={14}
            className="min-h-[320px] w-full rounded-[16px] border border-white/10 bg-input-bg px-4 py-3 text-[14px] text-text-main outline-none"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-text-muted">
          {copySuccess && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              {copySuccess}
            </span>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-[16px] border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-danger">
            {error}
          </div>
        )}
      </aside>
    );
  };

  render() {
    const { show } = this.props;

    if (!show) return null;

    return (
      <div
        className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="available-teachers-modal-title"
      >
        <div className="relative flex max-h-[calc(100vh-3rem)] w-full max-w-[1440px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-card-bg shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
            
              <h2 id="available-teachers-modal-title" className="mt-2 text-[24px] font-semibold text-text-main">
                Доступные преподаватели
              </h2>
            <CloseButton onClick={this.handleCloseModal} />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">

            <div className="flex flex-col gap-6 xl:flex-row" role="main">
              <div
                className="min-h-[320px] flex-1 overflow-y-auto pr-0 xl:max-h-[640px] xl:pr-2"
                role="region"
                aria-label="Список преподавателей"
              >
                {this.renderTeachersList()}
              </div>
              {this.renderSidebar()}
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 px-6 py-5 sm:px-8">
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Закрыть
            </Button>
            <Button onClick={this.handleCloseModal}>
              Продолжить
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
