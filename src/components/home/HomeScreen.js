import React from "react";
import { Form, Container, Row, Col, Table, Button } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";

class HomeScreen extends React.Component{
    render(){
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
                        <th>#</th>
                        <th>Комната</th>
                        <th>Статус</th>
                        <th>Преподаватель</th>
                        <th>Ученик</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key={1}>
                          <td>1</td>
                          <td>Жёлтая</td>
                          <td>Вокал</td>
                          <td>Сергей</td>
                          <td>Пушкин</td>
                          <td>
                            <Button>
                              <i>-</i>
                            </Button>
                          </td>
                          </tr>
                          <tr key={2}>
                          <td>2</td>
                          <td>Красная</td>
                          <td>Свободно</td>
                          <td></td>
                          <td></td>
                          <td>
                            <Button>
                              <i>-</i>
                            </Button>
                          </td>

                        </tr>
                    </tbody>
                  </Table>
                    </Col>
                </Row>
                <Row>
                    <Col><h3>Активности на сегодня</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Table striped bordered hover style={{ marginTop: "20px" }}>
                    <thead>
                      <tr>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key={1}>
                          <td>Пробный урок в 12:00</td>
                          <td></td>
                          <td>
                            <Button>
                              <i>-</i>
                            </Button>
                          </td>
                          </tr>
                          <tr key={2}>
                          <td>Заправить что-то</td>
                          <td></td>
                          <td>
                            <Button>
                              <i>-</i>
                            </Button>
                          </td>

                        </tr>
                    </tbody>
                  </Table>
                    </Col>
                </Row>

            </Container>
        )
    }
}

export default HomeScreen;
