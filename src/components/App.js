import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';

import Teachers from "./Teachers";
import TeachersForm from "./TeachersForm";

import About from "./About";
import Contact from "./Contact";
import MyNavbar from "./MyNavbar";

import RegisterStudent from "./admin/RegisterStudent";
import RegisterTeacher from "./admin/RegisterTeacher";

function App() {

    return (
        <BrowserRouter>
            <div className="App">
                <MyNavbar/>
                <Routes>
                    <Route path='/teachers' element={<Teachers/>} />
                    <Route path='/teachers/add' element={<TeachersForm/>} />
                    <Route path='/teachers/edit/:id' element={<TeachersForm/>} />
                    
                    <Route path='/about' element={<About/>} />
                    <Route path='/contact' element={<Contact/>} />
                    
                    <Route path='/admin/registerStudent' element={<RegisterStudent/>} />
                    <Route path='/admin/registerTeacher' element={<RegisterTeacher/>} />
                    
                </Routes>
            </div>
        </BrowserRouter>
    )
}
export default App;