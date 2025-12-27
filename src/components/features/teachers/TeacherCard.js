import React from "react";
import { Card, Col, Image, Row, Stack } from 'react-bootstrap';
import { Link } from "react-router-dom";
import noImage from '../../../images/user.jpg';
import { DisciplineIcon } from "../../shared/discipline/DisciplineIcon";

import { getDisciplineName } from "../../../constants/disciplines";

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
                                <Link to={`/teacher/${this.props.item.teacherId}`} >
                                    <h3>{this.props.item.firstName} {this.props.item.lastName} {this.props.item.isActive ? "" : "(Отключен)"}</h3>
                                </Link>
                                <div>
                                    <Stack gap={0} className="mt-2">
                                        {
                                            this.props.item.disciplines.map((item, index) => {
                                                return(
                                                <div key={index}>
                                                    <DisciplineIcon disciplineId={item.disciplineId} />
                                                    <span style={{marginLeft:"10px"}}>{getDisciplineName(item.disciplineId)}</span>
                                                </div>)
                                        })}
                                    </Stack>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
        )
    }
}

export default TeacherCard;