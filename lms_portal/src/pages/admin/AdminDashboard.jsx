import "../../styles/admin/admin-dashboard.css";
import '../../styles/admin/admin-common.css'

function AdminDashboard() {
  return (
    <div className="admin-box">
      <h1>Admin Dashboard</h1>
      <p>Overview of platform activity</p>

      <div className="admin-actions">
        <button className="admin-btn">View Reports</button>
        <button className="admin-btn secondary">Export Data</button>
      </div>
    </div>
  );
}
export default AdminDashboard;
