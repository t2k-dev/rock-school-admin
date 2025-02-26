import React from "react";
import { Form, Container, Row, Col, Table, Card, Button, FormCheck } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { getHomeScreenDetails } from "../../services/apiHomeService";
import { markComplete } from "../../services/apiNoteService";

class HomeScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      rooms : null,
      notes : null,
    }
    this.handleMarkComplete = this.handleMarkComplete.bind(this);
  }

  componentDidMount(){
          this.onFormLoad();
  }

  async onFormLoad(){
    const details = await getHomeScreenDetails(1);
    this.setState({
      rooms : details.rooms,
      notes : details.notes,
    })
  }

  async handleMarkComplete(noteId){
    console.log('Start');
    await markComplete(noteId);
    console.log('Done');
  }

  render(){
    const {rooms, notes} = this.state;
    let roomsList;
    if (rooms){
      roomsList = rooms.map((item, index) => (
        <tr key={index}>
          <td>{item.roomName}</td>
          <td>{item.teacherName}</td>
          <td>{item.studentName}</td>
          <td>{item.status}</td>
        </tr>
        ));
    }
    else{
      roomsList = <tr key={1}>
        <td></td>
        <td>Нет записей</td>
        <td></td>
        <td></td>
      </tr>
    }

    const activeNotes = notes?.filter(n => n.status === 1);
    const completedNotes = notes?.filter(n => n.status === 2);
    
    let activeNotesList;
    if (activeNotes){
      activeNotesList = activeNotes.map((item, index) => (
        <Card key={index} className="mb-2">
        <Card.Body>
          <Card.Text>
            <Row>
            <Col md="11">
              {item.description}
            </Col>
            <Col md="1">
              <Button variant="primary" size="sm" onClick={(e) => this.handleMarkComplete(item.noteId)}>Сделано</Button>
            </Col>
            </Row>
          </Card.Text>
          
        </Card.Body>
      </Card>
      ));
    }
    else{
      activeNotesList =
        <h4>Нет записей</h4>
    }

    let completedNotesList;
    if (completedNotes){
      completedNotesList = completedNotes.map((item, index) => (
        <Card key={index} className="mb-2">
        <Card.Body>
          <Card.Text>
            <Row>
            <Col md="11">
              {item.description}
            </Col>
            <Col md="1">
              <Button variant="primary" size="sm" onClick={(e) => this.handleMarkComplete(item.noteId)}>Сделано</Button>
            </Col>
            </Row>
          </Card.Text>
          
        </Card.Body>
      </Card>
      ));
    }
    else{
      completedNotesList =
        <h4>Нет записей</h4>
    }

      return(
          <Container style={{marginTop: "40px"}}>
              <Row>
                  <Col><h2>Школа на Абая</h2>
                  </Col>
              </Row>
              <Row>
                  <Col>
                  <Table striped bordered hover style={{ marginTop: "20px" }}>
                  <thead>
                    <tr>
                      <th>Комната</th>
                      <th>Преподаватель</th>
                      <th>Ученик</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomsList}
                  </tbody>
                </Table>
                  </Col>
              </Row>
              <Row>
                  <Col style={{ marginTop: "40px" }}><h3>Активности на сегодня</h3>
                  </Col>
              </Row>
              <Row style={{ marginTop: "10px" }}>
                {activeNotesList}
              </Row>
              <Row>
              <Link to="/notes/addNote"><Button variant="success" size="sm">Добавить</Button></Link>
              </Row>
              <Row>
                  <Col style={{ marginTop: "40px" }}><h3>Выполненные активности</h3>
                  </Col>
              </Row>
              <Row>
                {completedNotesList}
              </Row>

          </Container>
      )
    }
}

export default HomeScreen;
