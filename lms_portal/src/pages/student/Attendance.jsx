import "../../styles/student/attendance.css";

function Attendance() {
  return (
    <div>
      <h1>Attendance</h1>

      <div className="attendance-card card">
        <p>Present: 22 days</p>
        <p>Absent: 3 days</p>
      </div>
    </div>
  );
}

export default Attendance;
