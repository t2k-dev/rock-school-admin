import React from "react";
import { Form, Row, Col, Button, Container } from 'react-bootstrap';

class TeachersForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state= {
            firstName: "",
            lastName: "",
            middleName: "",
            birthDate: "2000-01-01",
            userId: 1,
            disciplines:[]
        }
    
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleSave = () =>{
        console.log(this.state);
    }

    handleChange = e =>{
        const {id, value} = e.target
        this.setState({[id] : value})
    }
    /*
    {
    "firstName": "Сергей",
    "lastName": "Каргаполов",
    "middleName": "Middle",
    "birthDate": "2000-01-01",
    "userId": 1,
    "disciplines":[1]
}
    */
    
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

                            <Form.Group className="mb-3" controlId="middleName">
                                <Form.Label>Дата рождения</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите дату..." />
                            </Form.Group>                            

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label onClick={this.handleSave}>Телефон</Form.Label>
                                <Form.Control onChange={this.handleChange} placeholder="введите телефон..." />
                            </Form.Group>
                            
                            <Form.Group className="mb-3" controlId="isActive">
                                <Form.Check 
                                    type="switch"
                                    id="custom-switch"
                                    label="Активный"
                                />
                            </Form.Group>
                            <hr></hr>
                            <Form.Group className="mb-3" controlId="phone">
                                Дисциплины
                                <Form.Check 
                                    style={{marginTop:"20px"}}
                                    type="checkbox"
                                    id="drums"
                                    label="Барабаны"
                                />
                                <Form.Check 
                                    style={{marginTop:"20px"}}
                                    type="checkbox"
                                    id="guitar"
                                    label="Гитара"
                                />
                                <Form.Check 
                                    style={{marginTop:"20px"}}
                                    type="checkbox"
                                    id="vocal"
                                    label="Вокал"
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