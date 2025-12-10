import "../../styles/student/dashboard.css";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="card">Course Progress</div>
        <div className="card">Upcoming Quizzes</div>
        <div className="card">Attendance Overview</div>
        <div className="card">Recent Activity</div>
      </div>
    </div>
  );
}

export default Dashboard;
