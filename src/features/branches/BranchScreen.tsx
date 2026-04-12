import { format } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";

import { CalendarDay } from "../../components/calendar/CalendarDay";
import { EditIcon } from "../../components/icons";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { Tabs } from "../../components/ui/Tabs";

import { getHomeScreenDetails } from "../../services/apiHomeService";
import { markComplete } from "../../services/apiNoteService";
import { AttendanceModal } from "../attendances/AttendanceModal/AttendanceModal";

interface BranchProps {
  match: {
    params: {
      id: string;
    };
  };
}

interface BranchState {
  branch: any;
  rooms: any;
  notes: any[] | null;
  attendances: any[] | null;
  showSlotDetailsModal: boolean;
  selectedSlotDetails: any;
}

export class BranchScreen extends React.Component<BranchProps, BranchState> {
  constructor(props: BranchProps) {
    super(props);
    this.state = {
      branch: null,
      rooms: null,
      notes: null,
      attendances: null,
      showSlotDetailsModal: false,
      selectedSlotDetails: null,
    };

    this.handleMarkComplete = this.handleMarkComplete.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  componentDidUpdate(prevProps: BranchProps) {
    if (prevProps.match?.params?.id !== this.props.match?.params?.id) {
      this.onFormLoad();
    }
  }

  async onFormLoad() {
    const details = await getHomeScreenDetails(this.props.match.params.id);
    this.setState({
      branch: details.branch,
      rooms: details.rooms,
      notes: details.notes,
      attendances: details.attendances,
      showSlotDetailsModal: false,
    });
  }

  handleSelectEvent = (slotInfo: any) => {
    const newSelectedSlotDetails = this.state.attendances?.find(
      (a: any) => a.attendanceId === slotInfo.id,
    );
    this.setState({
      showSlotDetailsModal: true,
      selectedSlotDetails: newSelectedSlotDetails,
    });
  };

  handleCloseSlotDetailsModal = () => {
    this.setState({ showSlotDetailsModal: false });
  };

  handleEditClick = () => {
    console.log("Edit clicked");
  };

  async handleMarkComplete(noteId: string | number) {
    await markComplete(noteId);
    this.onFormLoad();
  }

  render() {
    const {
      branch,
      attendances,
      selectedSlotDetails,
      notes,
      showSlotDetailsModal,
    } = this.state;

    const events =
      attendances?.map((attendance: any) => ({
        id: attendance.attendanceId,
        title: `${attendance.student.firstName} ${attendance.student.lastName}`,
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        type: attendance.attendanceType,
      })) || [];

    const activeNotes = notes?.filter((n) => n.status === 1) || [];
    const completedNotes = notes?.filter((n) => n.status === 2) || [];

    const renderNotesTable = (items: any[], isActive: boolean) => {
      if (!items || items.length === 0) {
        return (
          <div className="text-center py-10 text-text-muted">Нет записей</div>
        );
      }

      return (
        <div className="overflow-hidden rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-inner-bg text-text-muted uppercase text-xs font-bold">
                <th className="px-6 py-4 w-[120px]">Дата/Время</th>
                <th className="px-6 py-4">Описание</th>
                <th className="px-6 py-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-text-main font-medium">
                    {format(
                      new Date(item.completeDate),
                      isActive ? "HH:mm" : "dd.MM.yyyy",
                    )}
                  </td>
                  <td className="px-6 py-4 text-text-main opacity-80">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant={isActive ? "primary" : "secondary"}
                      size="sm"
                      disabled={!isActive}
                      onClick={() => this.handleMarkComplete(item.noteId)}
                    >
                      {isActive ? "Выполнено" : "Завершено"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    const tabsData = [
      {
        id: "active",
        title: "На сегодня",
        content: renderNotesTable(activeNotes, true),
      },
      {
        id: "completed",
        title: "Выполненные",
        content: renderNotesTable(completedNotes, false),
      },
    ];

    return (
      <div className="mx-auto max-w-[1500px] mt-10 px-4 font-geologica">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-3xl font-bold text-text-main">
            {branch?.name}
            <EditIcon onIconClick={this.handleEditClick} />
          </div>
          <Button
            as={Link}
            to="/admin/addTrial"
            variant="outlineSuccess"
            size="sm"
          >
            + Пробный урок
          </Button>
        </div>

        <Container className="p-8 mb-10">
          <CalendarDay
            events={events}
            onSelectEvent={(slotInfo: any) => this.handleSelectEvent(slotInfo)}
          />
          <AttendanceModal
            attendance={selectedSlotDetails}
            show={showSlotDetailsModal}
            handleClose={this.handleCloseSlotDetailsModal}
          />
        </Container>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-text-main">Активности</h3>
          <Button
            as={Link}
            to="/notes/addNote"
            variant="outlineSuccess"
            size="sm"
          >
            + Новая активность
          </Button>
        </div>

        <Tabs tabs={tabsData} defaultTabId="active" />
      </div>
    );
  }
}
