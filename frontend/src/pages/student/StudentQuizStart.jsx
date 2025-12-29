import { useParams, useNavigate } from "react-router-dom";

function StudentQuizStart() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="card">
      <h2>Ready to start the quiz?</h2>
      <p>Once started, you must complete it.</p>

      <button
        onClick={() => navigate(`/student/quiz/${quizId}/attempt`)}
      >
        Start Quiz
      </button>
    </div>
  );
}

export default StudentQuizStart;
