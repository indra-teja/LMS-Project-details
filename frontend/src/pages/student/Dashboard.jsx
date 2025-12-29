import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/student/dashboard.css";

const API_BASE = "http://127.0.0.1:8000";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    // 🔐 Guard: student must be logged in
    if (!studentId) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE}/enrollments/student-dashboard/`, {
        params: { student_id: studentId },
      })
      .then((res) => {
        console.log("Dashboard data:", res.data);
        setData(res.data);
        setError("");
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setError(
          err.response?.data?.error || "Failed to load dashboard"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <p>Loading dashboard...</p>;

  if (error) {
    return (
      <div className="error-text">
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="student-dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Course Progress</h3>
          <p>{data.course_progress}% completed</p>
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Quizzes</h3>
          <p>{data.upcoming_quizzes}</p>
        </div>

        <div className="dashboard-card">
          <h3>Attendance</h3>
          <p>{data.attendance}%</p>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>

          {data.recent_activity && data.recent_activity.length > 0 ? (
            <ul>
              {data.recent_activity.map((a, i) => (
                <li key={i}>{a.message}</li>
              ))}
            </ul>
          ) : (
            <p>No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
