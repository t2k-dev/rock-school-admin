import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { CalendarDay } from "../../../components/calendar/CalendarDay";
import { EditIcon } from "../../../components/icons";
import { Loading } from "../../../components/Loading";
import { AttendanceModal } from "../../attendances/AttendanceModal/AttendanceModal";
import { NoRecords } from "../../../components/NoRecords";
import { ColorLegend } from "../../../components/calendar/ColorLegend";
import { Button, Container, Tabs } from "../../../components/ui";

import { HomeDataService } from "../model/HomeDataService";
import { useHomeScreen } from "../model/useHomeScreen";

interface HomeScreenState {
  rooms: any[] | null;
  notes: any[] | null;
  attendances: any[] | null;
  showCanceled: boolean;
  showAttendanceModal: boolean;
  selectedAttendance: any | null;
  isLoading: boolean;
  error?: string | null;
}

class HomeScreen extends React.Component<{}, HomeScreenState> {
  private controller = new useHomeScreen(this);

  constructor(props: {}) {
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
  }

  componentDidMount() {
    this.controller.loadData();
  }

  handleEditClick = () => console.log("Edit clicked");

  handleShowCanceled = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ showCanceled: e.target.checked });
  };

  getEventTitle = (attendance: any) => {
    if (attendance.attendees?.length > 1) {
      return attendance.attendees
        .map((a: any) => a.student.firstName)
        .join(", ");
    }
    return `${attendance.attendees[0]?.student?.firstName || ""} ${attendance.attendees[0]?.student?.lastName || ""}`;
  };

  renderNotesTable(items: any[], isCompleted = false) {
    if (!items.length) return <NoRecords />;
    return (
      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-inner-bg rounded-2xl"
          >
            <div className="flex gap-4 items-center">
              <span className="font-bold text-text-main">
                {format(new Date(item.completeDate), "HH:mm")}
              </span>
              <Link
                to={{
                  pathname: `/notes/${item.noteId}/edit`,
                  state: { note: item },
                }}
                className={`hover:text-accent transition-colors ${isCompleted ? "line-through opacity-50 text-text-muted" : "text-text-main"}`}
              >
                {item.description}
              </Link>
            </div>
            <div className="flex gap-2">
              {!isCompleted ? (
                <Button
                  variant="success"
                  onClick={() =>
                    this.controller.changeNoteStatus(item.noteId, 2)
                  }
                  size="sm"
                >
                  Выполнено
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() =>
                    this.controller.changeNoteStatus(item.noteId, 1)
                  }
                  size="sm"
                >
                  Вернуть
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const {
      isLoading,
      attendances,
      showCanceled,
      notes,
      showAttendanceModal,
      selectedAttendance,
    } = this.state;
    if (isLoading) return <Loading message="Загрузка данных ..." />;

    const events = HomeDataService.prepareCalendarEvents(
      attendances,
      showCanceled,
      this.getEventTitle,
    );
    const { active, completed } = HomeDataService.getGroupedNotes(notes);

    const tabsData = [
      {
        id: "active",
        title: "На сегодня",
        content: (
          <div className="flex flex-col">
            {this.renderNotesTable(active)}
            {completed.length > 0 && (
              <>
                <div className="my-4" />
                {this.renderNotesTable(completed, true)}
              </>
            )}
          </div>
        ),
      },
      { id: "completed", title: "Другие", content: <NoRecords /> },
    ];

    return (
      <div className="mx-auto max-w-[1500px] mt-6 px-4 font-geologica">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-3xl font-bold text-text-main">
            Школа на Абая <EditIcon onIconClick={this.handleEditClick} />
          </div>
          <Button as={Link} to="/student" variant="success" size="sm">
            + Новый ученик
          </Button>
        </div>

        <Container className="bg-card-bg p-8 mb-10">
          <CalendarDay events={events} onSelectEvent={() => {}} />
          <div className="flex items-center justify-between mt-4">
            <ColorLegend />
            <label className="flex items-center cursor-pointer gap-3 select-none">
              <span className="text-sm font-medium text-text-muted">
                Показывать отмененные
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showCanceled}
                  onChange={this.handleShowCanceled}
                />
                <div className="w-11 h-6 bg-accent/40 rounded-full peer peer-checked:bg-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </div>
            </label>
          </div>
        </Container>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-text-main">Активности</h3>
          <Button as={Link} to="/notes/addNote" variant="success" size="sm">
            + Новая активность
          </Button>
        </div>
        <Tabs tabs={tabsData} />

        <AttendanceModal
          attendance={selectedAttendance}
          show={showAttendanceModal}
          handleClose={() => this.setState({ showAttendanceModal: false })}
        />
      </div>
    );
  }
}

export default HomeScreen;
