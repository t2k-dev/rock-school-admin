import React from "react";
import axios from "axios";
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import TeacherCard from "./TeacherCard";


class Teachers extends React.Component{
    state = {teachers: []}
    
    componentDidMount(){
        this.onFormLoad();
    }

    async onFormLoad(){
        const response = await axios("https://localhost:44358/api/teacher");
        this.setState({teachers: response.data})
        console.log(this.state.teachers);
    }

    render(){

        return(
            <div 
                className="ui raised very padded text container segment"
                style={{marginTop:'80px'}}
            >
                <Row>
                    <Col md="8"><h3 className="ui header">Преподаватели</h3></Col>
                    <Col style={{textAlign:'right'}}>
                        <Link to="/teachers/add"><Button variant="success">Добавить</Button></Link>
                    </Col>
                </Row>
                <Row style={{marginTop:'20px'}}>
                    <Col>
                        {this.state.teachers.map(({ firstName, lastName, teacherId }) => (
                            <TeacherCard key={teacherId} teacherId={teacherId} firstName={firstName} lastName={lastName} />
                        ))}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Teachers;