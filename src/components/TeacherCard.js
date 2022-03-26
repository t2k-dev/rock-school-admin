import React from "react";
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import noImage from '../images/user.jpg';
import { Link } from "react-router-dom";

class TeacherCard extends React.Component{

    render(){
        return(
                <Card className="ms-col-2">
                    <Card.Body>
                        <Row>
                            <Col md="2">
                            <Image src={noImage} className='img-preview' fluid='true'/>
                            </Col>
                            <Col>
                                <h3>{this.props.firstName} {this.props.lastName}</h3>
                                <div>
                                    Дисциплины
                                    <ul>
                                        <li>Гитара</li>
                                        <li>Барабаны</li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{textAlign:'right'}}>
                                <Link to="/teachers/edit/2"><Button variant="primary">Редактировать</Button></Link>
                            </Col>
                        </Row>
                        
                    </Card.Body>
                </Card>
        )
    }
}

export default TeacherCard;