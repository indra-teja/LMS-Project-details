import "../../styles/instructor/instructor-dashboard.css";

function InstructorDashboard() {
  return (
    <div className="i-box">
      <h1>Welcome Instructor 👋</h1>
      <p className="subtitle">
        Manage courses, attendance, quizzes, and student performance.
      </p>

      <div className="dashboard-cards">
        <div className="dash-card">
          <h3>Courses</h3>
          <p>Create and manage courses</p>
          <button className="dash-btn">Manage</button>
        </div>

        <div className="dash-card">
          <h3>Attendance</h3>
          <p>Track student attendance</p>
          <button className="dash-btn">View</button>
        </div>

        <div className="dash-card">
          <h3>Quizzes</h3>
          <p>Create and evaluate quizzes</p>
          <button className="dash-btn">Create</button>
        </div>

        <div className="dash-card">
          <h3>Performance</h3>
          <p>Analyze student progress</p>
          <button className="dash-btn">Check</button>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
