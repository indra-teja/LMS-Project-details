import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/manage-students.css";
import "../../styles/admin/admin-common.css";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add student state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Edit student state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Fetch students
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/accounts/admin/students/")
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch students", err);
        setLoading(false);
      });
  }, []);

  // Add student
  const addStudent = () => {
    if (!newName || !newEmail || !newPassword) {
      alert("All fields are required");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/accounts/admin/students/create/", {
        name: newName,
        email: newEmail,
        password: newPassword,
      })
      .then((res) => {
        setStudents([
          ...students,
          {
            id: res.data.id,
            name: newName,
            email: newEmail,
            is_active: true,
          },
        ]);

        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setShowAddForm(false);
      })
      .catch((err) => {
        console.error("Failed to add student", err);
        alert("Error creating student");
      });
  };

  // Start editing
  const startEdit = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditEmail(student.email);
  };

  // Update student
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
      })
      .catch((err) => {
        console.error("Failed to update student", err);
      });
  };

  // Delete student
  const deleteStudent = (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/accounts/admin/students/${id}/delete/`)
      .then(() => {
        setStudents(students.filter((s) => s.id !== id));
      })
      .catch((err) => {
        console.error("Failed to delete student", err);
      });
  };

  return (
    <div className="admin-box">
      <h2>Manage Students</h2>

      <div className="admin-actions">
        <button
          className="admin-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add Student
        </button>
        <button className="admin-btn secondary">Import CSV</button>
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <div className="admin-edit-box">
          <h3>Add Student</h3>

          <input
            type="text"
            placeholder="Student Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Student Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <div className="admin-actions">
            <button className="admin-btn" onClick={addStudent}>
              Create
            </button>
            <button
              className="admin-btn secondary"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Student Form */}
      {editingStudent && (
        <div className="admin-edit-box">
          <h3>Edit Student</h3>

          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />

          <div className="admin-actions">
            <button className="admin-btn" onClick={updateStudent}>
              Update
            </button>
            <button
              className="admin-btn secondary"
              onClick={() => setEditingStudent(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      className="admin-btn secondary"
                      onClick={() => startEdit(student)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="admin-btn danger"
                      onClick={() => deleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageStudents;
