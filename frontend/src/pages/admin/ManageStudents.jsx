import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/manage-students.css";
import "../../styles/admin/admin-common.css";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  /* =========================
     FETCH DATA
     ========================= */
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/accounts/admin/students/")
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      });

    axios
      .get("http://127.0.0.1:8000/courses/admin/")
      .then((res) => setCourses(res.data));
  }, []);

  /* =========================
     PASSWORD GENERATOR
     ========================= */
  const generateRandomPassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$_";
    let password = "";

    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  /* =========================
     ADD STUDENT
     ========================= */
  const addStudent = () => {
    if (!newName || !newEmail || !newPassword) {
      alert("All fields required");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/accounts/admin/students/create/", {
        name: newName,
        email: newEmail,
        password: newPassword,
        courses: selectedCourses,
      })
      .then((res) => {
        setStudents([...students, res.data]);
        resetAddForm();
      })
      .catch(() => alert("Failed to create student"));
  };

  const resetAddForm = () => {
    setShowAddForm(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setSelectedCourses([]);
  };

  /* =========================
     EDIT STUDENT
     ========================= */
  const startEdit = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditEmail(student.email);
  };

  const updateStudent = () => {
    axios
      .put(
        `http://127.0.0.1:8000/accounts/admin/students/${editingStudent.id}/`,
        {
          name: editName,
          email: editEmail,
        }
      )
      .then(() => {
        setStudents(
          students.map((s) =>
            s.id === editingStudent.id
              ? { ...s, name: editName, email: editEmail }
              : s
          )
        );
        setEditingStudent(null);
      });
  };

  /* =========================
     DELETE STUDENT
     ========================= */
  const deleteStudent = (id) => {
    if (!window.confirm("Delete student?")) return;

    axios
      .delete(`http://127.0.0.1:8000/accounts/admin/students/${id}/delete/`)
      .then(() => setStudents(students.filter((s) => s.id !== id)));
  };

  return (
    <div className="admin-box">
      <h2>Manage Students</h2>

      {/* ADD STUDENT BUTTON */}
      <button
        type="button"
        className="admin-btn"
        onClick={() => {
          setShowAddForm(true);
          setNewPassword(generateRandomPassword());
        }}
      >
        Add Student
      </button>

      {/* ADD STUDENT FORM */}
      {showAddForm && (
        <div className="admin-edit-box">
          <h3>Add Student</h3>

          <input
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="button"
            className="admin-btn secondary"
            onClick={() => setNewPassword(generateRandomPassword())}
          >
            Regenerate Password
          </button>

          <select
            multiple
            value={selectedCourses}
            onChange={(e) =>
              setSelectedCourses(
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} - {c.instructor_name}
              </option>
            ))}
          </select>

          <button type="button" className="admin-btn" onClick={addStudent}>
            Create
          </button>

          <button
            type="button"
            className="admin-btn secondary"
            onClick={resetAddForm}
          >
            Cancel
          </button>
        </div>
      )}

      {/* STUDENT TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>
                  <button
                    type="button"
                    className="admin-btn secondary"
                    onClick={() => startEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-btn danger"
                    onClick={() => deleteStudent(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* EDIT STUDENT FORM */}
      {editingStudent && (
        <div className="admin-edit-box">
          <h3>Edit Student</h3>

          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <input
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />

          <button type="button" className="admin-btn" onClick={updateStudent}>
            Update
          </button>

          <button
            type="button"
            className="admin-btn secondary"
            onClick={() => setEditingStudent(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;
