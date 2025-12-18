import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/student/dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/enrollments/student-dashboard/")
      .then((res) => {
        console.log("Dashboard data:", res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard");
      });
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

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
          {data.recent_activity.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            <ul>
              {data.recent_activity.map((a, i) => (
                <li key={i}>{a.message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
