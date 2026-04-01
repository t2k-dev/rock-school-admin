import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

import React from "react";

import { Avatar } from "../../components/Avatar";
import { Button, FormLabel, FormWrapper, Input, ToneBadge } from "../../components/ui";

import { CalendarIcon } from "../../components/icons";
import AttendanceType from "../../constants/AttendanceType";
import { getDisciplineName } from "../../constants/disciplines";
import { SectionTitle, SectionWrapper } from "../../layout";
import { rescheduleAttendance } from "../../services/apiAttendanceService";
import { getBusySlots } from "../../services/apiBranchService";
import { getNextAvailableSlot } from "../../services/apiSubscriptionService";
import { getWorkingPeriods } from "../../services/apiTeacherService";
import { DisciplineIcon } from "../disciplines/DisciplineIcon";
import { getSlotDescription } from "./attendanceHelper";
import { SelectRoomSlot } from "./SelectRoomSlot";
import { SelectTeacherSlot } from "./SelectTeacherSlot";

export class AttendanceRescheduleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      branchId: 0,

      backgroundEvents: [],

      availableTeachers: [],
      showAvailableTeacherModal: false,
      rooms: [],
      showAvailableSlotsModal: false,
      selectedSlotId: 0,
      selectedSlot: null,

      cancellationType: "",
      comment: "",
      notificationDate: format(new Date(), "yyyy-MM-dd HH:mm"),
      error: "",
      isSaving: false,
    };

    this.handleCloseAvailableTeachersModal =
      this.handleCloseAvailableTeachersModal.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { state } = this.props.location;
    if (state && state.attendance) {
      this.setState({ attendance: state.attendance });
    }
  }

  showAvailableSlotsModal = async (e) => {
    e.preventDefault();

    const { teacher } = this.state.attendance;

    const response = await getWorkingPeriods(teacher.teacherId);
    const teachers = response.data?.teacher ? [response.data.teacher] : [];

    this.setState({
      availableTeachers: teachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    this.setState({ showAvailableTeacherModal: false });
  };

  showAvailableRoomSlotsModal = async (e) => {
    e.preventDefault();

    const branchId = 1; // Default branch ID
    const responseData = await getBusySlots(branchId);

    this.setState({
      rooms: responseData,
      showAvailableSlotsModal: true,
    });
  };

  handleCloseRoomSlotsModal = () => {
    this.setState({ showAvailableSlotsModal: false });
  };

  handleSlotsChange = (availableSlots) => {
    const selectedSlot = availableSlots.length > 0 ? availableSlots[0] : null;
    this.setState({ selectedSlot: selectedSlot });
  };

  handleGetNextAvailableSlot = async (e) => {
    e.preventDefault();

    const response = (
      await getNextAvailableSlot(this.state.attendance.subscriptionId)
    ).data;

    const date = new Date(response.startDate);
    const roomId = response.roomId;
    const slotId = uuidv4();
    const slot = {
      id: slotId,
      start: date,
      roomId: roomId,
    };

    this.setState({ selectedSlot: slot });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const { selectedSlot, attendance } = this.state;

    if (!selectedSlot) {
      this.setState({ error: "Выберите новое окно перед сохранением." });
      return;
    }

    this.setState({ error: "", isSaving: true });

    const requestBody = {
      attendanceId: attendance.attendanceId,
      newStartDate: selectedSlot.start,
      newEndDate: selectedSlot.end,
      roomId: selectedSlot.roomId,
    };

    try {
      await rescheduleAttendance(attendance.attendanceId, requestBody);
      window.history.back();
    } catch (error) {
      console.error("Failed to reschedule attendance:", error);
      this.setState({ error: "Не удалось перенести занятие. Попробуйте еще раз." });
    } finally {
      this.setState({ isSaving: false });
    }
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  renderHeader = () => {
    const { attendance } = this.state;

    switch (attendance?.attendanceType) {
      case AttendanceType.LESSON:
        return "Перенос урока";
      case AttendanceType.TRIAL_LESSON:
        return "Перенос пробного урока";
      default:
        return "Перенос";
    }
  };

  renderAttendanceTypeBadge = (attendanceType) => {
    switch (attendanceType) {
      case AttendanceType.LESSON:
        return <ToneBadge label="Урок" tone="primary" />;
      case AttendanceType.TRIAL_LESSON:
        return <ToneBadge label="Пробный урок" tone="warning" />;
      default:
        return <ToneBadge label="Занятие" tone="secondary" />;
    }
  };

  render() {
    const {
      attendance,
      showAvailableTeacherModal,
      availableTeachers,
      showAvailableSlotsModal,
      rooms,
      selectedSlot,
      notificationDate,
      cancellationType,
      comment,
      error,
      isSaving,
    } = this.state;
    if (!attendance) {
      return;
    }

    const { teacher } = attendance;
    const attendee = attendance.attendees?.[0]?.student;
    const attendanceStart = new Date(attendance.startDate);
    const attendanceEnd = new Date(attendance.endDate);
    const selectedSlotLabel = selectedSlot
      ? getSlotDescription(selectedSlot)
      : "Не выбрано";

    return (
        <SectionWrapper className="mx-auto max-w-3xl p-0">
          <SectionTitle className="text-center">{this.renderHeader()}</SectionTitle>

          <FormWrapper className="mx-auto max-w-[560px] space-y-6">
            <div className="space-y-4 rounded-[18px] bg-input-bg/50 p-5">
              <div className="flex items-center gap-2 text-[15px] text-text-main">
                <DisciplineIcon
                  size="20"
                  style={{ marginRight: "4px" }}
                  disciplineId={attendance.disciplineId}
                />
                <span>{getDisciplineName(attendance.disciplineId)}</span>
              </div>

              <div className="flex items-start gap-2 text-[14px] text-text-main">
                <span className="mt-[2px] text-text-main">
                  <CalendarIcon />
                </span>
                <span>
                  {format(attendanceStart, "d MMMM, EEEE", { locale: ru })}, с {format(attendanceStart, "HH:mm")} до {format(attendanceEnd, "HH:mm")}
                </span>
              </div>

              {attendee && (
                <div className="flex items-center gap-2 text-[14px] text-text-main">
                  <Avatar style={{ width: "20px", height: "20px", marginRight: "4px" }} />
                  <span>
                    {attendee.firstName} {attendee.lastName}
                  </span>
                </div>
              )}

              {teacher && (
                <div className="text-[14px] text-text-main">
                  Преподаватель: {teacher.firstName} {teacher.lastName}
                </div>
              )}
            </div>

            <div className="border-t border-white/10" />

            <form className="space-y-5" onSubmit={this.handleSave}>
              <label className="flex flex-col gap-2">
                <FormLabel as="span">Кто переносит</FormLabel>
                <select
                  id="cancellationType"
                  value={cancellationType}
                  onChange={this.handleChange}
                  className="w-full rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[16px] text-text-main outline-none transition focus:border-white/20 focus:ring-2 focus:ring-accent"
                >
                  <option value="">Выберите...</option>
                  <option value="0">Ученик</option>
                  <option value="1">Преподаватель</option>
                  <option value="2">Администрация</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <FormLabel as="span">Дата уведомления</FormLabel>
                <Input
                  id="notificationDate"
                  onChange={this.handleChange}
                  value={notificationDate}
                  placeholder="Введите дату и время"
                  autoComplete="off"
                />
              </label>

              <label className="flex flex-col gap-2">
                <FormLabel as="span">Причина</FormLabel>
                <textarea
                  id="comment"
                  onChange={this.handleChange}
                  value={comment}
                  placeholder="Введите причину"
                  autoComplete="off"
                  rows={4}
                  className="w-full rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[16px] text-text-main outline-none transition placeholder:text-text-muted/30 focus:border-white/20 focus:ring-2 focus:ring-accent"
                />
              </label>

              <div className="pt-2">
                {teacher ? (
                  <SelectTeacherSlot
                    teacher={teacher}
                    availableTeachers={availableTeachers}
                    showAvailableTeacherModal={showAvailableTeacherModal}
                    selectedSlot={selectedSlot}
                    attendance={attendance}
                    onShowAvailableSlotsModal={this.showAvailableSlotsModal}
                    onCloseModal={this.handleCloseAvailableTeachersModal}
                    onSlotsChange={this.handleSlotsChange}
                    onGetNextAvailableSlot={this.handleGetNextAvailableSlot}
                  />
                ) : (
                  <SelectRoomSlot
                    rooms={rooms}
                    showAvailableSlotsModal={showAvailableSlotsModal}
                    attendance={attendance}
                    onShowAvailableSlotsModal={this.showAvailableRoomSlotsModal}
                    onCloseModal={this.handleCloseRoomSlotsModal}
                    onSlotsChange={this.handleSlotsChange}
                  />
                )}
              </div>

              <div className="space-y-2 rounded-[16px] border border-white/10 bg-main-bg/30 px-4 py-4">
                <div className="text-[15px] font-semibold text-text-main">Новая дата урока</div>
                <div className="text-[14px] text-text-main">{selectedSlotLabel}</div>
              </div>

              {error && (
                <div className="rounded-[14px] border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-danger">
                  {error}
                </div>
              )}

              <div className="border-t border-white/10 pt-5 text-center">
                <Button as="button" type="submit" disabled={isSaving || !selectedSlot}>
                  {isSaving ? "Сохраняем..." : "Перенести"}
                </Button>
              </div>
            </form>
          </FormWrapper>
        </SectionWrapper>
    );
  }
}
