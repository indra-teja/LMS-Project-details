import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function StudentQuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const studentId = localStorage.getItem("student_id");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/quizzes/${quizId}/questions/`)
      .then((res) => setQuestions(res.data))
      .catch(() => setError("Failed to load quiz"));
  }, [quizId]);

  const handleChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const submitQuiz = () => {
    axios
      .post("http://127.0.0.1:8000/quizzes/submit/", {
        student_id: studentId,
        quiz_id: quizId,
        answers,
      })
      .then((res) => {
        navigate(`/student/quiz/${quizId}/result`, {
          state: res.data,
        });
      })
      .catch(() => alert("Failed to submit quiz"));
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Quiz</h2>

      {questions.map((q, index) => (
        <div key={q.id} className="card">
          <p>
            {index + 1}. {q.question}
          </p>

          {q.options.map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name={`q-${q.id}`}
                value={opt}
                onChange={() => handleChange(q.id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button onClick={submitQuiz}>Submit Quiz</button>
    </div>
  );
}

export default StudentQuizAttempt;
