import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "../../styles/student/attendance.css";

function Attendance() {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (scanResult) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        scanner.clear();

        // Later you will send this to backend
        console.log("QR Code Scanned:", decodedText);
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scanResult]);

  return (
    <div>
      <h1>Attendance</h1>

      <div className="attendance-card">
        <p>Present: 22 days</p>
        <p>Absent: 3 days</p>
      </div>

      {/* QR Scanner Section */}
      <div className="attendance-card">
        <h3>Scan Attendance QR</h3>

        {!scanResult && (
          <div id="qr-reader" className="qr-reader"></div>
        )}

        {scanResult && (
          <div className="scan-success">
            <p>Attendance marked successfully</p>
            <small>QR Data: {scanResult}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
