import "../../styles/student/dashboard.css";

function Dashboard() {
  return (
    <div className="student-dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">
        Track your learning progress and activities
      </p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Course Progress</h3>
          <p>View your completed lessons</p>
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Quizzes</h3>
          <p>Check scheduled quizzes</p>
        </div>

        <div className="dashboard-card">
          <h3>Attendance Overview</h3>
          <p>Track your attendance</p>
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <p>Your latest actions</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
