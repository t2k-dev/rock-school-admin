import React from "react";
import { Form, Container, Row, Col, Image, Button } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";

class RegisterStudent extends React.Component{
    constructor(props)
    {
        super(props);
        this.state= {
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
        axios.post('https://localhost:44358/api/account/registerStudent', requestBody)
            .then(alert(response => alert(response)));
        
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

    render(){
        return(
            <Container style={{marginTop: "40px"}}>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                        <h2 style={{textAlign:"center"}}>Новый студент</h2>
                        <Form>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите email..." autoComplete="off"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="firstName">
                                <Form.Label>Имя</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите имя..." autoComplete="off"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="lastName">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите фамилию..." />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="birthDate">
                                <Form.Label>Дата рождения</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите дату..." />
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
                                <Form.Label onClick={this.handleSave}>Телефон</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите телефон..." />
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

export default RegisterStudent;