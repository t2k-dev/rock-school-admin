import { format } from "date-fns";
import React from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { CalendarDay } from "../../components/calendar/CalendarDay";
import { EditIcon } from "../../components/icons";
import { Loading } from "../../components/Loading";
import { AttendanceModal } from "../attendances/AttendanceModal/AttendanceModal";

import { NoRecords } from "../../components/NoRecords";
import { Colors } from "../../constants/Colors";
import { getHomeScreenDetails } from "../../services/apiHomeService";
import { markComplete } from "../../services/apiNoteService";
import { isCancelledAttendanceStatus } from "../attendances/attendanceHelper";

import { ColorLegend } from "../../components/calendar/ColorLegend";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: null,
      notes: null,
      attendances: null,

      showCanceled: true,
      showAttendanceModal: false,
      selectedAttendance: null,

      isLoading: true,
    };

    this.handleChangeNoteStatus = this.handleChangeNoteStatus.bind(this);
    this.handleShowCanceled = this.handleShowCanceled.bind(this);
    this.handleAttendanceUpdate = this.handleAttendanceUpdate.bind(this);
  }

  componentDidMount() {
    this.loadHomeScreen();
  }

  async loadHomeScreen() {
    try {
      this.setState({ isLoading: true, error: null, noteError: null });

      const details = await getHomeScreenDetails(1);

      this.setState({
        rooms: details.rooms,
        notes: details.notes,
        attendances: details.attendances,

        showAttendanceModal: false,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message || "Не удалось загрузить данные",
        isLoading: false,
      });
    }
  }

  handleShowCanceled = (e) => {
    this.setState({ showCanceled: e.target.checked });
  };

  handleSelectEvent = (slotInfo) => {
    const newSelectedAttendance = this.state.attendances.filter(
      (a) => a.attendanceId === slotInfo.id,
    )[0];
    this.setState({
      showAttendanceModal: true,
      selectedAttendance: newSelectedAttendance,
    });
  };

  handleCloseAttendanceModal = () => {
    this.setState({
      showAttendanceModal: false,
      selectedAttendance: null,
    });
  };

  async handleChangeNoteStatus(noteId, status) {
    await markComplete(noteId);

    this.setState((prevState) => {
      // Create a new array with updated notes
      const updatedNotes = prevState.notes.map((note) =>
        note.noteId === noteId ? { ...note, status: status } : note,
      );

      // Return the new state object
      return { notes: updatedNotes };
    });
  }

  handleAttendanceUpdate = (updatedData) => {
    if (!updatedData || !updatedData.attendanceId) return;

    this.setState((prevState) => {
      // Update the attendance in the attendances array
      const updatedAttendances = prevState.attendances.map((attendance) =>
        attendance.attendanceId === updatedData.attendanceId
          ? { ...attendance, ...updatedData }
          : attendance,
      );

      return {
        attendances: updatedAttendances,
        selectedAttendance:
          prevState.selectedAttendance?.attendanceId ===
          updatedData.attendanceId
            ? { ...prevState.selectedAttendance, ...updatedData }
            : prevState.selectedAttendance,
      };
    });
  };

  getEventTitle = (attendance) => {
    if (attendance.attendees?.length > 1) {
      return attendance.attendees
        .map((attendee) => attendee.student.firstName)
        .join(", ");
    }

    return `${attendance.attendees[0]?.student?.firstName} ${attendance.attendees[0]?.student?.lastName}`;
  };

  render() {
    const {
      isLoading,
      attendances,
      showCanceled,
      selectedAttendance,
      notes,
      showAttendanceModal,
    } = this.state;

    if (isLoading) {
      return <Loading message="Загрузка данных ..." />;
    }

    // Events
    let events;
    if (attendances) {
      const filteredAttendancies =
        showCanceled === false
          ? attendances.filter((a) => !isCancelledAttendanceStatus(a.status))
          : attendances;

      events = filteredAttendancies.map((attendance) => ({
        id: attendance.attendanceId,
        title: this.getEventTitle(attendance),
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        attendanceType: attendance.attendanceType,
        disciplineId: attendance.disciplineId,
      }));
    }

    // Notes
    const sortedNotes = notes?.sort((a, b) => {
      const dateA = new Date(a.completeDate);
      const dateB = new Date(b.completeDate);
      return dateB - dateA;
    });
    const activeNotes = sortedNotes?.filter((n) => n.status === 1);
    const completedNotes = sortedNotes?.filter((n) => n.status === 2);

    const renderNotesTable = (items, { completed = false } = {}) => {
      if (!items || items.length === 0) {
        return <NoRecords />;
      }

      return (
        <div className="overflow-x-auto rounded-[10px] border border-white/10 bg-[var(--notes-table-bg)]"
          style={{ "--notes-table-bg": Colors.cardBg }}
        >
          <table className="min-w-full border-collapse text-sm">
            <thead
              className="text-left text-[11px] uppercase tracking-[0.08em] text-[var(--notes-table-header)]"
              style={{ "--notes-table-header": Colors.textMuted }}
            >
              <tr>
                <th className="whitespace-nowrap px-4 py-3">Время</th>
                <th className="px-4 py-3">Активность</th>
                <th className="whitespace-nowrap px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.noteId}
                  className="border-t border-slate-700/60 transition-colors hover:bg-slate-800/30"
                >
                  <td className="whitespace-nowrap px-4 py-3 align-top font-medium text-slate-200">
                    {format(item.completeDate, "HH:mm")}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Link
                      to={{
                        pathname: `/notes/${item.noteId}/edit`,
                        state: { note: item },
                      }}
                      className={`no-underline transition ${
                        completed
                          ? "text-slate-400 line-through hover:text-slate-300"
                          : "text-slate-100 hover:text-blue-300"
                      }`}
                    >
                      {item.description}
                    </Link>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap justify-end gap-2">
                      {completed ? (
                        <button
                          type="button"
                          onClick={() => this.handleChangeNoteStatus(item.noteId, 1)}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/10"
                        >
                          Не выполнено
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => this.handleChangeNoteStatus(item.noteId, 2)}
                            className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:border-emerald-300/40 hover:bg-emerald-500/20"
                          >
                            Выполнено
                          </button>
                          <button
                            type="button"
                            onClick={() => this.handleChangeNoteStatus(item.noteId, 3)}
                            className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-500/20"
                          >
                            Отменено
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    let activeNotesTable;
    activeNotesTable = renderNotesTable(activeNotes);

    let completedNotesTable;
    completedNotesTable = renderNotesTable(completedNotes, {
      completed: true,
    });

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row className="mb-4">
          <div className="d-flex">
            <div className="flex-grow-1">
              <div style={{ fontWeight: "bold", fontSize: "28px" }}>
                Школа на Абая
                <EditIcon onIconClick={this.handleEditClick} />
              </div>
            </div>
            <div>
              <Button as={Link} to="/student" variant="outline-success">
                + Новый ученик
              </Button>
            </div>
          </div>
        </Row>
        <Row
          className="mb-5 rounded-[10px] bg-[var(--home-card-bg)] p-5"
          style={{ "--home-card-bg": Colors.cardBg }}
        >
          <CalendarDay
            events={events}
            onSelectEvent={(slotInfo) => {
              this.handleSelectEvent(slotInfo);
            }}
          />

          <div className="flex justify-between mt-4">
            <ColorLegend />
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Показывать отмененные"
              checked={showCanceled}
              onChange={(e) => {
                this.setState({ showCanceled: e.target.checked });
              }}
              className=""
            />
          </div>

          <AttendanceModal
            attendance={selectedAttendance}
            show={showAttendanceModal}
            handleClose={() => {
              this.handleCloseAttendanceModal();
            }}
          />
        </Row>
        

        <div className="h-10" />

        <Row>
          <div className="d-flex mb-2">
            <div className="flex-grow-1">
              <div className="mb-3 font-bold text-xl">
                Активности
              </div>
            </div>
            <div className="w-full flex justify-end">
          <div>
            <Button
              as={Link}
              to="/notes/addNote"
              variant="outline-success"
              size="sm"
            >
              + Новая активность
            </Button>
          </div>
        </div>
          </div>
          <Tabs
            defaultActiveKey="active"
            id="uncontrolled-tab-example"
          >
            <Tab eventKey="active" title="На сегодня">
              {activeNotesTable}
              <hr></hr>
              {completedNotesTable}
            </Tab>
            <Tab eventKey="completed" title="Другие">
              <NoRecords />
            </Tab>
          </Tabs>
        </Row>
      </Container>
    );
  }
}

export default HomeScreen;
