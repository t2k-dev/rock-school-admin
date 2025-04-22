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
                    <NavDropdown title="Филиалы" id="basic-nav-dropdown-branches">
                        <NavDropdown.Item as={Link} to="/branchScreen/1">Школа на Абая</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/branchScreen/2">Школа на Аль-Фараби</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Преподаватели" id="basic-nav-dropdown-teachers">
                        <NavDropdown.Item as={Link} to="/teachers">Список преподавателей</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/registerTeacher">Новый преподаватель</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Ученики" id="basic-nav-dropdown-students">
                        <NavDropdown.Item as={Link} to="/students">Список учеников</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/student/new">Новый ученик</NavDropdown.Item>
                        <NavDropdown.Divider />
                    </NavDropdown>
                    <NavDropdown title="Абонементы" id="basic-nav-dropdown-subscriptions">
                        <NavDropdown.Item as={Link} to="/teachers">Список абонементов</NavDropdown.Item>
                        <Nav.Link as={Link} to="/admin/addTrial" eventKey="2">
                            Добавить пробное занятие
                        </Nav.Link>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
    )
}

export default MyNavbar;