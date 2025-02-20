import React from "react";
import { Form, Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { getStudent, addStudent } from "../../services/apiStudentService";
import { SexControl } from "../common/SexControl";


class StudentForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state= {
            isNew: props.type == 'New',
            email: "",
            firstName: "",
            lastName: "",
            birthDate: "",
            phone: 0,
            userId: 1,
            Level: 0,
        }
    
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleSave = (e) =>{
        e.preventDefault();

        const requestBody ={
            login: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            birthDate: this.state.birthDate,
            sex: this.state.sex,
            phone: parseInt(this.state.phone)
        }
        
        const response = addStudent(requestBody);
        alert(response => alert(response))
    }

    handleChange = (e) =>{
        const {id, value} = e.target
        this.setState({[id] : value})
    }

    handleSexChange = (isChecked) =>{
        this.setState({
            sex: isChecked,
        })
      }

    componentDidMount(){
        console.log("--")
        console.log(this.props.match)
        this.onFormLoad();
    }

    async onFormLoad(){
        if (this.state.isNew)
        {
            return;
        }

        const id = this.props.match.params.id;
        const student = await getStudent(id);
        
        console.log( student);

        this.setState({
            email: student.data.email,
            firstName: student.data.firstName,
            lastName: student.data.lastName,
            birthDate: student.data.birthDate,
            phone: student.data.phone,
        })

        console.log(this.state);
    }

    render(){
        const {email, firstName, lastName, birthDate, phone, level} = this.state;
        return(
            
            <Container style={{marginTop: "40px"}}>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                        <h2 style={{textAlign:"center"}}>{this.state.isNew?'Новый ученик':'Редактировать ученика'}</h2>
                        <Form>
                            <Form.Group className="mb-3" controlId="firstName">
                                <Form.Label>Имя</Form.Label>
                                <Form.Control onChange={this.handleChange} value={firstName} placeholder="введите имя..." autoComplete="off"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="lastName">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control onChange={this.handleChange} value={lastName} placeholder="введите фамилию..." />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="birthDate">
                                <Form.Label>Дата рождения</Form.Label>
                                <Form.Control onChange={this.handleChange} value={birthDate} placeholder="введите дату..." />
                            </Form.Group>

                            <SexControl onChange={this.handleSexChange}></SexControl>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control onChange={this.handleChange} value={email} placeholder="введите email..." autoComplete="off"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>Телефон</Form.Label>
                                <Form.Control onChange={this.handleChange} value={phone} placeholder="введите телефон..." />
                            </Form.Group>

                            <hr></hr>

                            <Form.Group className="mb-3" controlId="discipline">
                                <Form.Label>Уровень</Form.Label>
                                <Form.Select 
                                    aria-label="Веберите..."
                                    value={level}
                                    onChange={e => this.setState({ level: e.target.value })}
                                    >
                                    <option>выберите...</option>
                                    <option value="1">Начинающий</option>
                                    <option value="2">Продолжающий</option>
                                    <option value="3">Продвинутый</option>
                                </Form.Select>
                            </Form.Group>
                            
                            <hr></hr>
                            
                            <Button variant="primary" type="null" onClick={this.handleSave}>
                                Сохранить
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default StudentForm;