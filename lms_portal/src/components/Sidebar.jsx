import { Link, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();     // clears any saved user session
    navigate("/login");       // redirects to login page
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/">
          <img
            className="image"
            src="https://vcubesoftsolutions.com/wp-content/uploads/2023/11/cropped-cropped-logo-c-165x85.png"
            alt="Logo"
          />
        </Link>
      </div>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/performance">Performance</Link>
        <Link to="/quizzes">Quizzes</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/queries">Queries</Link>
      </nav>

      {/* Logout section */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
