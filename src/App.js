import { BrowserRouter, Route } from "react-router-dom";
import { CalendarWeek } from "./components/calendar/CalendarWeek";
import { AttendanceRescheduleForm } from "./features/attendances/AttendanceRescheduleForm";
import Login from "./features/auth/Login";
import { BandForm } from "./features/bands/BandForm";
import Bands from "./features/bands/Bands";
import { BandScheduleForm } from "./features/bands/BandScheduleForm";
import { BandScreen } from "./features/bands/BandScreen";
import { BranchScreen } from "./features/branches/BranchScreen";
import HomeScreen from "./features/home/HomeScreen";
import NoteForm from "./features/notes/NoteForm";
import ChangePasswordScreen from "./features/profile/ChangePasswordScreen";
import ProfileScreen from "./features/profile/ProfileScreen";
import StudentForm from "./features/students/StudentForm";
import Students from "./features/students/Students";
import StudentScreen from "./features/students/StudentScreen/StudentScreen";
import { WaitingScheduleForm } from "./features/students/WaitingScheduleForm";
import { RehearsalForm } from "./features/subscriptions/forms/RehearsalForm";
import { RentalSubscriptionForm } from "./features/subscriptions/forms/RentalSubscriptionForm";
import { SubscriptionForm } from "./features/subscriptions/forms/SubscriptionForm";
import { SubscriptionScheduleForm } from "./features/subscriptions/forms/SubscriptionScheduleForm";
import { TrialSubscriptionForm } from "./features/subscriptions/forms/TrialSubscriptionForm";
import SubscriptionScreenContainer from "./features/subscriptions/SubscriptionScreen/SubscriptionScreenContainer";
import TariffForm from "./features/tariffs/TariffForm";
import TariffList from "./features/tariffs/TariffList";
import TeacherForm from "./features/teachers/TeacherForm";
import TeacherPeriods from "./features/teachers/TeacherPeriods";
import Teachers from "./features/teachers/Teachers";
import TeacherScreen from "./features/teachers/TeacherScreen/TeacherScreen";
import Footer from "./layout/Footer";
import HorizontalNavbar from "./layout/HorizontalNavbar";

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BrowserRouter>
        <HorizontalNavbar />
        
        <div style={{ flex: '1 0 auto' }}>
          <Route exact path="/login" render={(props) => <Login {...props} />}/>
          <Route exact path="/profile" render={(props) => <ProfileScreen {...props} />}/>
          <Route exact path="/change-password" render={(props) => <ChangePasswordScreen {...props} />}/>
          
          <Route exact path="/" render={(props) => <HomeScreen {...props} />}/>
          <Route exact path="/home" render={(props) => <HomeScreen {...props} />}/>

          <Route exact path="/attendance/:id/rescheduleForm" render={(props) => <AttendanceRescheduleForm {...props}/>}/>

          <Route exact path="/branchScreen/:id" render={(props) => <BranchScreen {...props}/>}/>

          <Route exact path="/teachers"><Teachers /></Route>
          <Route exact path="/teacher/:id" render={(props) => <TeacherScreen {...props}/>}/>
          <Route exact path="/teacher/:id/schedule" render={(props) => <TeacherPeriods {...props}/>}/>
          <Route exact path="/teacher/:id/edit" render={(props) => <TeacherForm type="Edit" {...props} />}/>
          <Route exact path="/admin/registerTeacher" render={(props) => <TeacherForm type="New" {...props} />}/>
          
          <Route exact path="/students"><Students /></Route>
          <Route exact path="/student/:id" render={(props) => <StudentScreen {...props}/>}/>
          <Route exact path="/student" render={(props) => <StudentForm type="New" {...props} />}/>
          <Route exact path="/student/edit/:id" render={(props) => <StudentForm type="Edit" {...props} />}/>
          <Route exact path="/student/:id/addTrial" render={(props) => <TrialSubscriptionForm {...props} />}/>
          <Route exact path="/student/:id/rehearsal" render={(props) => <RehearsalForm {...props} />}/>
          <Route exact path="/student/:id/waitingSchedule" render={(props) => <WaitingScheduleForm {...props} />}/>
          <Route exact path="/student/:id/roomRental" render={(props) => <RentalSubscriptionForm type="New" {...props} />}/>
          <Route exact path="/admin/addSubscription" render={(props) => <SubscriptionForm {...props} />}/>
          
          <Route exact path="/student/:id/subscriptionForm" render={(props) => <SubscriptionForm type="New" {...props} />}/>
          <Route exact path="/subscription/:id/schedule" render={(props) => <SubscriptionScheduleForm {...props} />}/>
          <Route exact path="/subscription/:id/attendances" render={(props) => <SubscriptionScreenContainer {...props} />} />
          <Route exact path="/notes/addNote" render={(props) => <NoteForm type="New" {...props} />}/>
          <Route exact path="/notes/:id/edit" render={(props) => <NoteForm {...props} />}/>
          
          <Route exact path="/tariffForm" render={(props) => <TariffForm type="New" {...props} />}/>
          <Route exact path="/tariffList" render={(props) => <TariffList {...props} />}/>
          
          <Route exact path="/bands"><Bands /></Route>
          <Route exact path="/band/:id" render={(props) => <BandScreen {...props} />}/>
          <Route exact path="/band/:id/edit" render={(props) => <BandForm type="Edit" {...props} />}/>
          <Route exact path="/band/:id/schedule" render={(props) => <BandScheduleForm {...props} />}/>
          <Route exact path="/admin/registerBand" render={(props) => <BandForm type="New" {...props} />}/>

          <Route exact path="/bigCalendarTest"><CalendarWeek /></Route>
        </div>
        
        <Footer />
      </BrowserRouter>
    </div>
  );
}
export default App;
