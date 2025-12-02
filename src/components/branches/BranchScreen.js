import { format } from "date-fns";
import React from "react";
import { Button, Container, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { CalendarDay } from "../common/CalendarDay";
import { EditIcon } from "../icons/EditIcon";

import { getHomeScreenDetails } from "../../services/apiHomeService";
import { markComplete } from "../../services/apiNoteService";
import { SlotDetailsModal } from "../home/SlotDetailsModal";

export class BranchScreen extends React.Component {
  constructor(props) {
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

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
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
    const { branch, attendances, selectedSlotDetails, notes, showSlotDetailsModal } = this.state;

    // Events
    let events;
    if (attendances) {
      events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title: attendance.student.firstName + " " + attendance.student.lastName,
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        isTrial: attendance.isTrial,
      }));
    }

    // Notes
    const activeNotes = notes?.filter((n) => n.status === 1);
    const completedNotes = notes?.filter((n) => n.status === 2);

    let activeNotesTable;
    if (activeNotes && activeNotes?.length > 0) {
      activeNotesTable = (
        <Table striped bordered hover>

          <tbody>
            {activeNotes.map((item, index) => (
              <tr key={index}>
                <td style={{width: "100px"}}>
                  {format(item.completeDate, 'HH:mm')}
                </td>
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
    if (completedNotes ) {
      completedNotesTable = (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "100px" }}>Дата</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            {completedNotes.map((item, index) => (
              <tr key={index}>
                <td>{format(item.completeDate, "dd-MM-yyyy")}</td>
                <td>
                  <Container className="d-flex p-0">
                    <div className="flex-grow-1">{item.description}</div>
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
                {branch?.name}
                <EditIcon onIconClick={this.handleEditClick} />
              </div>
            </div>
            <div>
              <Button as={Link} to="/admin/addTrial" variant="outline-success">
                + Пробное занятие
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
            </Tab>
            <Tab eventKey="completed" title="Выполненные">
              {completedNotesTable}
            </Tab>
          </Tabs>
        </Row>
      </Container>
    );
  }
}