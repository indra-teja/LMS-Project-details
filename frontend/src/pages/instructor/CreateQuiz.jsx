import "../../styles/instructor/create-quiz.css";

function CreateQuiz() {
  return (
    <div className="i-box">
      <h2>Create Quiz</h2>

      <div className="create-quiz-card">
        <form className="quiz-form">
          {/* Quiz title */}
          <div className="form-group">
            <label>Quiz Title</label>
            <input
              type="text"
              placeholder="Enter quiz title"
            />
          </div>

          {/* Questions */}
          <div className="form-group">
            <label>Questions</label>
            <textarea
              placeholder="Enter questions (one per line)"
            />
          </div>

          {/* Actions */}
          <div className="quiz-actions">
            <button
              type="button"
              className="add-question-btn"
            >
              Add Question
            </button>

            <button
              type="submit"
              className="save-quiz-btn"
            >
              Save Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuiz;
