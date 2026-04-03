import React from "react";

import { Button, CloseButton, FormLabel } from "../../../components/ui";
import AttendanceType, { getAttendanceTypeName } from "../../../constants/AttendanceType";
import { acceptTrial, declineTrial, missedTrial, updateAttendeeStatus } from "../../../services/apiAttendanceService";
import { AttendanceStatusBadge } from "../AttendanceStatusBadge";
import { AttendanceDateAndRoom } from "./AttendanceDateAndRoom";
import { AttendanceHeaderInfo } from "./AttendanceHeaderInfo";
import { AttendeesList } from "./AttendeesList";



export class AttendanceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,

      status: 0,
      comment: "",
      statusReason: "",
      showDeclineConfirmation: false,
      isSubmittingDecline: false,
      attendance: null,
      attendees: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this); 
  }

  componentDidMount() {
    this.syncBodyScrollLock(this.props.show);
    document.addEventListener("keydown", this.handleDocumentKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.syncBodyScrollLock(this.props.show);
    }

    if (this.props.attendance && this.props.attendance !== prevProps.attendance) {
      const attendance = this.props.attendance;
      
      if (!attendance) {
        return;
      }

      this.setState({ 
        attendance: attendance,
        status: attendance.status,
        comment: attendance.comment || "",
        statusReason: "",
        showDeclineConfirmation: false,
        isSubmittingDecline: false,
      });
    }
  }

  componentWillUnmount() {
    this.syncBodyScrollLock(false);
    document.removeEventListener("keydown", this.handleDocumentKeyDown);
  }

  handleDocumentKeyDown = (event) => {
    if (event.key === "Escape" && this.props.show) {
      this.handleClose();
    }
  };

  syncBodyScrollLock = (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  handleClose() {
    this.setState({
      show: false,
      attendance: null,
      attendees: [],
      comment: "",
      statusReason: "",
      showDeclineConfirmation: false,
      isSubmittingDecline: false,
    });

    if (this.props.handleClose) {
      this.props.handleClose();
    }
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ 
      comment: value
    });
  };

  handleStatusReasonChange = (e) => {
    const { value } = e.target;
    this.setState({
      statusReason: value
    });
  };

  async handleAttendeeStatusChange(attendanceId, attendeeId, status) {
    const request ={
        attendeeId: attendeeId,
        attendeeStatus: status
    }
    await updateAttendeeStatus(attendanceId, request);
  }

  handleAcceptTrial = async () => {
    try {
      await acceptTrial(this.props.attendance.attendanceId, {});
      this.handleClose();
    } catch (error) {
      console.error('Error accepting trial:', error);
    }
  };

  handleDeclineTrial = () => {
    this.setState({
      showDeclineConfirmation: true,
      statusReason: "",
    });
  };

  handleCancelDeclineTrial = () => {
    this.setState({
      showDeclineConfirmation: false,
      statusReason: "",
    });
  };

  handleConfirmCancelation = async () => {
    const statusReason = this.state.statusReason.trim();

    if (!statusReason) {
      return;
    }

    try {
      this.setState({ isSubmittingDecline: true });

      await declineTrial(this.props.attendance.attendanceId, {
        subscriptionId:this.props.attendance.attendees[0].subscriptionId,
        statusReason,
      });
      
      this.handleClose();
    } catch (error) {
      console.error('Error declining trial:', error);
    } finally {
      this.setState({ isSubmittingDecline: false });
    }
  };

  handleMissedTrial = async () => {
    try {
      await missedTrial(this.props.attendance.attendanceId, {});
      this.props.handleClose();
    } catch (error) {
      console.error('Error recording missed trial:', error);
    }
  };

  render() {
    if (!this.props.show || !this.props.attendance) {
      return null;
    }

    const { status, attendanceType, isCompleted } = this.props.attendance;
    const { comment, statusReason, showDeclineConfirmation, isSubmittingDecline } = this.state;
    const textareaClassName = "min-h-[112px] w-full rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[15px] text-text-main outline-none transition placeholder:text-text-muted/30 focus:border-white/20 focus:ring-2 focus:ring-accent";

    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
        <div className="relative flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-card-bg shadow-2xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[22px] font-semibold text-text-main">
                {getAttendanceTypeName(attendanceType)}
              </h2>
              <AttendanceStatusBadge status={status} style={{ fontSize: "14px" }} />
            </div>

            <CloseButton onClick={this.handleClose} />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <div className="grid gap-4 text-[14px] sm:grid-cols-2">
              <div className="rounded-[20px] bg-inner-bg p-4">
                <AttendanceHeaderInfo attendance={this.props.attendance} />
              </div>

              <div className="rounded-[20px] bg-inner-bg p-4 sm:text-right">
                <AttendanceDateAndRoom
                  {...this.props.attendance}
                  attendance={this.props.attendance}
                  className="sm:ml-auto"
                />
              </div>
            </div>

            <div className="my-5 h-px bg-white/10" />

            <AttendeesList
              attendance={this.props.attendance}
              onAttendeeStatusChange={this.handleAttendeeStatusChange.bind(this)}
            />

            {comment && (
              <>
                <div className="my-5 h-px bg-white/10" />
                <label className="flex flex-col gap-3">
                  <FormLabel>Комментарий</FormLabel>
                  <textarea
                    rows={4}
                    onChange={this.handleChange}
                    value={comment}
                    placeholder="введите..."
                    autoComplete="off"
                    className={textareaClassName}
                  />
                </label>
              </>
            )}

            {showDeclineConfirmation && (
              <>
                <div className="my-5 h-px bg-white/10" />
                <label className="flex flex-col gap-3">
                  <FormLabel>Причина</FormLabel>
                  <textarea
                    rows={3}
                    onChange={this.handleStatusReasonChange}
                    value={statusReason}
                    placeholder="Укажите причину отказа..."
                    autoComplete="off"
                    className={textareaClassName}
                  />
                </label>
              </>
            )}
          </div>

          {attendanceType === AttendanceType.TRIAL_LESSON && isCompleted && (
            <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 px-6 py-5 sm:px-8">
              {showDeclineConfirmation ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={this.handleCancelDeclineTrial}
                    disabled={isSubmittingDecline}
                  >
                    Назад
                  </Button>
                  <Button
                    variant="danger"
                    onClick={this.handleConfirmCancelation}
                    disabled={!statusReason.trim() || isSubmittingDecline}
                  >
                    {isSubmittingDecline ? "Сохраняем..." : "Подтвердить отмену"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={this.handleDeclineTrial}>
                    Отклонил
                  </Button>
                  <Button variant="outlineSuccess" onClick={this.handleAcceptTrial}>
                    Решил продолжить
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
