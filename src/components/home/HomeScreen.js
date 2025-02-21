import React from "react";
import { Form, Container, Row, Col, Table, Card, Button, FormCheck } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import { getHomeScreenDetails } from "../../services/apiHomeService";

class HomeScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      Rooms : [],
      Notes : []
    }
  }

  componentDidMount(){
          console.log(this.props.match)
          this.onFormLoad();
  }

  async onFormLoad(){
    const details = await getHomeScreenDetails();
    
    console.log(  details);

    this.setState({
      Rooms : details.rooms,
      Notes : details.notes,
    })

    console.log(this.state);
  }

    render(){
      const {rooms, notes} = this.state;
      let roomsList;
      if (this.state.rooms){
        roomsList = this.state.rooms.map((item, index) => (
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

      let notesList;
      if (this.state.notes){
        notesList = this.state.notes.map((item, index) => (
          <Card key={index} className="mb-2">
          <Card.Body>
            <Card.Text>
              <Row>
              <Col md="11">
                {item.description}
              </Col>
              <Col md="1">
              <Button variant="primary" size="sm">Сделано</Button>
              </Col>
              </Row>
            </Card.Text>
            
          </Card.Body>
        </Card>
        ));
      }
      else{
        notesList =
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
                  {notesList}
                </Row>
                <Row>
                <Link to="/notes/addNote"><Button variant="success" size="sm">Добавить</Button></Link>
                </Row>
            </Container>
        )
    }
}

export default HomeScreen;
