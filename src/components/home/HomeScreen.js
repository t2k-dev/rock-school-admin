import { format } from "date-fns";
import React from "react";
import { Button, Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { CalendarDay } from "../common/CalendarDay";
import { EditIcon } from "../icons/EditIcon";

import { isCancelledAttendanceStatus } from "../common/attendanceHelper";

import { getHomeScreenDetails } from "../../services/apiHomeService";
import { markComplete } from "../../services/apiNoteService";
import { SlotDetailsModal } from "./SlotDetailsModal";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: null,
      notes: null,
      attendances: null,

      showCanceled: false,

      showSlotDetailsModal: false,

      selectedSlotDetails: null,
    };
    this.handleMarkComplete = this.handleMarkComplete.bind(this);
    this.handleShowCanceled = this.handleShowCanceled.bind(this);
  }
  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    const details = await getHomeScreenDetails(1);
    this.setState({
      rooms: details.rooms,
      notes: details.notes,
      attendances: details.attendances,

      showSlotDetailsModal: false,
    });
  }

  handleShowCanceled = (e) => {
    this.setState({ showCanceled: e.target.checked });
  };

  handleSelectEvent = (teacherId, slotInfo) => {
    const newSelectedSlotDetails = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];
    this.setState({ showSlotDetailsModal: true, selectedSlotDetails: newSelectedSlotDetails });
  };

  handleCloseSlotDetailsModal = () => {
    this.setState({ showSlotDetailsModal: false });
  };

  async handleMarkComplete(noteId) {
    await markComplete(noteId);
  }

  render() {
    const { attendances, showCanceled, selectedSlotDetails, notes, showSlotDetailsModal } = this.state;

    // Events

    let events;
    if (attendances) {
      const filteredAttendancies = showCanceled === false ? attendances.filter((a) => !isCancelledAttendanceStatus(a.status)) : attendances;
      events = filteredAttendancies.map((attendance) => ({
        id: attendance.attendanceId,
        title: attendance.student.firstName + " " + attendance.student.lastName,
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
                    <div className="flex-grow-1">{item.description}</div>
                    <div className="flex-shrink-1">
                      <Button variant="primary" size="sm" onClick={(e) => this.handleMarkComplete(item.noteId)}>
                        Выполнено
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
                    <div className="flex-grow-1 text-decoration-line-through">{item.description}</div>
                    <div className="flex-shrink-1">
                      <Button variant="secondary" size="sm" onClick={(e) => this.handleMarkComplete(item.noteId)} disabled>
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
              this.handleSelectEvent(1, slotInfo);
            }}
          />
          <div className="d-flex mt-2">
            <div className="flex-grow-1"></div>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Показывать отмененные"
              checked={showCanceled}
              onClick={(e) => {
                this.setState({ showCanceled: e.target.checked });
              }}
              className=""
            />
          </div>

          <SlotDetailsModal
            selectedSlotDetails={selectedSlotDetails}
            show={showSlotDetailsModal}
            handleClose={() => {
              this.handleCloseSlotDetailsModal();
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
            <Tab eventKey="completed" title="Другие">
              
            </Tab>
          </Tabs>
        </Row>
      </Container>
    );
  }
}

export default HomeScreen;
