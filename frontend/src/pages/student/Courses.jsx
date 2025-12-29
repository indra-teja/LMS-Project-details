import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/student/courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    if (!studentId) {
      setError("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8000/enrollments/student-courses/", {
        params: { student_id: studentId },
      })
      .then((res) => {
        setCourses(res.data);
      })
      .catch(() => {
        setError("Failed to load courses");
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return <p>Loading courses...</p>;

  if (error)
    return (
      <div className="error-text">
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );

  return (
    <div className="student-courses">
      <h1>My Courses</h1>

      <div className="courses-grid">
        {courses.length === 0 ? (
          <p>No courses assigned</p>
        ) : (
          courses.map((c) => (
            <div key={c.id} className="course-card">
              <h3>{c.title}</h3>

              <p>Progress: {c.progress}%</p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${c.progress}%` }}
                />
              </div>

              <button
                className="continue-btn"
                onClick={() => navigate(`/student/course/${c.id}`)}
              >
                Continue
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Courses;
