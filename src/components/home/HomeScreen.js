import React from "react";
import { Form, Container, Row, Col, Table, Card, Button, FormCheck } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";

class HomeScreen extends React.Component{


    render(){
        const notes = [
          {
            "description": "Пробный урок в 12:00",
            "status": 1,
          },
          {
            "description": "Написать +77012031456 когда будут свободные окна у Аружан в 18.00",
            "status": 2,
          },
        ] ;

        const rooms = [
          {
            "name": "Барабанная",
            "status": "Занятие до 12:00",
            "teacher": "Сергей",
            "student": "Пушкин",
          },
          {
            "name": "Вокальная",
            "status": "Свободно",
            "teacher": "",
            "student": "",
          },
          {
            "name": "Гитарная",
            "status": "Репетиция до 14:00",
            "teacher": "Михаил",
            "student": "",
          },
          {
            "name": "Жёлтая",
            "status": "Свободно",
            "teacher": "",
            "student": "",
          },
          {
            "name": "Зелёная",
            "status": "Свободно",
            "teacher": "",
            "student": "",
          },

        ];

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
                      {rooms.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.teacher}</td>
                          <td>{item.student}</td>
                          <td>{item.status}</td>
                        </tr>
                      ))
                      }
                    </tbody>
                  </Table>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ marginTop: "40px" }}><h3>Активности на сегодня</h3>
                    </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                {notes.map((item, index) => (
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
                        ))}
                </Row>
                <Row>
                <Link to="/notes/addNote"><Button variant="success" size="sm">Добавить</Button></Link>
                </Row>
            </Container>
        )
    }
}

export default HomeScreen;
