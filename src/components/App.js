import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { BranchScreen } from "./branches/BranchScreen";
import Students from "./students/Students";
import Teachers from "./teachers/Teachers";

import About from "./About";
import Contact from "./Contact";
import MyNavbar from "./MyNavbar";

import HomeScreen from "./home/HomeScreen";

import { AttendanceAtendedForm } from "./attendances/AttendanceAtendedForm";
import { AttendanceCancelationForm } from "./attendances/AttendanceCancelationForm";
import { AttendanceRescheduleForm } from "./attendances/AttendanceRescheduleForm";

import StudentForm from "./students/StudentForm";
import StudentScreen from "./students/StudentScreen";
import { WaitingScheduleForm } from "./students/WaitingScheduleForm";

import TeacherForm from "./teachers/TeacherForm";
import TeacherScreen from "./teachers/TeacherScreen";

import { SubscriptionForm } from "./subscriptions/SubscriptionForm";
import { TrialSubscriptionForm } from "./subscriptions/TrialSubscriptionForm";

import { TestComponent } from "./TestComponent";
import { TestComponent2 } from "./TestComponent2";
import { CalendarWeek } from "./common/CalendarWeek";
import NoteForm from "./notes/NoteForm";

function App() {
  return (
    <BrowserRouter>
      
      <MyNavbar />
      <Route exact path="/"><HomeScreen /></Route>
      <Route exact path="/home"><HomeScreen /></Route>
      
      <Route exact path="/attendance/:id/rescheduleForm" render={(props) => <AttendanceRescheduleForm {...props}/>}/>
      <Route exact path="/attendance/:id/cancelationForm" render={(props) => <AttendanceCancelationForm {...props}/>}/>
      <Route exact path="/attendance/:id/attendedForm" render={(props) => <AttendanceAtendedForm {...props}/>}/>
      
      <Route exact path="/branchScreen/:id" render={(props) => <BranchScreen {...props}/>}/>

      <Route exact path="/teachers"><Teachers /></Route>
      <Route exact path="/teacher/:id" render={(props) => <TeacherScreen {...props}/>}/>
      <Route exact path="/teachers/edit/:id" render={(props) => <TeacherForm type="Edit" {...props} />}/>
      <Route exact path="/admin/registerTeacher" render={(props) => <TeacherForm type="New" {...props} />}/>
      
      <Route exact path="/students"><Students /></Route>
      <Route exact path="/student/:id" render={(props) => <StudentScreen {...props}/>}/>
      <Route exact path="/student" render={(props) => <StudentForm type="New" {...props} />}/>
      <Route exact path="/student/edit/:id" render={(props) => <StudentForm type="Edit" {...props} />}/>
      <Route exact path="/student/:id/addTrial" render={(props) => <TrialSubscriptionForm {...props} />}/>
      <Route exact path="/student/:id/waitingSchedule" render={(props) => <WaitingScheduleForm {...props} />}/>
      <Route exact path="/admin/addSubscription" render={(props) => <SubscriptionForm {...props} />}/>
      
      <Route exact path="/student/:id/subscriptionForm" render={(props) => <SubscriptionForm type="New" {...props} />}/>
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      <Route exact path="/notes/addNote" render={(props) => <NoteForm type="New" {...props} />}/>
      <Route exact path="/notes/:id/edit" render={(props) => <NoteForm {...props} />}/>
      
      <Route exact path="/bigCalendarTest"><CalendarWeek /></Route>
      <Route exact path="/TestComponent" render={(props) => <TestComponent {...props}/>}/>
      <Route exact path="/TestComponent2" render={(props) => <TestComponent2 {...props}/>}/>
      
    </BrowserRouter>
  );
}
export default App;
