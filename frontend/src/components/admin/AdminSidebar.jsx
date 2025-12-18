import { Link, useNavigate } from "react-router-dom";
import "../../styles/admin/admin-sidebar.css";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">
      
      {/* Logo Section */}
      <div className="admin-logo-container">
        <Link to="/admin/dashboard">
          <img
            className="admin-logo"
            src="https://vcubesoftsolutions.com/wp-content/uploads/2023/11/cropped-cropped-logo-c-165x85.png"
            alt="Admin Logo"
          />
        </Link>
      </div>

      <ul className="admin-menu">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/manage-students">Manage Students</Link></li>
        <li><Link to="/admin/manage-instructors">Manage Instructors</Link></li>
        <li><Link to="/admin/manage-courses">Manage Courses</Link></li>
        <li><Link to="/admin/queries">Student Queries</Link></li>
        <li><Link to="/admin/settings">Settings</Link></li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;
