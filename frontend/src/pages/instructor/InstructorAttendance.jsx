import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/instructor/instructor-attendance.css";

function InstructorAttendance() {
  const [token, setToken] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const startAttendance = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/courses/start-attendance/",
        { course_id: 1 }
      );

      setToken(res.data.token);
      setTimeLeft(300);
    } catch (err) {
      console.error("Failed to start attendance", err);
    }
  };

  const stopAttendance = () => {
    setToken(null);
    setTimeLeft(0);
  };

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopAttendance();
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

          <button className="stop-btn" onClick={stopAttendance}>
            Stop Attendance
          </button>
        </div>
      )}
    </div>
  );
}

export default InstructorAttendance;
