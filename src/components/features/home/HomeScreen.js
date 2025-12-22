import { format } from "date-fns";
import React from "react";
import { Button, Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { CalendarDay } from "../../shared/calendar/CalendarDay";
import { EditIcon } from "../../shared/icons/EditIcon";
import { Loading } from "../../shared/Loading";
import { AttendanceModal } from "../../shared/slots/AttendanceModal";
import { GroupAttendanceModal } from "../../shared/slots/GroupAttendanceModal";

import { isCancelledAttendanceStatus } from "../../common/attendanceHelper";

import { getHomeScreenDetails } from "../../../services/apiHomeService";
import { markComplete } from "../../../services/apiNoteService";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: null,
      notes: null,
      attendances: null,

      showCanceled: true,
      showAttendanceModal: false,
      showGroupSlotDetailsModal: false,
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
        showGroupSlotDetailsModal: false,
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
    const newSelectedAttendance = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];

    if (newSelectedAttendance.groupId !== null) {
      this.setState({ showGroupSlotDetailsModal: true, selectedAttendance: newSelectedAttendance });
    } else {
      this.setState({ showAttendanceModal: true, selectedAttendance: newSelectedAttendance });
    }
  };

  handleCloseAttendanceModal = () => {
    this.setState({ 
      showAttendanceModal: false,
      selectedAttendance: null,
    });
  };

  handleCloseGroupSlotDetailsModal = () => {
    this.setState({ 
      showGroupSlotDetailsModal: false,
      selectedAttendance: null, 
    });
  };

  async handleChangeNoteStatus(noteId, status) {
    await markComplete(noteId);

    this.setState((prevState) => {
      // Create a new array with updated notes
      const updatedNotes = prevState.notes.map((note) =>
        note.noteId === noteId ? { ...note, status: status } : note
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
          : attendance
      );

      return { 
        attendances: updatedAttendances,
        selectedAttendance: prevState.selectedAttendance?.attendanceId === updatedData.attendanceId
          ? { ...prevState.selectedAttendance, ...updatedData }
          : prevState.selectedAttendance
      };
    });
  };

  getEventTitle = (attendance) => {
    if (attendance.childAttendances?.length > 0) {
      return attendance.childAttendances
        .map(childAttendance => childAttendance.student.firstName)
        .join(", ");
    }
    
    return `${attendance.student.firstName} ${attendance.student.lastName}`;
  };

  render() {
    const { 
      isLoading,
      attendances, 
      showCanceled, 
      selectedAttendance, 
      notes, 
      showAttendanceModal, 
      showGroupSlotDetailsModal 
    } = this.state;

    if (isLoading) {
      return <Loading
        message="Загрузка данных ..."
      />
    }

    // Events

    let events;
    if (attendances) {

      const filteredAttendancies = showCanceled === false 
        ? attendances.filter((a) => !isCancelledAttendanceStatus(a.status)) 
        : attendances;

      events = filteredAttendancies.map((attendance) => ({
        id: attendance.attendanceId,
        title: this.getEventTitle(attendance),
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        isTrial: attendance.isTrial,
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

    let activeNotesTable;
    if (activeNotes && activeNotes?.length > 0) {
      activeNotesTable = (
        <Table striped bordered hover>
          <tbody>
            {activeNotes.map((item, index) => (
              <tr key={index}>
                <td style={{ width: "100px" }}>{format(item.completeDate, "HH:mm")}</td>
                <td>
                  <Container className="d-flex p-0">
                    <div className="flex-grow-1">
                      <Link
                        to={{
                          pathname: `/notes/${item.noteId}/edit`,
                          state: { note: item },
                        }}
                      >
                        {item.description}
                      </Link>
                    </div>
                    <div className="flex-shrink-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={(e) => this.handleChangeNoteStatus(item.noteId, 2)}
                        style={{ marginLeft: "10px" }}
                      >
                        Выполнено
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) => this.handleChangeNoteStatus(item.noteId, 3)}
                        style={{ marginLeft: "10px", marginRight: "10px" }}
                      >
                        Отменено
                      </Button>
                    </div>
                  </Container>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else {
      activeNotesTable = <div className="text-center">Нет записей</div>;
    }

    let completedNotesTable;
    if (completedNotes && completedNotes?.length > 0) {
      completedNotesTable = (
        <Table striped bordered hover>
          <tbody>
            {completedNotes.map((item, index) => (
              <tr key={index}>
                <td style={{ width: "100px" }}>{format(item.completeDate, "HH:mm")}</td>
                <td>
                  <Container className="d-flex p-0">
                    <div className="flex-grow-1 text-decoration-line-through">
                      <Link
                        to={{
                          pathname: `/notes/${item.noteId}/edit`,
                          state: { note: item },
                        }}
                      >
                        {item.description}
                      </Link>
                    </div>
                    <div className="flex-shrink-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => this.handleChangeNoteStatus(item.noteId, 1)}
                        style={{ marginRight: "10px" }}
                      >
                        Не выполнено
                      </Button>
                    </div>
                  </Container>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else {
      completedNotesTable = <div className="text-center">Нет записей</div>;
    }

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
        <Row className="mb-5">
          <CalendarDay
            events={events}
            onSelectEvent={(slotInfo) => {
              this.handleSelectEvent(slotInfo);
            }}
          />
          <div className="d-flex mt-2">
            <div className="flex-grow-1"></div>
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
            history={this.props.history}
            attendance={selectedAttendance}
            show={showAttendanceModal}
            onAttendanceUpdate={this.handleAttendanceUpdate}
            handleClose={() => {
              this.handleCloseAttendanceModal();
            }}
          />
          <GroupAttendanceModal
            attendance={selectedAttendance}
            show={showGroupSlotDetailsModal}
            handleClose={() => {
              this.handleCloseGroupSlotDetailsModal();
            }}
          />
        </Row>
        <Row>
          <div className="d-flex mb-2">
            <div className="flex-grow-1">
              <div style={{ fontWeight: "bold", fontSize: "20px" }}>Активности</div>
            </div>
            <div>
              <Button as={Link} to="/notes/addNote" variant="outline-success" size="sm">
                + Новая активность
              </Button>
            </div>
          </div>
          <Tabs defaultActiveKey="active" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="active" title="На сегодня">
              {activeNotesTable}
              <hr></hr>
              {completedNotesTable}
            </Tab>
            <Tab eventKey="completed" title="Другие"></Tab>
          </Tabs>
        </Row>
      </Container>
    );
  }
}

export default HomeScreen;
