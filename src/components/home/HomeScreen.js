import React from "react";
import { Nav, Container, Row, Col, Table, Card, Button, FormCheck } from "react-bootstrap";
import { Link } from "react-router-dom";

import { CalendarDay } from "../common/CalendarDay";
import EditIcon from "../common/EditIcon";

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
      showSlotDetailsModal: false,

      selectedSlotDetails: null,
    };
    this.handleMarkComplete = this.handleMarkComplete.bind(this);
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

  handleSelectEvent = (teacherId, slotInfo) => {
    const newSelectedSlotDetails = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];
    this.setState({ showSlotDetailsModal: true, selectedSlotDetails: newSelectedSlotDetails });
  };

  handleCloseSlotDetailsModal = () => {
    this.setState({ showSlotDetailsModal: false });
  };

  async handleMarkComplete(noteId) {
    console.log("Start");
    await markComplete(noteId);
    console.log("Done");
  }

  render() {
    const { attendances, selectedSlotDetails, notes, showSlotDetailsModal } = this.state;

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
    console.log(attendances);
    const activeNotes = notes?.filter((n) => n.status === 1);
    const completedNotes = notes?.filter((n) => n.status === 2);

    let activeNotesList;
    if (activeNotes) {
      activeNotesList = activeNotes.map((item, index) => (
        <Card key={index} className="mb-2">
          <Card.Body>
            <Card.Text>
              <Row>
                <Col md="11">{item.description}</Col>
                <Col md="1">
                  <Button variant="primary" size="sm" onClick={(e) => this.handleMarkComplete(item.noteId)}>
                    Выполнено
                  </Button>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>
      ));
    } else {
      activeNotesList = <h4>Нет записей</h4>;
    }

    let completedNotesList;
    if (completedNotes) {
      completedNotesList = completedNotes.map((item, index) => (
        <Card key={index} className="mb-2">
          <Card.Body>
            <Card.Text>
              <Row>
                <Col md="10">{item.description}</Col>
                <Col md="2" style={{ textAlign: "right" }}>
                  <Button variant="secondary" size="sm" onClick={(e) => this.handleMarkComplete(item.noteId)}>
                    Не выполнено
                  </Button>
                </Col>
              </Row>
            </Card.Text>
          </Card.Body>
        </Card>
      ));
    } else {
      completedNotesList = <h4>Нет записей</h4>;
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row className="mb-4">
          <div className="d-flex">
            <div className="flex-grow-1">
              <div style={{fontWeight:'bold', fontSize:'28px'}}>Школа на Абая<EditIcon onIconClick={this.handleEditClick} /></div>
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
              <div style={{fontWeight:'bold', fontSize:'20px'}}>Активности</div>
            </div>
            <div>
              <Button as={Link} to="/notes/addNote" variant="outline-success" size="sm">
                + Новая активность
              </Button>
            </div>
          </div>
          <Nav variant="tabs" defaultActiveKey="new" className="mb-3">
            <Nav.Item>
              <Nav.Link eventKey="new">
                Текущие
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="existing"
                onClick={() => {
                  this.existingStudentSelected();
                }}
              >
                Выполненные
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Row>
        <Row style={{ marginTop: "10px" }}>{activeNotesList}</Row>
        <Row style={{ textAlign: "center" }}>
          <Link to="/notes/addNote">
            <Button variant="outline-success" size="sm">
              
            </Button>
          </Link>
        </Row>
      </Container>
    );
  }
}

export default HomeScreen;
