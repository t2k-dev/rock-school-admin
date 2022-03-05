import React from "react";
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import noImage from '../images/user.jpg';

class TeacherCard extends React.Component{

    render(){
        return(
            <div class="ms-col-2">
                <Card>
                    <Card.Body>
                        <Row>
                            <Col md="2">
                            <Image src={noImage} className='img-preview' fluid='true'/>
                            </Col>
                            <Col>
                                <h3 key={this.props.teacherId}>{this.props.firstName} {this.props.lastName}</h3>
                                <p>
                                    Дисциплины
                                    <ul>
                                        <li>Гитара</li>
                                        <li>Барабаны</li>
                                    </ul>
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{textAlign:'right'}}>
                                <Button variant="primary">Редактировать</Button>
                            </Col>
                        </Row>
                        
                    </Card.Body>
                </Card>
                
            </div>
        )
    }
}

export default TeacherCard;