import React from "react";
import { Form, Container, Row, Col, Table, Button } from 'react-bootstrap';
import axios from "axios";
import { Link } from "react-router-dom";

export class RegisterTeacher extends React.Component{
    constructor(props)
    {
        super(props);
        
        console.log(props);
        this.state= {
            isNew: props.type == 'New',

            email: "",
            firstName: "",
            lastName: "",
            middleName: "",
            birthDate: "",
            phone: 0,
            userId: 1,
            WorkingPeriods:[],
            disciplines:[],

            periodDay: 0,
            periodStart: "",
            periodEnd: "",
            isViolin: false,
            isGuitar: false,
            isElectricGuitar: false, 
            isBassGuitar: false, 
            isUkulele: false, 
            isDrums: false, 
            isVocal: false, 
            isFortepiano: false, 
            isViolin: false
        }
    
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSexClick = this.handleSexClick.bind(this);
        this.getDayName = this.getDayName.bind(this);
        this.getValueOrEmptyString = this.getValueOrEmptyString.bind(this);
        this.addWorkingPeriod = this.addWorkingPeriod.bind(this);
        this.deleteWorkingPeriod = this.deleteWorkingPeriod.bind(this);
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

        const response = await axios("https://localhost:44358/api/teacher/"+id);
        console.log(response.data.disciplines.includes(8));
        this.setState({
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            middleName: this.getValueOrEmptyString(response.data.middleName),
            birthDate: response.data.birthDate,
            phone: response.data.phone,

            isGuitar: response.data.disciplines.includes(1),
            isElectricGuitar: response.data.disciplines.includes(2),
            isBassGuitar: response.data.disciplines.includes(3),
            isUkulele: response.data.disciplines.includes(4),
            isVocal: response.data.disciplines.includes(5),
            isDrums: response.data.disciplines.includes(6),
            isFortepiano: response.data.disciplines.includes(7),
            isViolin: response.data.disciplines.includes(8),
            WorkingPeriods: response.data.workingHours.workingPeriods,
        })
        console.log('Working')
        console.log(this.state);
        const periods = response.data.workingHours.workingPeriods;
        
        //this.setState({teachers: response.data})
    }

    getValueOrEmptyString = (str) =>{
        if (typeof str !== 'undefined' && str){
            return str;
        }

        return '';
    }

