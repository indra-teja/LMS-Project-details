import { Link } from "react-router-dom";
import "../../styles/admin/admin-sidebar.css";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">Admin</h2>

      <ul className="admin-menu">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/manage-students">Manage Students</Link></li>
        <li><Link to="/admin/manage-instructors">Manage Instructors</Link></li>
        <li><Link to="/admin/manage-courses">Manage Courses</Link></li>
        <li><Link to="/admin/queries">Student Queries</Link></li>
        <li><Link to="/admin/settings">Settings</Link></li>
      </ul>
    </aside>
  );
}

export default AdminSidebar;
