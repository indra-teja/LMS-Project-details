import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin/manage-courses.css";
import "../../styles/admin/admin-common.css";

function ManageCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  // add course
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [instructorId, setInstructorId] = useState("");

  // edit course
  const [editingCourse, setEditingCourse] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editInstructorId, setEditInstructorId] = useState("");

  // fetch courses & instructors
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/courses/admin/")
      .then((res) => setCourses(res.data));

    axios
      .get("http://127.0.0.1:8000/accounts/admin/instructors/")
      .then((res) => setInstructors(res.data));
  }, []);

  // add course
  const addCourse = () => {
    if (!title || !instructorId) {
      alert("All fields required");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/courses/admin/create/", {
        title,
        instructor_id: instructorId,
      })
      .then((res) => {
        setCourses([
          ...courses,
          {
            id: res.data.id,
            title,
            instructor_name: res.data.instructor_name,
            instructor_id: instructorId,
          },
        ]);
        setTitle("");
        setInstructorId("");
        setShowAdd(false);
      })
      .catch(() => alert("Error creating course"));
  };

  // start edit
  const startEdit = (course) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditInstructorId(course.instructor_id);
  };

  // update course
  const updateCourse = () => {
    axios
      .put(
        `http://127.0.0.1:8000/courses/admin/${editingCourse.id}/`,
        {
          title: editTitle,
          instructor_id: editInstructorId,
        }
      )
      .then(() => {
        setCourses(
          courses.map((c) =>
            c.id === editingCourse.id
              ? {
                  ...c,
                  title: editTitle,
                  instructor_id: editInstructorId,
                  instructor_name:
                    instructors.find(
                      (i) => i.id === Number(editInstructorId)
                    )?.name || c.instructor_name,
                }
              : c
          )
        );
        setEditingCourse(null);
      })
      .catch(() => alert("Update failed"));
  };

  // delete course
  const deleteCourse = (id) => {
    if (!window.confirm("Delete this course?")) return;

    axios
      .delete(`http://127.0.0.1:8000/courses/admin/${id}/delete/`)
      .then(() => {
        setCourses(courses.filter((c) => c.id !== id));
      })
      .catch(() => alert("Delete failed"));
  };

  return (
    <div className="admin-box">
      <h2>Manage Courses</h2>

      <div className="admin-actions">
        <button className="admin-btn" onClick={() => setShowAdd(true)}>
          Add Course
        </button>
      </div>

      {/* ADD COURSE */}
      {showAdd && (
        <div className="admin-edit-box">
          <h3>Add Course</h3>

          <input
            type="text"
            placeholder="Course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
          >
            <option value="">Select Instructor</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          <div className="admin-actions">
            <button className="admin-btn" onClick={addCourse}>
              Create
            </button>
            <button
              className="admin-btn secondary"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EDIT COURSE */}
      {editingCourse && (
        <div className="admin-edit-box">
          <h3>Edit Course</h3>

          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <select
            value={editInstructorId}
            onChange={(e) => setEditInstructorId(e.target.value)}
          >
            <option value="">Select Instructor</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>

          <div className="admin-actions">
            <button className="admin-btn" onClick={updateCourse}>
              Update
            </button>
            <button
              className="admin-btn secondary"
              onClick={() => setEditingCourse(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* COURSE TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Instructor</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No courses found
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.instructor_name}</td>
                <td>
                  <button
                    className="admin-btn secondary"
                    onClick={() => startEdit(course)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className="admin-btn"
                    onClick={() =>
                      navigate(`/admin/courses/${course.id}/content`)
                    }
                  >
                    Content
                  </button>{" "}
                  <button
                    className="admin-btn danger"
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
