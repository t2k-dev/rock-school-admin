import React from "react";
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import axios from "axios";
import { useParams } from 'react-router-dom';

class TeachersForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state= {
            firstName: "",
            lastName: "",
            middleName: "",
            birthDate: "",
            userId: 1,
            isDrums: false,
            isGuitar: false,
            isVocal: false
        }
    
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    componentDidMount = () =>{
        const { id } = useParams();
        console.log("--")
        console.log(id)
    }

    handleSave = (e) =>{
        let disciplines = [];
        if (this.state.isDrums)
            disciplines.push(1)
        if (this.state.isGuitar)
            disciplines.push(3)
        if (this.state.isVocal)
            disciplines.push(4)

            
        const requestBody ={
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            middleName: this.state.middleName,
            birthDate: this.state.birthDate,
            userId: this.state.userId,
            disciplines: disciplines
        }
        console.log(requestBody);
        axios.post('https://localhost:44358/api/teacher', requestBody)
            .then(alert(response => alert(response)));
        
    }

    handleChange = e =>{
        const {id, value} = e.target
        this.setState({[id] : value})
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                        <Form>
                            <Form.Group className="mb-3" controlId="firstName">
                                <Form.Label>Имя</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите имя..." autoComplete="off"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="lastName">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите фамилию..." />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="middleName">
                                <Form.Label>Отчество</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите отчество..." />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="birthDate">
                                <Form.Label>Дата рождения</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите дату..." />
                            </Form.Group>                            

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label onClick={this.handleSave}>Телефон</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите телефон..." />
                            </Form.Group>

                            <hr></hr>
                            <Form.Group className="mb-3">
                                Дисциплины
                                <Form.Check 
                                    style={{marginTop:"20px"}}
                                    type="checkbox"
                                    id="isDrums"
                                    label="Барабаны"
                                    onChange={this.handleChange}
                                />
                                <Form.Check 
                                    style={{marginTop:"20px"}}
                                    type="checkbox"
                                    id="isGuitar"
                                    label="Гитара"
                                    onChange={this.handleChange}
                                />
                                <Form.Check 
                                    style={{marginTop:"20px"}}
                                    type="checkbox"
                                    id="isVocal"
                                    label="Вокал"
                                    onChange={this.handleChange}
                                />

                            </Form.Group>

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

export default TeachersForm;