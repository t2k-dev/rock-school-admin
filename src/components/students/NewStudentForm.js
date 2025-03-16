import React from "react";
import { Form, Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";
import { addStudent } from "../../services/apiStudentService";
import { SexControl } from "../common/SexControl";
import InputMask from "react-input-mask";

class NewStudentForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state= {
            firstName: "",
            age: "",
            sex: 1,
            phone: "",
            Level: 0,
            branchId: 0,
        }
    
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleSave = async (e) =>{
        e.preventDefault();

        const requestBody ={
            firstName: this.state.firstName,
            age: this.state.age,
            sex: this.state.sex,
            phone: this.state.phone.replace('+7 ', '').replace(/\s/g, ''),
            level: this.state.level,
            branchId: this.state.branchId,
        }

        const response = await addStudent(requestBody)
        const newStudentId = response.data;

        this.props.history.push('/student/'+ newStudentId);
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

    render(){
        const {firstName, branchId, age, phone, level, sex} = this.state;
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

                            <Form.Group className="mb-3" controlId="age">
                                <Form.Label>Возраст</Form.Label>
                                <Form.Control as={InputMask} mask="999" maskChar=" " onChange={this.handleChange} value={age} placeholder="введите число..." />
                            </Form.Group>

                            <SexControl value={sex} onChange={this.handleSexChange}></SexControl>

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>Телефон</Form.Label>
                                <Form.Control as={InputMask} mask="+7 999 999 99 99" maskChar=" " onChange={this.handleChange} value={phone} placeholder="введите телефон..." />
                            </Form.Group>

                            <hr></hr>

                            <Form.Group className="mb-3" controlId="level">
                                <Form.Label>Уровень</Form.Label>
                                <Form.Select 
                                    aria-label="Веберите..."
                                    value={level}
                                    onChange={e => this.setState({ level: e.target.value })}
                                    >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="branchId">
                                <Form.Label>Филиал</Form.Label>
                                <Form.Select 
                                    aria-label="Веберите..."
                                    value={branchId}
                                    onChange={e => this.setState({ branchId: e.target.value })}
                                    >
                                    <option>выберите...</option>
                                    <option value="1">На Абая</option>
                                    <option value="2">На Аль-Фараби</option>
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