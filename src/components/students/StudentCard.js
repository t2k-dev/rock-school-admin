import React from "react";
import { Card, Col, Image, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import noImage from '../../images/user.jpg';

class StudentCard extends React.Component{

    render(){
        return(
                <Card className="ms-col-2 mb-2">
                    <Card.Body>
                        <Row>
                            <Col md="1">
                                <Image src={noImage} className='img-preview' fluid='true'/>
                            </Col>
                            <Col as={Link} to={`/student/${this.props.item.studentId}`}>
                                <h3>{this.props.item.firstName} {this.props.item.lastName}</h3>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
        )
    }
}

export default StudentCard;