    handleSave = (e) =>{
        e.preventDefault();

        let disciplines = [];
        if (this.state.isGuitar)
            disciplines.push(1)
        if (this.state.isElectricGuitar)
            disciplines.push(2)
        if (this.state.isBassGuitar)
            disciplines.push(3)
        if (this.state.isUkulele)
            disciplines.push(4)
        if (this.state.isVocal)
            disciplines.push(5)
        if (this.state.isDrums)
            disciplines.push(6)
        if (this.state.isFortepiano)
            disciplines.push(7)
        if (this.state.isViolin)
            disciplines.push(8)

        const requestBody ={
            login: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            middleName: this.state.middleName,
            birthDate: this.state.birthDate,
            phone: parseInt(this.state.phone),
            disciplines: disciplines,
            workingHours:{
                workingPeriods: this.state.WorkingPeriods,
                breaks: null
            }
        }

        console.log(requestBody);
        if (this.state.isNew){
            axios.post('https://localhost:44358/api/account/registerTeacher', requestBody)
            .then(alert(response => alert(response)));
        }
        else{
            console.log('Not implemented');
        }
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

    addWorkingPeriod = () =>{
        console.log(this.state.periodDay);
        console.log(this.state);

        this.setState(prevState => ({
            WorkingPeriods: [
                ...prevState.WorkingPeriods, 
                {
                    day: parseInt(this.state.periodDay),
                    startTime: this.state.periodStart,
                    endTime: this.state.periodEnd
                }]
          }))
    }

    deleteWorkingPeriod = (itemIndex) => {
        this.setState(
            {
                WorkingPeriods: this.state.WorkingPeriods.filter(function(workingPeriod, index) { 
                    return index !== itemIndex
        })});
    }

    getDayName = (dayIndex) =>{
        switch (dayIndex){
            case 1:
                return "Понедельник";
            case 2:
                return "Вторник";
            case 3:
                return "Среда";
            case 4:
                return "Четверг";
            case 5:
                return "Пятница";
            case 6:
                return "Суббота";
            case 7:
                return "Воскресенье";
        }
        
    }

    render(){
        const {email, firstName, lastName, middleName, birthDate, phone, isGuitar, isElectricGuitar, isBassGuitar, isUkulele, isDrums, isVocal, isFortepiano, isViolin} = this.state;
        return(
            <Container style={{marginTop: "40px"}}>
                <Row>
                    <Col md="4"></Col>
                    <Col md="4">
                        <h2 style={{textAlign:"center"}}>{this.state.isNew?'Новый преподаватель':'Редактировать преподавателя'}</h2>
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
                                <Form.Control onChange={this.handleChange} value={lastName} placeholder="введите фамилию..."/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="middleName">
                                <Form.Label>Отчество</Form.Label>
                                <Form.Control onChange={this.handleChange} value={middleName} placeholder="введите отчество..." />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="birthDate">
                                <Form.Label>Дата рождения</Form.Label>
                                <Form.Control onChange={this.handleChange} value={birthDate} placeholder="введите дату..." />
                            </Form.Group>
                            
                            <Form.Group className="mb-3" controlId="phone">
                                <Form.Label onClick={this.handleSave}>Телефон</Form.Label>
                                <Form.Control onChange={this.handleChange} value={phone} placeholder="введите телефон..." />
                            </Form.Group>
                            
                            <hr></hr>

                            <Form.Group className="mb-3">
                                <b>Дисциплины</b>
                                <Row>
                                    <Col>
                                        <Form.Check 
                                            style={{marginTop:"20px"}}
                                            type="checkbox"
                                            id="isGuitar"
                                            label="Гитара"
                                            onChange={this.handleChange}
                                            checked={isGuitar}
                                        />
                                        <Form.Check 
                                            style={{marginTop:"20px"}}
                                            type="checkbox"
                                            id="isElectricGuitar"
                                            label="Электрогитара"
                                            onChange={this.handleChange}
                                            checked={isElectricGuitar}
                                        />
                                        <Form.Check 
                                            style={{marginTop:"20px"}}
                                            type="checkbox"
                                            id="isBassGuitar"
                                            label="Бас-гитара"
                                            onChange={this.handleChange}
                                            checked={isBassGuitar}
                                        />
                                        <Form.Check 
                                            style={{marginTop:"20px"}}
                                            type="checkbox"
                                            id="isUkulele"
                                            label="Укулеле"
                                            onChange={this.handleChange}
                                            checked={isUkulele}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Check 
                                            style={{marginTop:"20px"}}
                                            type="checkbox"
                                            id="isVocal"
                                            label="Вокал"
                                            onChange={this.handleChange}
                                            checked={isVocal}
                                        />
                                        <Form.Check 
                                            style={{marginTop:"20px"}}
                                            type="checkbox"
                                            id="isDrums"
                                            label="Ударные"
                                            onChange={this.handleChange}
                                            checked={isDrums}
                                        />
                                        <Form.Check 
                                            style={{marginTop:"20px"}}
                                            type="checkbox"
                                            id="isFortepiano"
                                            label="Фортепиано"
                                            onChange={this.handleChange}
                                            checked={isFortepiano}
                                        />
                                        <Form.Check 
                                            style={{marginTop:"20px"}}
                                            type="checkbox"
                                            id="isViolin"
                                            label="Скрипка"
                                            onChange={this.handleChange}
                                            checked={isViolin}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <hr></hr>
                            <Form.Group className="mb-3">
                                <b>Расписание</b>
                                <Row style={{marginTop:"20px"}}>
                                    <Col md="5">
                                        <Form.Select 
                                            aria-label="Веберите день..."
                                            value={this.state.periodDay}
                                            onChange={e => this.setState({ periodDay: e.target.value })}
                                            >
                                            <option>День недели...</option>
                                            <option value="1">Понедельник</option>
                                            <option value="2">Вторник</option>
                                            <option value="3">Среда</option>
                                            <option value="4">Четверг</option>
                                            <option value="5">Пятница</option>
                                            <option value="6">Суббота</option>
                                            <option value="7">Воскресенье</option>
                                        </Form.Select>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Form.Label column md={1}>с</Form.Label>
                                            <Col md={4}>
                                                <Form.Control 
                                                    placeholder="чч:мм" 
                                                    value={this.state.periodStart}
                                                    onChange={e => this.setState({ periodStart: e.target.value })}
                                                    /> 
                                            </Col>
                                            
                                            <Form.Label column md={1}>по</Form.Label>
                                            <Col md={4}>
                                                <Form.Control 
                                                    placeholder="чч:мм" 
                                                    value={this.state.periodEnd}
                                                    onChange={e => this.setState({ periodEnd: e.target.value })}
                                                    />
                                            </Col>
                                            <Col md={2}>
                                                <Button onClick={this.addWorkingPeriod}>
                                                    <i>+</i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Table striped bordered hover style={{marginTop:"20px"}}>
                                        <thead>
                                            <tr>
                                            <th>#</th>
                                            <th>День</th>
                                            <th>С</th>
                                            <th>До</th>
                                            <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.WorkingPeriods.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{this.getDayName(item.day)}</td>
                                                    <td>{item.startTime}</td>
                                                    <td>{item.endTime}</td>
                                                    <td>
                                                        <Button onClick={()=> this.deleteWorkingPeriod(index)}>
                                                            <i>-</i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                </Row>
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