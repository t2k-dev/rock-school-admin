import React from "react";
import { Card, Col, Image, Row } from 'react-bootstrap';
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
                                <div className="mt-2">
                                    <Link to={`/teacher/${this.props.item.teacherId}`} >
                                        <h3>{this.props.item.firstName} {this.props.item.lastName} {this.props.item.isActive ? "" : "(Отключен)"}</h3>
                                    </Link>
                                </div>
                                <div>
                                    <Row className="mt-3" style={{width:"400px"}}>
                                        {(() => {
                                            const disciplines = this.props.item.disciplines;
                                            const columns = [];
                                            const itemsPerColumn = 2;
                                            
                                            for (let i = 0; i < disciplines.length; i += itemsPerColumn) {
                                                const columnItems = disciplines.slice(i, i + itemsPerColumn);
                                                columns.push(
                                                    <Col key={`col-${i}`} xs={6}>
                                                        {columnItems.map((item, index) => (
                                                            <div key={i + index} className="mb-1">
                                                                <div className="d-flex align-items-center">
                                                                    <DisciplineIcon disciplineId={item.disciplineId} />
                                                                    <span style={{marginLeft:"10px"}} className="text-nowrap">{getDisciplineName(item.disciplineId)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </Col>
                                                );
                                            }
                                            return columns;
                                        })()}
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
        )
    }
}

export default TeacherCard;