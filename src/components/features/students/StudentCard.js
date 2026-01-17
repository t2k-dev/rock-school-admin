import React from "react";
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Avatar } from "../../shared/Avatar";
import { HoverCard } from "../../shared/ui";

class StudentCard extends React.Component{

    render(){
        return(
                <HoverCard className="ms-col-2 mb-2">
                    <Card.Body>
                        <Row>
                            <Col md="1">
                                <Avatar style={{ width: "40px", height: "40px" }} />
                            </Col>
                            <Col as={Link} to={`/student/${this.props.item.studentId}`}>
                                <h3>{this.props.item.firstName} {this.props.item.lastName}</h3>
                            </Col>
                        </Row>
                    </Card.Body>
                </HoverCard>
        )
    }
}

export default StudentCard;