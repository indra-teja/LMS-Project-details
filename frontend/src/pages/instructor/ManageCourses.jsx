import "../../styles/instructor/manage-courses.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchCourses = () => {
    axios
      .get("http://127.0.0.1:8000/courses/instructor/courses/")
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    axios
      .delete(
        `http://127.0.0.1:8000/courses/instructor/courses/${courseId}/delete/`
      )
      .then(() => {
        alert("Course deleted");
        fetchCourses();
      })
      .catch(() => {
        alert("Failed to delete course");
      });
  };

  return (
    <div className="i-box">
      <h2>Manage Courses</h2>

      <table className="course-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="3" align="center">
                No courses found
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.is_active ? "Active" : "Inactive"}</td>
                <td className="action-btns">
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(
                        `/instructor/manage-course-content/${course.id}`
                      )
                    }
                  >
                    View
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate(`/instructor/edit-course/${course.id}`)
                    }
                  >
                    Edit
                  </button>

                  {/* ✅ NEW: TAKE ATTENDANCE */}
                  <button
                    className="attendance-btn"
                    onClick={() =>
                      navigate(`/instructor/attendance/${course.id}`)
                    }
                  >
                    Take Attendance
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteCourse(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCourses;
