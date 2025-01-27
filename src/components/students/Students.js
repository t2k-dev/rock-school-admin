import React from "react";
import { getStudents } from "../../services/apiStudentService"
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import StudentCard from "./StudentCard";

class Students extends React.Component{
    state = {teachers: []}
    
    componentDidMount(){
        this.onFormLoad();
    }

    async onFormLoad(){
        const returnedTeachers = await getStudents();
        this.setState({teachers: returnedTeachers});
        console.log(this.state.teachers);
    }

    render(){

        return(
            <div 
                className="ui raised very padded text container segment"
                style={{marginTop:'80px'}}
            >
                <Row>
                    <Col md="8"><h3 className="ui header">Студенты</h3></Col>
                    <Col style={{textAlign:'right'}}>
                        <Link to="/admin/registerStudent"><Button variant="success">Добавить</Button></Link>
                    </Col>
                </Row>
                <Row style={{marginTop:'20px'}}>
                    <Col>
                        {this.state.teachers.map((item, index) => (
                            <StudentCard key={index}  item={item} />
                        ))}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Students;