import React from "react";
import { Form, Container, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import InputMask from "react-input-mask";
import { getStudent, saveStudent } from "../../services/apiStudentService";
import { SexControl } from "../common/SexControl";


class StudentForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state= {
            email: "",
            firstName: "",
            lastName: "",
            birthDate: "",
            phone: 0,
            userId: "",
            level: 0,
            sex: 1,
            studentId: ""
        }
    
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        this.onFormLoad();
    }

    async onFormLoad(){
        const id = this.props.match.params.id;
        const student = await getStudent(id);
        
        this.setState({
            studentId: id,
            email: student.data.email,
            firstName: student.data.firstName,
            lastName: student.data.lastName,
            birthDate: student.data.birthDate,
            phone: "7" + student.data.phone,
            sex: student.data.sex,
            level: student.data.level,
        })

        console.log(this.state);
    }

    handleSave = async (e) =>{
        e.preventDefault();

        const requestBody ={
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            birthDate: this.state.birthDate,
            sex: this.state.sex,
            phone: this.state.phone.replace('+7 ', '').replace(/\s/g, ''),
            level: this.state.level,
        }
        console.log(requestBody);
        const response = await saveStudent(this.state.studentId, requestBody);

        this.props.history.goBack();
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
        const {email, firstName, lastName, birthDate, phone, level, sex} = this.state;
        return(
            
            <Container style={{marginTop: "40px"}}>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                        <h2 style={{textAlign:"center"}}>Редактировать ученика</h2>
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
                                <Form.Control as={InputMask} mask="9999-99-99" maskChar=" " onChange={this.handleChange} value={birthDate} placeholder="введите дату..." />
                            </Form.Group>

                            <SexControl value={sex} onChange={this.handleSexChange}></SexControl>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control onChange={this.handleChange} value={email} placeholder="введите email..." autoComplete="off"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label>Телефон</Form.Label>
                                <Form.Control as={InputMask} mask="+7 999 999 99 99" maskChar=" " onChange={this.handleChange} value={phone} placeholder="введите телефон..." />
                            </Form.Group>

                            <hr></hr>

                            <Form.Group className="mb-3" controlId="level">
                                <Form.Label>Уровень</Form.Label>
                                <Form.Select 
                                    name="level"
                                    aria-label="Веберите..."
                                    value={level}
                                    onChange={e => this.setState({ level: e.target.value })}
                                    >
                                    <option>выберите...</option>
                                    <option value="0">Начинающий</option>
                                    <option value="1">Продолжающий</option>
                                    <option value="2">Продвинутый</option>
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