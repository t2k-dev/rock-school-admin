import React from "react";
import { getStudents } from "../../services/apiStudentService"
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

import StudentCard from "./StudentCard";

class Students extends React.Component{
    state = {students: []}
    
    componentDidMount(){
        this.onFormLoad();
    }

    async onFormLoad(){
        const returnedStudents = await getStudents();
        this.setState({students: returnedStudents});
        console.log(this.state.students);
    }

    render(){
        let studentsList;
        if (this.state.students){
            studentsList = this.state.students.map((item, index) => (
                <StudentCard key={index}  item={item} />
            ));
        }
        else{
            studentsList = <Col>Нет записей</Col>
        }

        return(
            <div className="ui raised very padded text container segment" style={{marginTop:'80px'}}>
                <Row>
                    <Col md="8"><h3 className="ui header">Студенты</h3></Col>
                    <Col style={{textAlign:'right'}}>
                        <Link to="/student/new"><Button variant="outline-success">+ Новый ученик</Button></Link>
                    </Col>
                </Row>
                <Row style={{marginTop:'20px'}}>
                    <Col>
                        {studentsList}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Students;