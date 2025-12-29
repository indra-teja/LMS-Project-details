import { useLocation, useNavigate } from "react-router-dom";

function StudentQuizResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <p>No result available</p>;
  }

  return (
    <div className="card">
      <h2>Quiz Result</h2>

      <p>Score: {state.score}</p>
      <p>Total Marks: {state.total_marks}</p>
      <p>Percentage: {state.percentage}%</p>

      <button onClick={() => navigate("/student/quizzes")}>
        Back to Quizzes
      </button>
    </div>
  );
}

export default StudentQuizResult;
