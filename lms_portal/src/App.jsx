import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/student/Sidebar.jsx";
import Navbar from "./components/student/Navbar.jsx";



// Student Pages
import Dashboard from "./pages/student/Dashboard.jsx";
import Courses from "./pages/student/Courses.jsx";
import Performance from "./pages/student/Performance.jsx";
import Quizzes from "./pages/student/Quizzes.jsx";
import Attendance from "./pages/student/Attendance.jsx";
import Practice from "./pages/student/Practice.jsx";
import Profile from "./pages/student/Profile.jsx";
import Queries from "./pages/student/Queries.jsx";



function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/queries" element={<Queries />} />
            </Routes>

          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
