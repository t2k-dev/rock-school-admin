import React from "react";
import { Form, Container, Row, Col, Image, Button } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import { getStudent, registerStudent } from "../../services/apiStudentService";

class RegisterStudent extends React.Component{
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
        }
    
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSexClick = this.handleSexClick.bind(this);
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
        console.log(requestBody);
        const response = registerStudent(requestBody);
        alert(response => alert(response))
        
    }

    handleChange = (e) =>{
        const {id, value} = e.target
        this.setState({[id] : value})
    }

    handleSexClick = (e) =>{
        const {id} = e.target
        if (e.target.id === 'rb_male')
            this.setState({sex: 1})

        if (e.target.id === 'rb_female')
            this.setState({sex: 2})
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
        const {email, firstName, lastName, birthDate, phone} = this.state;
        return(
            
            <Container style={{marginTop: "40px"}}>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                        <h2 style={{textAlign:"center"}}>{this.state.isNew?'Новый ученик':'Редактировать ученика'}</h2>
                        <Form>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control onChange={this.handleChange} value={email} placeholder="введите email..." autoComplete="off"/>
                            </Form.Group>

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
                            
                            <Form.Group className="mb-3" controlId="sex">
                                <Form.Label>Пол</Form.Label>
                                <div className="mb-3">
                                    <Form.Check
                                        inline
                                        label="Мужской"
                                        name="group1"
                                        type="radio"
                                        id="rb_male"
                                        onChange={this.handleSexClick}
                                    />
                                    <Form.Check
                                        inline
                                        label="Женский"
                                        name="group1"
                                        type="radio"
                                        id="rb_female"
                                        onChange={this.handleSexClick}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>Телефон</Form.Label>
                                <Form.Control onChange={this.handleChange} value={phone} placeholder="введите телефон..." />
                            </Form.Group>

                            <hr></hr>

                            <Button variant="primary" type="null" onClick={this.handleSave}>
                                Сохранить
                            </Button>
                            <hr></hr>

                            <Button variant="info" type="null" onClick={this.handleSave}>
                                <Link to="/admin/addSubscription">Добавить абонемент</Link>
                            </Button>

                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default RegisterStudent;