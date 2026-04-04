import React from "react";
import { v4 as uuidv4 } from "uuid";

import { CalendarWeek } from "../../components/calendar/CalendarWeek";
import { CopyIcon } from "../../components/icons";
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

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show && this.props.show) {
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
      availableSlots: initialSlots,
      selectedSlotsText: this.generateSelectedSlotsText(initialSlots),
      copySuccess: "",
    });
  };

  generateSelectedSlotsText(availableSlots) {
    return availableSlots.map((slot) => slot.description).join("\n");
  }

  getWorkloadBadgeStyles = (workload) => {
    if (workload < 50) return "bg-danger text-white";
    if (workload >= 50 && workload < 85) return "bg-warning text-main-bg";
    if (workload >= 85) return "bg-success text-white";
    return "bg-secondary text-white";
  };

  createNewSlot = (teacher, slotInfo, slotId) => {
    const dayName = new Intl.DateTimeFormat("ru-RU", {
      weekday: "long",
    }).format(slotInfo.start);
    const matchingBackgroundEvent = teacher.scheduledWorkingPeriods?.find(
      (bg) =>
        new Date(bg.startDate).getTime() <=
          new Date(slotInfo.start).getTime() &&
        new Date(bg.endDate).getTime() >= new Date(slotInfo.end).getTime(),
    );

    return {
      id: slotId,
      teacherId: teacher.teacherId,
      teacherFullName: `${teacher.firstName} ${teacher.lastName}`,
      start: slotInfo.start,
      end: slotInfo.end,
      roomId: matchingBackgroundEvent?.roomId,
      description: this.generateSlotDescription(teacher, dayName, slotInfo),
    };
  };

  generateSlotDescription = (teacher, dayName, slotInfo) => {
    const timeString = `${formatDate(slotInfo.start)} в ${formatTime(slotInfo.start)}`;
    return `${teacher.firstName}: ${dayName}, ${timeString}`;
  };

  handleCopy = async () => {
    if (!this.state.selectedSlotsText.trim()) return;
    try {
      await navigator.clipboard.writeText(this.state.selectedSlotsText);
      this.setState({ copySuccess: "Скопировано!" });
      setTimeout(() => this.setState({ copySuccess: "" }), 3000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  handleSelectSlot = (teacher, slotInfo) => {
    const { singleSelection } = this.props;
    if (singleSelection && this.state.availableSlots.length > 0) {
      this.clearAllSlots();
      setTimeout(() => this.addSlot(teacher, slotInfo), 0);
      return;
    }
    this.addSlot(teacher, slotInfo);
  };

  addSlot = (teacher, slotInfo) => {
    const slotId = uuidv4();
    const newAttendance = {
      attendanceId: slotId,
      title: "Окно",
      startDate: slotInfo.start,
      endDate: slotInfo.end,
      isNew: true,
    };

    const updatedTeachers = this.state.teachers.map((t) =>
      t.teacherId === teacher.teacherId
        ? { ...t, attendances: [...(t.attendances || []), newAttendance] }
        : t,
    );

    const newSlot = this.createNewSlot(teacher, slotInfo, slotId);
    const updatedAvailableSlots = [...this.state.availableSlots, newSlot];

    this.setState({
      teachers: updatedTeachers,
      availableSlots: updatedAvailableSlots,
      selectedSlotsText: this.generateSelectedSlotsText(updatedAvailableSlots),
    });
    this.props.onSlotsChange(updatedAvailableSlots);
  };

  handleSelectEvent = (teacherId, slotInfo) => {
    if (!slotInfo.isNew) return;
    const updatedSlots = this.state.availableSlots.filter(
      (s) => s.id !== slotInfo.id,
    );
    const updatedTeachers = this.state.teachers.map((t) =>
      t.teacherId === teacherId
        ? {
            ...t,
            attendances: t.attendances?.filter(
              (a) => a.attendanceId !== slotInfo.id,
            ),
          }
        : t,
    );

    this.setState({
      availableSlots: updatedSlots,
      teachers: updatedTeachers,
      selectedSlotsText: this.generateSelectedSlotsText(updatedSlots),
    });
    this.props.onSlotsChange(updatedSlots);
  };

  render() {
    const { show, onClose, step, slotDuration } = this.props;
    const { teachers, selectedSlotsText, copySuccess } = this.state;

    if (!show) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-main-bg/60 backdrop-blur-sm">
        <div className="bg-card-bg w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[24px] border border-white/10 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-text-main">
              Доступные преподаватели
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-text-muted hover:text-text-main"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden p-6 gap-6">
            <div className="flex-grow overflow-y-auto pr-2 space-y-8 scrollbar-thin scrollbar-thumb-white/10">
              {teachers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                  <p>Нет доступных преподавателей</p>
                </div>
              ) : (
                teachers.map((teacher) => (
                  <div
                    key={teacher.teacherId}
                    className="bg-inner-bg/50 p-4 rounded-2xl border border-white/5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-lg font-bold text-text-main">
                        {teacher.firstName} {teacher.lastName}
                      </span>
                      {typeof teacher.workload === "number" && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[12px] font-medium ${this.getWorkloadBadgeStyles(teacher.workload)}`}
                        >
                          Загруженность {teacher.workload}%
                        </span>
                      )}
                    </div>
                    <CalendarWeek
                      backgroundEvents={
                        teacher.scheduledWorkingPeriods?.map((p) => ({
                          id: p.scheduledWorkingPeriodId,
                          start: p.startDate,
                          end: p.endDate,
                          roomId: p.roomId,
                        })) || []
                      }
                      events={
                        teacher.attendances?.map((a) => ({
                          id: a.attendanceId,
                          title: a.isNew ? "Окно" : "Занято",
                          start: new Date(a.startDate),
                          end: new Date(a.endDate),
                          isNew: a.isNew,
                          roomId: a.roomId,
                        })) || []
                      }
                      onSelectSlot={(slot) =>
                        this.handleSelectSlot(teacher, slot)
                      }
                      onSelectEvent={(slot) =>
                        this.handleSelectEvent(teacher.teacherId, slot)
                      }
                      step={step}
                      slotDuration={slotDuration}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="w-[330px] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-muted uppercase tracking-wider">
                  Свободные окна
                </span>
                <button
                  onClick={this.handleCopy}
                  disabled={!selectedSlotsText.trim()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 text-text-main hover:bg-secondary/20 transition-all disabled:opacity-30"
                >
                  <CopyIcon size="14px" />
                  <span className="text-xs">{copySuccess || "Копировать"}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={selectedSlotsText}
                className="flex-1 bg-input-bg border border-white/5 rounded-xl p-4 text-text-main text-sm outline-none resize-none focus:border-accent/50 transition-all scrollbar-thin"
                placeholder="Выберите слоты в календаре..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 flex justify-end">
            <button
              onClick={() => {
                this.props.onClose();
                this.props.onSlotsChange(this.state.availableSlots);
              }}
              className="px-8 py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent/80 transition-all active:scale-95 shadow-lg shadow-accent/20"
            >
              Продолжить
            </button>
          </div>
        </div>
      </div>
    );
  }
}
