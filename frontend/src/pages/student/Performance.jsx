import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/student/performance.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function Performance() {
  const studentId = localStorage.getItem("student_id");

  const [progressData, setProgressData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [error, setError] = useState("");

  const COLORS = ["#4979e1ff", "#f0f0f0"];

  useEffect(() => {
    if (!studentId || studentId === "undefined") {
      setError("Session expired. Please login again.");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/enrollments/student-performance/", {
        params: { student_id: studentId }
      })
      .then((res) => {
        setProgressData([
          { name: "Completed", value: res.data.progress.completed },
          { name: "Remaining", value: res.data.progress.remaining }
        ]);

        setQuizData(res.data.quizzes);
      })
      .catch(() => {
        setError("Failed to load performance data");
      });
  }, [studentId]);

  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <h1>Performance</h1>

      <div className="performance-grid">
        {/* COURSE PROGRESS PIE */}
        <div className="card chart-card">
          <h3>Course Progress</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {progressData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* QUIZ PERFORMANCE BAR */}
        <div className="card chart-card">
          <h3>Quiz Performance</h3>

          {quizData.length === 0 ? (
            <p>No quiz attempts yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quizData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Performance;
