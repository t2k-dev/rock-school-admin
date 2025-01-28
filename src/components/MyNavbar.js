import React from "react";
import { Navbar,NavDropdown, Nav, Container, } from 'react-bootstrap';
import { Link } from "react-router-dom";

const MyNavbar = () =>{
    return(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/home">RockSchool</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title="Преподаватели" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/teacher/1"><Link to="/teacher/1">Преподаватель</Link></NavDropdown.Item>
                        <NavDropdown.Item href="/teachers"><Link to="/teachers">Список преподавателей</Link></NavDropdown.Item>
                        <NavDropdown.Item href="/admin/registerTeacher"><Link to="/admin/registerTeacher">Новый преподаватель</Link></NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Ученики" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/student/1"><Link to="/student/1">Ученик</Link></NavDropdown.Item>
                        <NavDropdown.Item href="/students"><Link to="/students">Список учеников</Link></NavDropdown.Item>
                        <NavDropdown.Item href="/admin/registerStudent"><Link to="/admin/registerStudent">Новый ученик</Link></NavDropdown.Item>
                        <NavDropdown.Item href="/admin/addSubscription"><Link to="/admin/addSubscription">Новый абонемент</Link></NavDropdown.Item>
                        <NavDropdown.Divider />
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
    )
}

export default MyNavbar;