import React from "react";
import { Form, Container, Row, Col, Table, Card, Button, FormCheck } from "react-bootstrap";
import { Link } from "react-router-dom";

import { CalendarDay } from "../common/CalendarDay";

import { getHomeScreenDetails } from "../../services/apiHomeService";
import { markComplete } from "../../services/apiNoteService";
import { SlotDetailsModal } from "./SlotDetailsModal";

const events = [
  {
    title: "Алексей Кутузов",
    start: new Date(1900, 0, 1, 11, 0, 0, 0),
    end: new Date(1900, 0, 1, 12, 0, 0, 0),
    resourceId: 1,
  },
  {
    title: "Сергей Петров",
    start: new Date(1900, 0, 1, 11, 0, 0, 0),
    end: new Date(1900, 0, 1, 12, 0, 0, 0),
    resourceId: 2,
  },
  {
    title: "Алексей Кутузов",
    start: new Date(1900, 0, 1, 11, 0, 0, 0),
    end: new Date(1900, 0, 1, 12, 0, 0, 0),
    resourceId: 3,
  },
  {
    title: "Сергей Петров",
    start: new Date(1900, 0, 1, 11, 0, 0, 0),
    end: new Date(1900, 0, 1, 12, 0, 0, 0),
  },
  {
    title: "Всеволод Жердеев",
    start: new Date(1900, 0, 2, 14, 0, 0, 0),
    end: new Date(1900, 0, 2, 15, 0, 0, 0),
  },
  {
    title: "Ануар Ахметкалиев ",
    start: new Date(1900, 0, 4, 18, 0, 0, 0),
    end: new Date(1900, 0, 4, 19, 0, 0, 0),
  },
];

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: null,
      notes: null,
      attendances: null,
      showSlotDetailsModal: false,

      selectedSlotDetails:null,
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
    const newSelectedSlotDetails = this.state.attendances.filter(a=> a.attendanceId === slotInfo.id)[0]
    this.setState({showSlotDetailsModal: true, selectedSlotDetails: newSelectedSlotDetails});
  };

  handleCloseSlotDetailsModal = () => {
    this.setState({showSlotDetailsModal: false});
  }

  async handleMarkComplete(noteId) {
    console.log("Start");
    await markComplete(noteId);
    console.log("Done");
  }

  render() {
    const { attendances, selectedSlotDetails, notes, showSlotDetailsModal } = this.state;

    let events
    if (attendances){
       events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title: attendance.student.firstName + ' ' + attendance.student.lastName,
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        isTrial: attendance.isTrial,
      }));
    }
    console.log(attendances);
    console.log(events);
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
          <Col>
            <h2>Школа на Абая</h2>
          </Col>
        </Row>
        <Row>
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
          <Col style={{ marginTop: "40px" }}>
            <h3>Активности на сегодня</h3>
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }}>{activeNotesList}</Row>
        <Row style={{ textAlign: "center" }}>
          <Link to="/notes/addNote">
            <Button variant="outline-success" size="sm">
              Добавить
            </Button>
          </Link>
        </Row>
        <Row>
          <Col style={{ marginTop: "40px" }}>
            <h3>Выполненные активности</h3>
          </Col>
        </Row>
        <Row>{completedNotesList}</Row>
      </Container>
    );
  }
}

export default HomeScreen;
