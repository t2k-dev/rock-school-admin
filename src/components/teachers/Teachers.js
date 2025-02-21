import React from "react";
import { getTeachers } from "../../services/apiTeacherService"
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import TeacherCard from "./TeacherCard";


class Teachers extends React.Component{
    state = {teachers: []}
    
    componentDidMount(){
        this.onFormLoad();
    }

    async onFormLoad(){
        const returnedTeachers = await getTeachers();
        this.setState({teachers: returnedTeachers});
        console.log(this.state.teachers);
    }

    render(){
        let teachersList;
        if (this.state.teachers){
            teachersList = this.state.teachers.map((item, index) => (
                <TeacherCard key={index}  item={item} />
            ));
        }
        else{
            teachersList = <Col>Нет записей</Col>
        }

        return(
            <div 
                className="ui raised very padded text container segment"
                style={{marginTop:'80px'}}
            >
                <Row>
                    <Col md="8"><h3 className="ui header">Преподаватели</h3></Col>
                    <Col style={{textAlign:'right'}}>
                        <Link to="/admin/registerTeacher"><Button variant="success">Добавить</Button></Link>
                    </Col>
                </Row>
                <Row style={{marginTop:'20px'}}>
                    <Col>
                        {teachersList}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Teachers;