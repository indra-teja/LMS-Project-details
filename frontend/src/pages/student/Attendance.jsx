import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import "../../styles/student/attendance.css";

function Attendance() {
  const studentId = localStorage.getItem("student_id");

  const [openCamera, setOpenCamera] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [summary, setSummary] = useState({ present: 0, absent: 0 });
  const [message, setMessage] = useState("");

  // Load attendance summary
  useEffect(() => {
    if (!studentId) return;

    axios
      .get("http://127.0.0.1:8000/attendance/attendance-summary/", {
        params: { student_id: studentId },
      })
      .then((res) => setSummary(res.data));
  }, [studentId]);

  // Open camera and scan
  useEffect(() => {
    if (!openCamera || scanResult) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        setScanResult(decodedText);

        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/attendance/mark-attendance/",
            {
              student_id: studentId,
              token: decodedText,
            }
          );

          setMessage(res.data.message);
        } catch (err) {
          setMessage(err.response?.data?.error || "Failed to mark attendance");
        }

        scanner.clear();
        setOpenCamera(false);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [openCamera, scanResult, studentId]);

  return (
    <div>
      <h1>Attendance</h1>

      <div className="attendance-card">
        <p>Present: {summary.present} days</p>
        <p>Absent: {summary.absent} days</p>
      </div>

      <div className="attendance-card">
        <h3>Scan Attendance QR</h3>

        {!openCamera && !scanResult && (
          <button
            className="open-camera-btn"
            onClick={() => setOpenCamera(true)}
          >
            Open Camera
          </button>
        )}

        {openCamera && (
          <div
            id="qr-reader"
            style={{ width: "300px", margin: "auto" }}
          ></div>
        )}

        {scanResult && (
          <div className="scan-success">
            <p>{message}</p>
            <small>QR Token: {scanResult}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
