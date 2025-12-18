import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/admin-dashboard.css";
import "../../styles/admin/admin-common.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/accounts/admin/dashboard/")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Failed to load admin dashboard", err);
      });
  }, []);

  if (!stats) {
    return <p className="admin-box">Loading dashboard...</p>;
  }

  return (
    <div className="admin-box">
      <h1>Admin Dashboard</h1>
      <p>Overview of platform activity</p>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Students</h3>
          <p>{stats.students}</p>
        </div>

        <div className="stat-card">
          <h3>Instructors</h3>
          <p>{stats.instructors}</p>
        </div>

        <div className="stat-card">
          <h3>Courses</h3>
          <p>{stats.courses}</p>
        </div>

        <div className="stat-card">
          <h3>Active Users</h3>
          <p>{stats.active_users}</p>
        </div>
      </div>

      <div className="admin-actions">
        <button className="admin-btn">View Reports</button>
        <button className="admin-btn secondary">Export Data</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
