import "../../styles/instructor/instructor-dashboard.css";
import { useNavigate } from "react-router-dom";

function InstructorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="i-box">
      <h1>Welcome Instructor 👋</h1>
      <p className="subtitle">
        Manage courses, attendance, quizzes, and student performance.
      </p>

      <div className="dashboard-cards">
        <div className="dash-card">
          <h3>Courses</h3>
          <p>Create new courses</p>
          <button
            className="dash-btn"
            onClick={() => navigate("/instructor/add-course")}
          >
            Add Course
          </button>
        </div>

        <div className="dash-card">
          <h3>Manage Courses</h3>
          <p>Edit or add content</p>
          <button
            className="dash-btn"
            onClick={() => navigate("/instructor/manage-courses")}
          >
            Manage
          </button>
        </div>

        <div className="dash-card">
          <h3>Attendance</h3>
          <p>Track attendance</p>
          <button
            className="dash-btn"
            onClick={() => navigate("/instructor/attendance")}
          >
            View
          </button>
        </div>

        <div className="dash-card">
          <h3>Quizzes</h3>
          <p>Create quizzes</p>
          <button
            className="dash-btn"
            onClick={() => navigate("/instructor/create-quiz")}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
