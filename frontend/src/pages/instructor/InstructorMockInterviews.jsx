import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/instructor/instructor-mock.css";

function InstructorMockInterviews() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [interviewNo, setInterviewNo] = useState("");
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/enrollments/students/")
      .then((res) => setStudents(res.data))
      .catch(() => setError("Failed to load students"));
  }, []);

  const submitMock = () => {
    if (!studentId || !interviewNo || !score) {
      setError("Student, interview number and score are required");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/enrollments/add-mock-interview/", {
        student_id: studentId,
        interview_no: interviewNo,
        score,
        feedback,
      })
      .then(() => {
        setMessage("Mock interview saved");
        setError("");
        setInterviewNo("");
        setScore("");
        setFeedback("");
      })
      .catch(() => {
        setError("Failed to save mock interview");
        setMessage("");
      });
  };

  return (
    <div className="mock-page">
      <h1>Mock Interviews</h1>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <div className="mock-card">
        <label>Student</label>
        <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.email}
            </option>
          ))}
        </select>

        <label>Interview Number</label>
        <input
          type="number"
          value={interviewNo}
          onChange={(e) => setInterviewNo(e.target.value)}
          placeholder="e.g. 1, 2, 3"
        />

        <label>Score</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <label>Feedback</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <button onClick={submitMock}>Save</button>
      </div>
    </div>
  );
}

export default InstructorMockInterviews;
