import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/instructor/instructor-attendance.css";

function InstructorAttendance() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const instructorId = localStorage.getItem("instructor_id");

  const [token, setToken] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");

  // 🔴 Guard: attendance must always have courseId
  useEffect(() => {
    if (!courseId) {
      navigate("/instructor/manage-courses");
    }
  }, [courseId, navigate]);

  const startAttendance = async () => {
    if (!instructorId) {
      setError("Instructor not logged in. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/attendance/start-attendance/",
        {
          course_id: Number(courseId),
          instructor_id: Number(instructorId),
        }
      );

      setToken(res.data.token);
      setTimeLeft(300);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to start attendance");
    }
  };

  // ⏱️ Timer
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setToken(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="instructor-attendance-page">
      <h1>Attendance</h1>

      {error && <p className="error-text">{error}</p>}

      {!token && (
        <button className="start-btn" onClick={startAttendance}>
          Start Attendance
        </button>
      )}

      {token && (
        <div className="qr-card">
          <h3>Scan this QR</h3>

          <QRCodeCanvas value={token} size={220} />

          <p className="timer">
            Expires in: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>
      )}
    </div>
  );
}

export default InstructorAttendance;
