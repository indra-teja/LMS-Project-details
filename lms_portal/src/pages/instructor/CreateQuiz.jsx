import "../../styles/instructor/create-quiz.css";

function CreateQuiz() {
  return (
    <div className="i-box">
      <h2>Create Quiz</h2>
      <form className="i-form">
        <input placeholder="Quiz Title" />
        <textarea placeholder="Questions"></textarea>
        <button>Create Quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;
