import React from "react";
import { Form, Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { getStudent, registerStudent } from "../../services/apiStudentService";
import { SexControl } from "../common/SexControl";


class NewStudentForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state= {
            firstName: "",
            birthDate: "",
            sex: 0,
            phone: 0,
            Level: 0,
            branchId: 0,
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
        console.log(requestBody)
        //const response = registerStudent(requestBody);
        this.props.history.push('/student/1');
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
    }


    render(){
        const {email, firstName, lastName, birthDate, phone, level} = this.state;
        return(
            
            <Container style={{marginTop: "40px"}}>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                        <h2 style={{textAlign:"center"}}>Новый ученик</h2>
                        <Form>
                            <Form.Group className="mb-3" controlId="firstName">
                                <Form.Label>Имя</Form.Label>
                                <Form.Control onChange={this.handleChange} value={firstName} placeholder="введите имя..." autoComplete="off"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="birthDate">
                                <Form.Label>Дата рождения</Form.Label>
                                <Form.Control onChange={this.handleChange} value={birthDate} placeholder="введите дату..." />
                            </Form.Group>

                            <SexControl onChange={this.handleSexChange}></SexControl>

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>Телефон</Form.Label>
                                <Form.Control onChange={this.handleChange} value={phone} placeholder="введите телефон..." />
                            </Form.Group>

                            <hr></hr>

                            <Form.Group className="mb-3" controlId="level">
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

                            <Form.Group className="mb-3" controlId="branchId">
                                <Form.Label>Филиал</Form.Label>
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

export default NewStudentForm;