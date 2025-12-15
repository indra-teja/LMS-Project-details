import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/instructor/instructor-attendance.css";

function InstructorAttendance() {
  const [token, setToken] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const startAttendance = () => {
    const generatedToken =
      "ATT_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);

    setToken(generatedToken);
    setTimeLeft(300); // 5 minutes
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

          <QRCode value={token} size={220} />

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
