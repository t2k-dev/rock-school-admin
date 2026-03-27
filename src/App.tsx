import { Route, useLocation } from "react-router-dom";
import { CalendarWeek } from "./components/calendar/CalendarWeek";
import { AttendanceRescheduleForm } from "./features/attendances/AttendanceRescheduleForm";
import { Login } from "./features/auth/Login";
import { BandForm } from "./features/bands/BandForm";
import { BandScheduleForm } from "./features/bands/BandScheduleForm";
import { BandScreen } from "./features/bands/BandScreen";
import Bands from "./features/bands/BandsList/Bands";
import { BranchScreen } from "./features/branches/BranchScreen";
import HomeScreen from "./features/home/ui/HomeScreen";
import NoteForm from "./features/notes/NoteForm";
import { ChangePasswordScreen } from "./features/profile/ChangePasswordScreen";
import { ProfileScreen } from "./features/profile/ProfileScreen";
import StudentForm from "./features/students/StudentForm";
import StudentScreen from "./features/students/StudentScreen/StudentScreen";
import Students from "./features/students/StudentsList/Students";
import { WaitingScheduleForm } from "./features/students/WaitingScheduleForm";
import { RehearsalForm } from "./features/subscriptions/forms/RehearsalForm";
import { RentalSubscriptionForm } from "./features/subscriptions/forms/RentalSubscriptionForm";
import { SubscriptionForm } from "./features/subscriptions/forms/SubscriptionForm";
import { SubscriptionScheduleForm } from "./features/subscriptions/forms/SubscriptionScheduleForm";
import { TrialSubscriptionForm } from "./features/subscriptions/forms/TrialSubscriptionForm";
import SubscriptionScreenContainer from "./features/subscriptions/SubscriptionScreen/SubscriptionScreenContainer";
import TariffForm from "./features/tariffs/TariffForm";
import { TariffList } from "./features/tariffs/TariffList";
import TeacherForm from "./features/teachers/TeacherForm";
import TeacherPeriods from "./features/teachers/TeacherPeriods";
import TeacherScreen from "./features/teachers/TeacherScreen/TeacherScreen";
<<<<<<< HEAD:src/App.js
import Teachers from "./features/teachers/TeachersList/Teachers";

=======
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header):src/App.tsx
import Footer from "./layout/Footer";
import Sidebar from "./layout/Navbar/ui/SideBar";
import "./index.css";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen">
      {!isLoginPage && <Sidebar />}

      <div
        className={`flex flex-col flex-grow ${!isLoginPage ? "min-w-0" : ""}`}
      >
        <main className="flex-grow p-6">
          <Route
            exact
            path="/login"
            component={(props) => <Login {...props} />}
          />
          <Route
            exact
            path="/profile"
            component={(props) => <ProfileScreen {...props} />}
          />
          <Route
            exact
            path="/change-password"
            component={(props) => <ChangePasswordScreen {...props} />}
          />
          <Route exact path="/" render={(props) => <HomeScreen {...props} />} />
          <Route
            exact
            path="/home"
            component={(props) => <HomeScreen {...props} />}
          />
          <Route
            exact
            path="/attendance/:id/rescheduleForm"
            component={(props) => <AttendanceRescheduleForm {...props} />}
          />
          <Route
            exact
            path="/branchScreen/:id"
            component={(props) => <BranchScreen {...props} />}
          />

          <Route exact path="/teachers">
            <Teachers />
          </Route>
          <Route
            exact
            path="/teacher/:id"
            component={(props) => <TeacherScreen {...props} />}
          />
          <Route
            exact
            path="/teacher/:id/schedule"
            component={(props) => <TeacherPeriods {...props} />}
          />
          <Route
            exact
            path="/teacher/:id/edit"
            component={(props) => <TeacherForm type="Edit" {...props} />}
          />
          <Route
            exact
            path="/admin/registerTeacher"
            component={(props) => <TeacherForm type="New" {...props} />}
          />

          <Route exact path="/students">
            <Students />
          </Route>
          <Route
            exact
            path="/student/:id"
            component={(props) => <StudentScreen {...props} />}
          />
          <Route
            exact
            path="/student"
            component={(props) => <StudentForm type="New" {...props} />}
          />
          <Route
            exact
            path="/student/edit/:id"
            component={(props) => <StudentForm type="Edit" {...props} />}
          />
          <Route
            exact
            path="/student/:id/addTrial"
            component={(props) => <TrialSubscriptionForm {...props} />}
          />
          <Route
            exact
            path="/student/:id/rehearsal"
            component={(props) => <RehearsalForm {...props} />}
          />
          <Route
            exact
            path="/student/:id/waitingSchedule"
            component={(props) => <WaitingScheduleForm {...props} />}
          />
          <Route
            exact
            path="/student/:id/roomRental"
            component={(props) => (
              <RentalSubscriptionForm type="New" {...props} />
            )}
          />
          <Route
            exact
            path="/admin/addSubscription"
            component={(props) => <SubscriptionForm {...props} />}
          />
          <Route
            exact
            path="/student/:id/subscriptionForm"
            component={(props) => <SubscriptionForm type="New" {...props} />}
          />

          <Route
            exact
            path="/subscription/:id/schedule"
            component={(props) => <SubscriptionScheduleForm {...props} />}
          />
          <Route
            exact
            path="/subscription/:id/attendances"
            component={(props) => <SubscriptionScreenContainer {...props} />}
          />

          <Route
            exact
            path="/notes/addNote"
            component={(props) => <NoteForm type="New" {...props} />}
          />
          <Route
            exact
            path="/notes/:id/edit"
            component={(props) => <NoteForm {...props} />}
          />

          <Route
            exact
            path="/tariffForm"
            component={(props) => <TariffForm type="New" {...props} />}
          />
          <Route
            exact
            path="/tariffList"
            component={(props) => <TariffList {...props} />}
          />

          <Route exact path="/bands">
            <Bands />
          </Route>
          <Route
            exact
            path="/band/:id"
            component={(props) => <BandScreen {...props} />}
          />
          <Route
            exact
            path="/band/:id/edit"
            component={(props) => <BandForm type="Edit" {...props} />}
          />
          <Route
            exact
            path="/band/:id/schedule"
            component={(props) => <BandScheduleForm {...props} />}
          />
          <Route
            exact
            path="/admin/registerBand"
            component={(props) => <BandForm type="New" {...props} />}
          />

          <Route exact path="/bigCalendarTest">
            <CalendarWeek />
          </Route>
        </main>

        {!isLoginPage && <Footer />}
      </div>
    </div>
  );
}

export default App;
