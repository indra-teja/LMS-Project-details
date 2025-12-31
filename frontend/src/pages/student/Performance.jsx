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

const API = "http://127.0.0.1:8000";

function Performance() {
  const studentId = localStorage.getItem("student_id");

  const [progressData, setProgressData] = useState([]);
  const [quizData, setQuizData] = useState([]);

  const [mockSummary, setMockSummary] = useState({});
  const [mockDetails, setMockDetails] = useState([]);

  const [testSummary, setTestSummary] = useState({});
  const [testDetails, setTestDetails] = useState([]);

  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  const COLORS = ["#4979e1", "#e5e7eb"];

  useEffect(() => {
    if (!studentId || studentId === "undefined") {
      setError("Session expired. Please login again.");
      return;
    }

    axios
      .get(`${API}/enrollments/student-performance/`, {
        params: { user_id: studentId }
      })
      .then((res) => {
        /* -------- Course Progress -------- */
        setProgressData([
          { name: "Completed", value: res.data.progress?.completed || 0 },
          { name: "Remaining", value: res.data.progress?.remaining || 0 }
        ]);

        /* -------- Quiz Performance -------- */
        setQuizData(res.data.quizzes || []);

        /* -------- Mock Interviews -------- */
        setMockSummary(res.data.mock_interviews || {});
        setMockDetails(res.data.mock_interviews?.details || []);

        /* -------- Weekly Tests -------- */
        setTestSummary(res.data.weekly_tests || {});
        setTestDetails(res.data.weekly_tests?.details || []);

        /* -------- Project -------- */
        setProject(res.data.project || null);

        setError("");
      })
      .catch(() => {
        setError("Failed to load performance data");
      });
  }, [studentId]);

  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="performance-page">
      <h1>Performance Overview</h1>

      {/* ================= SUMMARY ================= */}
      <div className="summary-grid">
        <div className="summary-card">
          <h4>Mock Interviews</h4>
          <p>{mockSummary.count || 0}</p>
          <span>Avg: {mockSummary.average_score || 0}%</span>
        </div>

        <div className="summary-card">
          <h4>Weekly Tests</h4>
          <p>{testSummary.count || 0}</p>
          <span>Avg: {testSummary.average_score || 0}%</span>
        </div>

        <div className="summary-card">
          <h4>Attendance</h4>
          <p>{resSafe(mockSummary.attendance_percentage)}%</p>
        </div>

        <div className="summary-card">
          <h4>Project</h4>
          <p>{project ? project.status : "Not Assigned"}</p>
        </div>
      </div>

      {/* ================= FEEDBACK ================= */}
      <div className="remarks-grid">
        {/* Mock Interview Feedback */}
        <div className="card feedback-card">
          <h3>Mock Interview Feedback</h3>

          {mockDetails.length === 0 ? (
            <p>No mock interviews yet</p>
          ) : (
            mockDetails.map((m, i) => (
              <div key={i} className="feedback-item">
                <p>
                  <strong>Mock {m.interview_no}</strong> – Score {m.score}%
                </p>
                <p className="feedback-text">
                  {m.feedback || "No remarks provided"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Weekly Test Feedback */}
        <div className="card feedback-card">
          <h3>Weekly Test Feedback</h3>

          {testDetails.length === 0 ? (
            <p>No weekly tests yet</p>
          ) : (
            testDetails.map((t, i) => (
              <div key={i} className="feedback-item">
                <p>
                  <strong>Week {t.week_no}</strong> – {t.score}/{t.total_marks}
                </p>
                <p className="feedback-text">
                  {t.remarks || "No remarks provided"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="performance-grid">
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
                {progressData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

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

      {/* ================= PROJECT ================= */}
      {project && (
        <div className="card project-card">
          <h3>Real LMS Project</h3>
          <p><strong>Title:</strong> {project.title}</p>
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Score:</strong> {project.score ?? "Not graded"}</p>
          <p>
            <strong>Tech Stack:</strong>{" "}
            {Array.isArray(project.technologies)
              ? project.technologies.join(", ")
              : project.technologies}
          </p>
        </div>
      )}
    </div>
  );
}

/* -------- Utility -------- */
function resSafe(value) {
  return value !== undefined && value !== null ? value : 0;
}

export default Performance;
