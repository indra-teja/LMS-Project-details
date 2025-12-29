import { BrowserRouter, Routes, Route } from "react-router-dom";

/* -------------------- Universal Login -------------------- */
import Login from "./pages/Login.jsx";

/* -------------------- Student Panel -------------------- */
import StudentLayout from "./layout/StudentLayout.jsx";
import Dashboard from "./pages/student/Dashboard.jsx";
import Courses from "./pages/student/Courses.jsx";
import StudentCourse from "./pages/student/StudentCourse.jsx"; // ✅ NEW
import Performance from "./pages/student/Performance.jsx";
import Quizzes from "./pages/student/Quizzes.jsx";
import Attendance from "./pages/student/Attendance.jsx";
import Practice from "./pages/student/Practice.jsx";
import Profile from "./pages/student/Profile.jsx";
import Queries from "./pages/student/Queries.jsx";
import StudentQuizAttempt from "./pages/student/StudentQuizAttempt.jsx";
import StudentQuizStart from "./pages/student/StudentQuizStart.jsx";
import StudentQuizResult from "./pages/student/StudentQuizResult.jsx";

/* -------------------- Instructor Panel -------------------- */
import InstructorLayout from "./layout/InstructorLayout.jsx";
import InstructorDashboard from "./pages/instructor/InstructorDashboard.jsx";
import AddCourse from "./pages/instructor/AddCourse.jsx";
import ManageCourses from "./pages/instructor/ManageCourses.jsx";
import CreateQuiz from "./pages/instructor/CreateQuiz.jsx";
import StudentPerformance from "./pages/instructor/StudentPerformance.jsx";
import ViewQueries from "./pages/instructor/ViewQueries.jsx";
import InstructorProfile from "./pages/instructor/InstructorProfile.jsx";
import InstructorAttendance from "./pages/instructor/InstructorAttendance.jsx";
import AttendanceTracking from "./pages/instructor/AttendanceTracking.jsx";
import ManageCourseContent from "./pages/instructor/ManageCourseContent.jsx";
import EditCourse from "./pages/instructor/EditCourse.jsx";
import AddQuestion from "./pages/instructor/AddQuestion.jsx";

/* -------------------- Admin Panel -------------------- */
import AdminLayout from "./layout/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageStudents from "./pages/admin/ManageStudents.jsx";
import ManageInstructors from "./pages/admin/ManageInstructors.jsx";
import ManageAdminCourses from "./pages/admin/ManageCourses.jsx";
import AdminQueries from "./pages/admin/AdminQueries.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";
import AdminManageCourseContent from "./pages/admin/AdminManageCourseContent.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* -------------------- Login -------------------- */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* -------------------- Student Panel -------------------- */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:id" element={<StudentCourse />} /> {/* ✅ NEW */}
          <Route path="performance" element={<Performance />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="practice" element={<Practice />} />
          <Route path="profile" element={<Profile />} />
          <Route path="queries" element={<Queries />} />
          <Route path="/student/quizzes" element={<Quizzes />} />
          <Route path="/student/quiz/:quizId" element={<StudentQuizStart />} />
          <Route path="/student/quiz/:quizId/attempt" element={<StudentQuizAttempt />} />
          <Route path="/student/quiz/:quizId/result" element={<StudentQuizResult />} />

        </Route>

        {/* -------------------- Instructor Panel -------------------- */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="attendance-tracking" element={<AttendanceTracking />} />
          <Route path="attendance" element={<InstructorAttendance />} />
          <Route path="create-quiz" element={<CreateQuiz />} />
          <Route path="student-performance" element={<StudentPerformance />} />
          <Route path="view-queries" element={<ViewQueries />} />
          <Route path="profile" element={<InstructorProfile />} />
          <Route
            path="manage-course-content/:courseId"
            element={<ManageCourseContent />}
          />
          <Route
            path="/instructor/attendance/:courseId"
            element={<InstructorAttendance />}
          />

          <Route path="edit-course/:courseId" element={<EditCourse />} />
          <Route path="quiz/:quizId/add-question" element={<AddQuestion />} />
          <Route path="add-question/:quizId" element={<AddQuestion />} />
        </Route>

        {/* -------------------- Admin Panel -------------------- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-instructors" element={<ManageInstructors />} />
          <Route path="manage-courses" element={<ManageAdminCourses />} />
          <Route path="queries" element={<AdminQueries />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route
            path="courses/:courseId/content"
            element={<ManageCourseContent />}
          />
          <Route
            path="manage-course-content/:courseId"
            element={<AdminManageCourseContent />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
