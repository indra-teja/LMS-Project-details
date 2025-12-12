// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Universal Login
import Login from "./pages/Login.jsx";

// Student Layout + Pages
import StudentLayout from "./layout/StudentLayout.jsx";
import Dashboard from "./pages/student/Dashboard.jsx";
import Courses from "./pages/student/Courses.jsx";
import Performance from "./pages/student/Performance.jsx";
import Quizzes from "./pages/student/Quizzes.jsx";
import Attendance from "./pages/student/Attendance.jsx";
import Practice from "./pages/student/Practice.jsx";
import Profile from "./pages/student/Profile.jsx";
import Queries from "./pages/student/Queries.jsx";

// Instructor Layout + Pages
import InstructorLayout from "./layout/InstructorLayout.jsx";
import InstructorDashboard from "./pages/instructor/InstructorDashboard.jsx";
import AddCourse from "./pages/instructor/AddCourse.jsx";
import ManageCourses from "./pages/instructor/ManageCourses.jsx";
import AttendanceTracking from "./pages/instructor/AttendanceTracking.jsx";
import CreateQuiz from "./pages/instructor/CreateQuiz.jsx";
import StudentPerformance from "./pages/instructor/StudentPerformance.jsx";
import ViewQueries from "./pages/instructor/ViewQueries.jsx";
import InstructorProfile from "./pages/instructor/InstructorProfile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Universal Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Student Panel */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="performance" element={<Performance />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="practice" element={<Practice />} />
          <Route path="profile" element={<Profile />} />
          <Route path="queries" element={<Queries />} />
        </Route>

        {/* Instructor Panel */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="attendance" element={<AttendanceTracking />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="student-performance" element={<StudentPerformance />} />
          <Route path="view-queries" element={<ViewQueries />} />
          <Route path="profile" element={<InstructorProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
