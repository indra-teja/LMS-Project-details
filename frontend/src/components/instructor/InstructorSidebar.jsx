import { Link, useNavigate } from "react-router-dom";
import "../../styles/instructor/instructor-sidebar.css";

export default function InstructorSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();   // ✅ FIX
    navigate("/login");
  };

  return (
    <div className="i-sidebar">
      <div className="i-logo">
        <img
          src="https://vcubesoftsolutions.com/wp-content/uploads/2023/11/cropped-cropped-logo-c-165x85.png"
          alt="logo"
        />
      </div>

      <nav>
        <Link to="/instructor/dashboard">Dashboard</Link>
        <Link to="/instructor/add-course">Add Course</Link>
        <Link to="/instructor/manage-courses">Manage Courses</Link>
        <Link to="/instructor/create-quiz">Create Quiz</Link>
        <Link to="/instructor/student-performance">Performance</Link>
        <Link to="/instructor/placements">Placements</Link>
        <Link to="/instructor/view-queries">Queries</Link>
        <Link to="/instructor/profile">Profile</Link>
      </nav>

      <button className="i-logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
