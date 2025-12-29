import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/student/quizzes.css";
import { useNavigate } from "react-router-dom";

function Quizzes() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("student_id");

  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId || studentId === "undefined") {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8000/quizzes/student-quizzes/", {
        params: { student_id: studentId },
      })
      .then((res) => {
        setQuizzes(res.data);
      })
      .catch(() => {
        setError("Failed to load quizzes");
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="quizzes-page">
      <h1>Quizzes</h1>

      {quizzes.length === 0 ? (
        <p>No quizzes assigned</p>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((q) => (
            <div key={q.id} className="quiz-card card">
              <h3>{q.title}</h3>

              <p className="course-name">Course: {q.course}</p>
              <p>Total Marks: {q.total_marks}</p>

              {q.attempted ? (
                <button className="attempted-btn" disabled>
                  Attempted
                </button>
              ) : (
                <button
                  className="start-btn"
                  onClick={() => navigate(`/student/quiz/${q.id}`)}
                >
                  Start Quiz
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quizzes;
