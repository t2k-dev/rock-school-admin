import React from "react";
import { Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { HoverCard } from "../../components/ui";
import { getDisciplineName } from "../../constants/disciplines";
import { DisciplineIcon } from "../disciplines/DisciplineIcon";

class TeacherCard extends React.Component{

    render(){
        return(
                <HoverCard className="ms-col-2 mb-2">
                        <Row>
                            <Col md="2">
                                <Avatar style={{ width: "70px", height: "70px" }} />
                            </Col>
                            <Col as={Link} to={`/teacher/${this.props.item.teacherId}`} md="10">
                                <div className="mt-2">
                                        <h3>{this.props.item.firstName} {this.props.item.lastName}</h3>
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
                </HoverCard>
        )
    }
}

export default TeacherCard;