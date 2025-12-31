import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/instructor/instructor-mock.css";

const API = "http://127.0.0.1:8000";

function InstructorWeeklyTests() {
  const instructorId = localStorage.getItem("user_id");

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [weekNo, setWeekNo] = useState("");
  const [score, setScore] = useState("");
  const [total, setTotal] = useState("");
  const [remarks, setRemarks] = useState("");   // ✅ NEW
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ---------------- Load Students ----------------
  useEffect(() => {
    axios
      .get(`${API}/enrollments/students/`)
      .then((res) => {
        setStudents(res.data);
        setError("");
      })
      .catch(() => setError("Failed to load students"));
  }, []);

  // ---------------- Submit Weekly Test ----------------
  const submitTest = () => {
    setMessage("");
    setError("");

    if (!instructorId) {
      setError("Session expired. Please login again.");
      return;
    }

    if (!studentId || !weekNo || !score || !total) {
      setError("All fields are required");
      return;
    }

    axios
      .post(`${API}/enrollments/add-weekly-test/`, {
        user_id: instructorId,
        student_id: studentId,
        week_no: Number(weekNo),
        score: Number(score),
        total_marks: Number(total),
        remarks: remarks,     // ✅ SEND
      })
      .then(() => {
        setMessage("Weekly test saved successfully");
        setStudentId("");
        setWeekNo("");
        setScore("");
        setTotal("");
        setRemarks("");       // ✅ CLEAR
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to save weekly test");
      });
  };

  return (
    <div className="mock-page">
      <h1>Weekly Tests</h1>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <div className="mock-card">
        <label>Student</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.email}
            </option>
          ))}
        </select>

        <label>Week Number</label>
        <input
          type="number"
          min="1"
          value={weekNo}
          onChange={(e) => setWeekNo(e.target.value)}
        />

        <label>Score</label>
        <input
          type="number"
          min="0"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />

        <label>Total Marks</label>
        <input
          type="number"
          min="1"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />

        {/* ✅ NEW REMARKS FIELD */}
        <label>Remarks</label>
        <textarea
          rows="3"
          placeholder="Example: Good consistency, revise arrays"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <button onClick={submitTest}>Save</button>
      </div>
    </div>
  );
}

export default InstructorWeeklyTests;
