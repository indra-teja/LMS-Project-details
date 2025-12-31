import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/manage-courses.css";
import "../../styles/admin/admin-common.css";

function ManageCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState({});
  const [students, setStudents] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/courses/admin/")
      .then(res => setCourses(res.data));

    axios.get("http://127.0.0.1:8000/accounts/admin/instructors/")
      .then(res => {
        const map = {};
        res.data.forEach(i => map[i.id] = i.name);
        setInstructors(map);
      });
  }, []);

  const viewStudents = (courseId) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/enrollments/course/${courseId}/students/`)
      .then(res => {
        setStudents(res.data);
        setExpandedCourse(courseId);
      })
      .catch(() => alert("Failed to load students"));
  };

  const deleteCourse = (id) => {
    if (!window.confirm("Delete this course?")) return;

    axios
      .delete(`http://127.0.0.1:8000/courses/admin/${id}/delete/`)
      .then(() => setCourses(courses.filter(c => c.id !== id)));
  };

  return (
    <div className="admin-box">
      <h2>Manage Courses</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Instructor</th>
            <th>Students</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map(course => (
            <>
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{instructors[course.instructor_id]}</td>

                <td>
                  <button
                    className="admin-btn secondary"
                    onClick={() => viewStudents(course.id)}
                  >
                    View Students
                  </button>
                </td>

                <td>
                  <button
                    className="admin-btn"
                    onClick={() =>
                      navigate(`/admin/manage-course-content/${course.id}`)
                    }
                  >
                    Content
                  </button>

                  <button
                    className="admin-btn danger"
                    onClick={() => deleteCourse(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>

              {expandedCourse === course.id && (
                <tr>
                  <td colSpan="4">
                    {students.length === 0 ? (
                      <p style={{ padding: "10px" }}>
                        No students enrolled
                      </p>
                    ) : (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((s, i) => (
                            <tr key={s.id}>
                              <td>{i + 1}</td>
                              <td>{s.name}</td>
                              <td>{s.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCourses;
