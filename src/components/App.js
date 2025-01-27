import React from "react";
import { BrowserRouter, Route, Link, Switch, Router } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";

import Teachers from "./teachers/Teachers";
import Students from "./students/Students";

import About from "./About";
import Contact from "./Contact";
import MyNavbar from "./MyNavbar";

import HomeScreen from "./home/HomeScreen";

import StudentScreen from "./students/StudentScreen";
import StudentForm from "./students/StudentForm";
import NewStudentForm from "./students/NewStudentForm";

import TeacherForm from "./teachers/TeacherForm";
import AddSubscription from "./subscriptions/AddSubscription";

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Route exact path="/home"><HomeScreen /></Route>
      <Route exact path="/teachers"><Teachers /></Route>
      <Route exact path="/teachers/edit/:id" render={(props) => <TeacherForm type="Edit" {...props} />}/>
      <Route exact path="/admin/registerTeacher" render={(props) => <TeacherForm type="New" {...props} />}/>
      <Route exact path="/students"><Students /></Route>
      <Route exact path="/student/:id"><StudentScreen /></Route>
      <Route exact path="/students/edit/:id" render={(props) => <StudentForm type="Edit" {...props} />}/>
      <Route exact path="/admin/registerStudent" render={(props) => <NewStudentForm type="New" {...props} />}/>
      <Route exact path="/admin/addSubscription" render={(props) => <AddSubscription type="New" {...props} />}/>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </BrowserRouter>
  );
}
export default App;
