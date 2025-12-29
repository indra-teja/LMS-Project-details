import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/instructor/add-question.css";

function AddQuestion() {
  const { quizId } = useParams();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const submitQuestion = (e) => {
    e.preventDefault();

    axios
      .post(`http://127.0.0.1:8000/quizzes/${quizId}/add-question/`, {
        question,
        options,
      })
      .then(() => {
        alert("Question added");
        setQuestion("");
        setOptions([
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ]);
      })
      .catch((err) => {
        alert(err.response?.data?.error || "Failed to add question");
      });
  };

  return (
    <div className="i-box">
      <h2>Add Question</h2>

      <form onSubmit={submitQuestion}>
        <textarea
          placeholder="Enter question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {options.map((opt, index) => (
          <div key={index} className="option-row">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt.text}
              onChange={(e) =>
                handleOptionChange(index, "text", e.target.value)
              }
              required
            />
            <label>
              <input
                type="checkbox"
                checked={opt.is_correct}
                onChange={(e) =>
                  handleOptionChange(index, "is_correct", e.target.checked)
                }
              />
              Correct
            </label>
          </div>
        ))}

        <button className="add-btn">Add Question</button>
      </form>
    </div>
  );
}

export default AddQuestion;
