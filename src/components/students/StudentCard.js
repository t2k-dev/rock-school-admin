import React from "react";
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import noImage from '../../images/user.jpg';
import { Link } from "react-router-dom";

class StudentCard extends React.Component{

    render(){
        return(
                <Card className="ms-col-2 mb-2">
                    <Card.Body>
                        <Row>
                            <Col md="2">
                            <Image src={noImage} className='img-preview' fluid='true'/>
                            </Col>
                            <Col>
                            <Link to={`/student/${this.props.item.studentId}`} ><h3>{this.props.item.firstName} {this.props.item.lastName}</h3></Link>
                                <div>
                                    Дисциплины
                                    <ul>
                                        {
                                            /*this.props.item.disciplines.map((item, index) => {
                                                return(<li key={index}>{item.disciplineName}</li>)
                                        })*/
                                        }
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
        )
    }
}

export default StudentCard;