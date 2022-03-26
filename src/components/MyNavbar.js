import React from "react";
import { Navbar,NavDropdown, Nav, Container, Card, ListGroup, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const MyNavbar = () =>{
    return(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">RockSchool</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <NavDropdown title="Администратор" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1"><Link to="/admin/registerStudent">Новый ученик</Link></NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.1"><Link to="/teachers">Список преподавателей</Link></NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2"><Link to="/admin/registerTeacher">Новый преподаватель</Link></NavDropdown.Item>

                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
    )
}

export default MyNavbar;