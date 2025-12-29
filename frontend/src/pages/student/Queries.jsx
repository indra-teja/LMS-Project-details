import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/student/queries.css";

const API_BASE = "http://127.0.0.1:8000";

function Queries() {
  const studentId = localStorage.getItem("student_id");

  const [question, setQuestion] = useState("");
  const [queries, setQueries] = useState([]);
  const [message, setMessage] = useState("");

  // 🚨 HARD SESSION GUARD
  useEffect(() => {
    if (!studentId) {
      alert("Session expired. Please login again.");
      window.location.href = "/login";
    }
  }, [studentId]);

  const fetchQueries = () => {
    axios
      .get(`${API_BASE}/notifications/query/student/`, {
        params: { student_id: studentId },
      })
      .then((res) => setQueries(res.data))
      .catch(() => setQueries([]));
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleSubmit = async () => {
    if (!question.trim()) {
      setMessage("Please enter your query");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/notifications/query/create/`,
        {
          student_id: studentId,   // ✅ STRING OK
          question: question.trim(),
        }
      );

      setMessage(res.data.message);
      setQuestion("");
      fetchQueries();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to submit query");
    }
  };

  return (
    <div className="query-page">
      <h1>Raise a Query</h1>

      <div className="card">
        <textarea
          className="query-box"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Describe your query..."
        />

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>

        {message && <p className="success-text">{message}</p>}
      </div>

      <h2 style={{ marginTop: "30px" }}>My Queries</h2>

      {queries.length === 0 ? (
        <p>No queries raised yet.</p>
      ) : (
        queries.map((q) => (
          <div key={q.id} className="card query-item">
            <p><strong>Question:</strong> {q.question}</p>

            <p>
              <strong>Status:</strong>{" "}
              {q.is_resolved ? (
                <span className="resolved">Resolved</span>
              ) : (
                <span className="pending">Pending</span>
              )}
            </p>

            {q.is_resolved && q.reply && (
              <p className="reply">
                <strong>Reply:</strong> {q.reply}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Queries;
