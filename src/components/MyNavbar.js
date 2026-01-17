import { Container, Nav, Navbar, NavDropdown, } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Avatar } from './shared/Avatar';

const MyNavbar = () =>{
    return(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home" as={Link} to="/home">RockSchool</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">

                    <NavDropdown title="Филиалы" id="basic-nav-dropdown-branches">
                        <NavDropdown.Item as={Link} to="/branchScreen/1">Школа на Абая</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/branchScreen/2">Школа на Аль-Фараби</NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link as={Link} to="/teachers">Преподаватели</Nav.Link>
                    <Nav.Link as={Link} to="/students">Ученики</Nav.Link>
                    <Nav.Link as={Link} to="/bands">Группы</Nav.Link>

                </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <NavDropdown 
                            title={
                                <span>
                                    <Avatar style={{ width: "30px", height: "30px", marginRight: "10px" }} />
                                    <div style={{ display: "inline-block", verticalAlign: "middle", textAlign: "center"}}>
                                        <div style={{color: "black", marginTop:"5px"}}>Маржан</div>
                                        <div style={{ fontSize: "12px", color: "gray" }}>Администратор</div>
                                    </div>
                                </span>
                                
                            } 
                            id="user-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item as={Link} to="/profile">
                                Профиль
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => {
                                // Handle sign out logic
                                if (window.confirm('Вы уверены, что хотите выйти?')) {
                                    // Clear any authentication data
                                    localStorage.removeItem('authToken');
                                    sessionStorage.clear();
                                    // Redirect to login or home
                                    window.location.href = '/login';
                                }
                            }}>
                                Выйти
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
      </Navbar>
    )
}

export default MyNavbar;