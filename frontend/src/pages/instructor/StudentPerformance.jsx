import { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../styles/instructor/student-performance.css";

function StudentPerformance() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPerformance = async () => {
    if (!search.trim()) {
      setError("Enter student email or name");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/courses/instructor/student-performance/?search=${search}`
      );
      setData(res.data);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  const chartData = data
    ? [
        { name: "Quiz", value: data.quiz_percentage },
        { name: "Attendance", value: data.attendance_percentage },
      ]
    : [];

  return (
    <div className="i-box">
      <h2 className="page-title">Student Performance</h2>

      {/* Search */}
      <div className="search-box">
        <input
          placeholder="Search by student email or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchPerformance}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {data && (
        <>
          {/* Student Info Card */}
          <div className="student-info-card">
            <div>
              <h3>{data.student.name}</h3>
              <p className="email">{data.student.email}</p>
            </div>

            <span className={`status-badge ${data.status.toLowerCase()}`}>
              {data.status}
            </span>
          </div>

          {/* Performance Cards */}
          <div className="performance-cards">
            <div className="perf-card">
              <h4>Quiz Performance</h4>
              <p className="perf-value">{data.quiz_percentage}%</p>
              <p className="perf-desc">
                Average score across all attempted quizzes
              </p>
            </div>

            <div className="perf-card">
              <h4>Attendance</h4>
              <p className="perf-value">{data.attendance_percentage}%</p>
              <p className="perf-desc">
                Attendance based on recorded class sessions
              </p>
            </div>
          </div>

          {/* Graph (UNCHANGED) */}
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentPerformance;
