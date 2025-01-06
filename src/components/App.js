import React from "react";
import { BrowserRouter, Route, Link, Switch, Router } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";

import Teachers from "./Teachers";
import Students from "./Students";
import TeachersForm from "./TeachersForm";

import About from "./About";
import Contact from "./Contact";
import MyNavbar from "./MyNavbar";

import RegisterStudent from "./admin/RegisterStudent";
import { RegisterTeacher } from "./admin/RegisterTeacher";

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Route exact path="/teachers"><Teachers /></Route>
      <Route exact path="/teachers/edit/:id" render={(props) => <RegisterTeacher type="Edit" {...props} />}/>
      <Route exact path="/admin/registerTeacher" render={(props) => <RegisterTeacher type="New" {...props} />}/>
      <Route exact path="/students"><Students /></Route>
      <Route exact path="/admin/registerStudent" render={(props) => <RegisterStudent type="New" {...props} />}/>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </BrowserRouter>
  );
}
export default App;
