import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/instructor/create-quiz.css";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const navigate = useNavigate();

  const createQuiz = (e) => {
    e.preventDefault();

    if (!title.trim() || !courseId.trim()) {
      alert("Quiz title and Course ID are required");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/quizzes/create/", {
        title: title,
        course_id: courseId,
      })
      .then((res) => {
        alert("Quiz created successfully");
        navigate(`/instructor/add-question/${res.data.quiz_id}`);
      })
      .catch((err) => {
        console.error(err.response || err);
        alert(
          err.response?.data?.error ||
          "Failed to create quiz"
        );
      });
  };

  return (
    <div className="i-box">
      <h2>Create Quiz</h2>

      <form className="quiz-form" onSubmit={createQuiz}>
        <div className="form-group">
          <label>Quiz Title</label>
          <input
            type="text"
            placeholder="Enter quiz title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Course ID</label>
          <input
            type="number"
            placeholder="Enter course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </div>

        <button type="submit" className="add-btn">
          Create Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
