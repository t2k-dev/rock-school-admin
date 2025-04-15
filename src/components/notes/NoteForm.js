import React from "react";
import { Form, Container, Row, Col, Button } from 'react-bootstrap';

import { addNote } from '../../services/apiNoteService'

class NoteForm extends React.Component{
    constructor(props)
    {
        super(props);
        this.state= {
            description: "",
            completeDate: "",
        }
    
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) =>{
        const {id, value} = e.target
        this.setState({[id] : value})
    }

    handleSave = (e) =>{
        e.preventDefault();

        const requestBody ={
            description: this.state.description,
            completeDate: this.state.completeDate,
            branchId: 1 //DEV
        }
        const response = addNote(requestBody);
        this.props.history.push('/home');
    }

    render(){
        const {description, completeDate} = this.state;
        return(<Container style={{marginTop: "40px"}}>
            <Row>
                <Col md="4"></Col>
                <Col md="4">
                    <h2 style={{textAlign:"center"}}>Новая заметка</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control onChange={this.handleChange} value={description} placeholder="введите текст..." autoComplete="off"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="completeDate">
                            <Form.Label>Дата</Form.Label>
                            <Form.Control onChange={this.handleChange} value={completeDate} placeholder="гггг-мм-дд" autoComplete="off"/>
                        </Form.Group>

                        <hr></hr>
                        <Button variant="primary" type="null" onClick={this.handleSave}>
                            Сохранить
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>)
    }
}

export default NoteForm;
