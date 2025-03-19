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


import TeacherScreen from "./teachers/TeacherScreen"
import TeacherForm from "./teachers/TeacherForm";

import {TrialSubscriptionForm} from "./subscriptions/TrialSubscriptionForm";
import {SubscriptionForm} from "./subscriptions/SubscriptionForm";

import NoteForm from "./notes/NoteForm";
import {CalendarWeek} from "./common/CalendarWeek";

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Route exact path="/home"><HomeScreen /></Route>
      
      <Route exact path="/teachers"><Teachers /></Route>
      <Route exact path="/teacher/:id" render={(props) => <TeacherScreen {...props}/>}/>
      <Route exact path="/teachers/edit/:id" render={(props) => <TeacherForm type="Edit" {...props} />}/>
      <Route exact path="/admin/registerTeacher" render={(props) => <TeacherForm type="New" {...props} />}/>
      
      <Route exact path="/students"><Students /></Route>
      <Route exact path="/student/:id" render={(props) => <StudentScreen {...props}/>}/>
      <Route exact path="/students/edit/:id" render={(props) => <StudentForm type="Edit" {...props} />}/>
      <Route exact path="/admin/registerStudent" render={(props) => <TrialSubscriptionForm {...props} />}/>
      
      <Route exact path="/student/:id/subscriptionForm" render={(props) => <SubscriptionForm type="New" {...props} />}/>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route exact path="/notes/addNote" render={(props) => <NoteForm {...props} />}/>
      
      <Route exact path="/bigCalendarTest"><CalendarWeek /></Route>
      
    </BrowserRouter>
  );
}
export default App;
