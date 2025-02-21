import React from "react";
import { Form, Container, Row, Col, Image, Button } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";

class SubscriptionForm extends React.Component{
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

            generatedSchedule: "",
        }
        this.generateSchedule = this.generateSchedule.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSexClick = this.handleSexClick.bind(this);
    }
    
    generateSchedule = (e) =>{
        this.setState({generatedSchedule:"Сергей: Пн: 13:00 - 18:00 \nСергей: Ср: 13:00 - 18:00"});
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
        //axios.post('https://localhost:44358/api/account/registerStudent', requestBody)
            //.then(alert(response => alert(response)));
        
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
        const {generatedSchedule} = this.state
        return(
            <Container style={{marginTop: "40px"}}>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                        <h2 style={{textAlign:"center"}}>Новый абонемент</h2>
                        <Form>
                            <Form.Group className="mb-3" controlId="discipline">
                                <Form.Label>Предмет</Form.Label>
                                <Form.Select 
                                    aria-label="Веберите..."
                                    value={this.state.periodDay}
                                    onChange={e => this.setState({ discipline: e.target.value })}
                                    >
                                    <option>выберите...</option>
                                    <option value="1">Гитара</option>
                                    <option value="2">Электро гитара</option>
                                    <option value="3">Бас гитара</option>
                                    <option value="4">Укулеле</option>
                                    <option value="5">Вокал</option>
                                    <option value="6">Ударные</option>
                                    <option value="7">Фортепиано</option>
                                    <option value="8">Скрипка</option>
                                    <option value="9">Экстрим вокал</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="GenerteSchedule">
                                <Form.Label>Расписание</Form.Label>
                                <Form.Control as="textarea" value={generatedSchedule} onChange={this.handleChange} placeholder="" />
                                <Form.Label onClick={this.generateSchedule} style={{marginTop:"20px", color:"green"}}>
                                    Сгенерировать
                                </Form.Label>
                            </Form.Group>
                            <hr></hr>
                            <Form.Group className="mb-3" controlId="Teacher">
                                <Form.Label>Преподаватель</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="" />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="Schedule">
                                <Form.Label>Расписание</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="" />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="Subscription">
                                <Form.Label>Абонемент (кол-во занятий)</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="" />
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

export default SubscriptionForm;