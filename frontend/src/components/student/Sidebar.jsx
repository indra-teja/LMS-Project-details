import { Link, useNavigate } from "react-router-dom";
import "../../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/student/dashboard">
          <img
            className="image"
            src="https://vcubesoftsolutions.com/wp-content/uploads/2023/11/cropped-cropped-logo-c-165x85.png"
            alt="Logo"
          />
        </Link>
      </div>

      <nav>
        <Link to="/student/dashboard">Dashboard</Link>
        <Link to="/student/courses">Courses</Link>
        <Link to="/student/performance">Performance</Link>
        <Link to="/student/quizzes">Quizzes</Link>
        <Link to="/student/attendance">Attendance</Link>
        <Link to="/student/practice">Practice</Link>

        {/* ✅ New Placements Section */}
        <Link to="/student/placements">Placements</Link>

        <Link to="/student/queries">Queries</Link>
        <Link to="/student/profile">Profile</Link>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
