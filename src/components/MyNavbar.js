import React from "react";
import { Navbar,NavDropdown, Nav, Container, } from 'react-bootstrap';
import { Link } from "react-router-dom";

const MyNavbar = () =>{
    return(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/home">RockSchool</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title="Преподаватели" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/teachers">Список преподавателей</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/registerTeacher">Новый преподаватель</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/bigCalendarTest">Calendar Test</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Ученики" id="basic-nav-dropdown2">
                        <NavDropdown.Item as={Link} to="/students">Список учеников</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/addSubscription">Новый абонемент</NavDropdown.Item>
                        <NavDropdown.Divider />
                    </NavDropdown>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/admin/addTrial" eventKey="2">
                            Добавить пробное занятие
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
    )
}

export default MyNavbar;