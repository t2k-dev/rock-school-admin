import { BrowserRouter, Route } from "react-router-dom";

import { BranchScreen } from "./features/branches/BranchScreen";
import HomeScreen from "./features/home/HomeScreen";
import Students from "./features/students/Students";
import Teachers from "./features/teachers/Teachers";

import { AttendanceCancelationForm } from "./features/attendances/AttendanceCancelationForm";
import { AttendanceRescheduleForm } from "./features/attendances/AttendanceRescheduleForm";

import StudentForm from "./features/students/StudentForm";
import StudentScreen from "./features/students/StudentScreen";
import { WaitingScheduleForm } from "./features/students/WaitingScheduleForm";

import TeacherForm from "./features/teachers/TeacherForm";
import TeacherScreen from "./features/teachers/TeacherScreen";

import { SubscriptionFormEditable } from "./features/subscriptions/SubscriptioFormEditable";
import { SubscriptionForm } from "./features/subscriptions/SubscriptionForm";
import { TrialSubscriptionForm } from "./features/subscriptions/TrialSubscriptionForm";

import { TestComponent } from "./TestComponent";
import { TestComponent2 } from "./TestComponent2";
import NoteForm from "./features/notes/NoteForm";

import MyNavbar from "./MyNavbar";
import { CalendarWeek } from "./shared/calendar/CalendarWeek";

function App() {
  return (
    <BrowserRouter>
      
      <MyNavbar />
      <Route exact path="/" render={(props) => <HomeScreen {...props} />}/>
      <Route exact path="/home" render={(props) => <HomeScreen {...props} />}/>

      <Route exact path="/attendance/:id/rescheduleForm" render={(props) => <AttendanceRescheduleForm {...props}/>}/>
      <Route exact path="/attendance/:id/cancelationForm" render={(props) => <AttendanceCancelationForm {...props}/>}/>

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
      <Route exact path="/subscription/:id/edit" render={(props) => <SubscriptionFormEditable {...props} />}/>

      <Route exact path="/notes/addNote" render={(props) => <NoteForm type="New" {...props} />}/>
      <Route exact path="/notes/:id/edit" render={(props) => <NoteForm {...props} />}/>
      
      <Route exact path="/bigCalendarTest"><CalendarWeek /></Route>
      <Route exact path="/TestComponent" render={(props) => <TestComponent {...props}/>}/>
      <Route exact path="/TestComponent2" render={(props) => <TestComponent2 {...props}/>}/>
      
    </BrowserRouter>
  );
}
export default App;
