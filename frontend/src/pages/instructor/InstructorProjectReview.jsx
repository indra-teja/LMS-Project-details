import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/instructor/instructor-mock.css";

function InstructorProjectReview() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [title, setTitle] = useState("");
  const [tech, setTech] = useState("");
  const [status, setStatus] = useState("IN_PROGRESS");
  const [score, setScore] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/enrollments/students/")
      .then((res) => setStudents(res.data))
      .catch(() => setError("Failed to load students"));
  }, []);

  const submitProject = () => {
    if (!studentId || !title || !tech) {
      setError("Student, title and technologies are required");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/enrollments/add-project/", {
        student_id: studentId,
        title,
        technologies: tech,
        status,
        score,
        remarks,
      })
      .then(() => {
        setMessage("Project review saved");
        setError("");
        setTitle("");
        setTech("");
        setScore("");
        setRemarks("");
      })
      .catch(() => {
        setError("Failed to save project");
        setMessage("");
      });
  };

  return (
    <div className="mock-page">
      <h1>Project Review</h1>

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

        <label>Project Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Technologies</label>
        <input value={tech} onChange={(e) => setTech(e.target.value)} />

        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <label>Score</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <label>Remarks</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <button onClick={submitProject}>Save</button>
      </div>
    </div>
  );
}

export default InstructorProjectReview;
