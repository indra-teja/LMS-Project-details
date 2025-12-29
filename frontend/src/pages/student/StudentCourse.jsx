import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/student/course-detail.css";

function StudentCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentId = localStorage.getItem("student_id");

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [opened, setOpened] = useState({});

  useEffect(() => {
    if (!studentId) {
      setError("Session expired. Please login again.");
      return;
    }
    loadCourse();
  }, [id, studentId]);

  const loadCourse = () => {
    axios
      .get(`http://127.0.0.1:8000/enrollments/student-course/${id}/`, {
        params: { student_id: studentId },
      })
      .then((res) => {
        setCourse(res.data);
        setError("");
      })
      .catch(() => {
        setError("Course not assigned");
      });
  };

  const handleOpen = (content) => {
    setOpened((prev) => ({ ...prev, [content.id]: true }));

    const url =
      content.content_type === "PDF"
        ? `http://127.0.0.1:8000${content.file}`
        : content.video_url;

    if (url) {
      window.open(url, "_blank");
    }
  };

  const markCompleted = (contentId) => {
    axios.post(
      "http://127.0.0.1:8000/enrollments/mark-content-complete/",
      {
        student_id: studentId,
        content_id: contentId,
      }
    );
  };

  if (error)
    return (
      <div className="error-text">
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );

  if (!course) return <p>Loading course...</p>;

  return (
    <div className="student-course-detail">
      {/* COURSE TITLE */}
      <h1 className="course-title">{course.title}</h1>

      {/* COURSE DESCRIPTION */}
      <div className="course-description">
        <h3>About this course</h3>
        <p>{course.description || "No description available."}</p>
      </div>

      {/* COURSE CONTENT */}
      <div className="course-content">
        <h3>Course Content</h3>

        {course.contents.length === 0 ? (
          <p>No content uploaded yet</p>
        ) : (
          course.contents.map((c) => (
            <div key={c.id} className="content-card">
              <h4>{c.title}</h4>

              {/* OPEN BUTTON — ALWAYS VISIBLE */}
              <button
                className="open-btn"
                onClick={() => handleOpen(c)}
              >
                Open Course Content
              </button>

              {/* MARK COMPLETED */}
              {!c.completed ? (
                <button
                  className="complete-btn"
                  disabled={!opened[c.id]}
                  onClick={() => markCompleted(c.id)}
                >
                  ✔ Mark as Completed
                </button>
              ) : (
                <span className="completed">✔ Completed</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentCourse;
