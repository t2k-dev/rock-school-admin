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
                        <NavDropdown.Item href="/teachers"><Link to="/teachers">Список преподавателей</Link></NavDropdown.Item>
                        <NavDropdown.Item href="/admin/registerTeacher"><Link to="/admin/registerTeacher">Новый преподаватель</Link></NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/bigCalendarTest"><Link to="/bigCalendarTest">Calendar Test</Link></NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Ученики" id="basic-nav-dropdown2">
                        <NavDropdown.Item href="/students"><Link to="/students">Список учеников</Link></NavDropdown.Item>
                        <NavDropdown.Item href="/admin/addSubscription"><Link to="/admin/addSubscription">Новый абонемент</Link></NavDropdown.Item>
                        <NavDropdown.Divider />
                    </NavDropdown>
                    <Nav.Item>
                        <Nav.Link href="/admin/registerStudent" eventKey="2" title="Item">Добавить пробное занятие</Nav.Link>
                    </Nav.Item>
                </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
    )
}

export default MyNavbar;