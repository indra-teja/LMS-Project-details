import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/manage-students.css";
import "../../styles/admin/admin-common.css";

const API = "http://127.0.0.1:8000";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [restoreCandidate, setRestoreCandidate] = useState(null);

  /* =========================
     LOAD DATA
     ========================= */
  useEffect(() => {
    loadStudents();
    loadCourses();
  }, []);

  const loadStudents = () => {
    axios.get(`${API}/accounts/admin/students/`).then((res) => {
      setStudents(res.data);
    });
  };

  const loadCourses = () => {
    axios.get(`${API}/courses/admin/`).then((res) => {
      setCourses(res.data);
    });
  };

  /* =========================
     PASSWORD GENERATOR
     ========================= */
  const generatePassword = (length = 10) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$_";
    let pass = "";
    for (let i = 0; i < length; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    return pass;
  };

  /* =========================
     CREATE STUDENT
     ========================= */
  const addStudent = () => {
    if (!newName || !newEmail || !newPassword) {
      alert("All fields are required");
      return;
    }

    axios
      .post(`${API}/accounts/admin/students/create/`, {
        name: newName,
        email: newEmail,
        password: newPassword,
        courses: selectedCourses,
      })
      .then(() => {
        alert("Student created successfully");
        resetAddForm();
        loadStudents();
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          const msg = err.response.data.error;

          if (msg && msg.includes("deactivated")) {
            const existing = students.find(
              (s) => s.email === newEmail
            );
            if (existing) setRestoreCandidate(existing);
          }

          alert(msg || "Failed to create student");
        } else {
          alert("Server error");
        }
      });
  };

  const resetAddForm = () => {
    setShowAddForm(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setSelectedCourses([]);
  };

  /* =========================
     SOFT DELETE (DEACTIVATE)
     ========================= */
  const deleteStudent = (id) => {
    if (!window.confirm("Deactivate this student?")) return;

    axios
      .delete(`${API}/accounts/admin/students/${id}/delete/`)
      .then(() => {
        alert("Student deactivated");
        loadStudents();
      })
      .catch(() => alert("Failed to deactivate student"));
  };

  /* =========================
     RESTORE STUDENT
     ========================= */
  const restoreStudent = (id) => {
    axios
      .post(`${API}/accounts/admin/students/${id}/restore/`)
      .then(() => {
        alert("Student restored successfully");
        setRestoreCandidate(null);
        loadStudents();
      })
      .catch(() => alert("Failed to restore student"));
  };

  /* =========================
     FORCE DELETE (PERMANENT)
     ========================= */
  const forceDeleteStudent = (id) => {
    if (
      !window.confirm(
        "⚠️ This will permanently delete the student and all related data.\nThis action CANNOT be undone.\n\nContinue?"
      )
    )
      return;

    axios
      .delete(`${API}/accounts/admin/students/${id}/force-delete/`)
      .then(() => {
        alert("Student permanently deleted");
        loadStudents();
      })
      .catch(() => alert("Failed to permanently delete student"));
  };

  return (
    <div className="admin-box">
      <h2>Manage Students</h2>

      {/* ADD STUDENT BUTTON */}
      <button
        className="admin-btn"
        onClick={() => {
          setShowAddForm(true);
          setNewPassword(generatePassword());
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
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            className="admin-btn secondary"
            onClick={() => setNewPassword(generatePassword())}
          >
            Regenerate Password
          </button>

          <select
            multiple
            value={selectedCourses}
            onChange={(e) =>
              setSelectedCourses(
                Array.from(
                  e.target.selectedOptions,
                  (o) => Number(o.value)
                )
              )
            }
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <button className="admin-btn" onClick={addStudent}>
            Create
          </button>

          <button
            className="admin-btn secondary"
            onClick={resetAddForm}
          >
            Cancel
          </button>
        </div>
      )}

      {/* RESTORE PROMPT */}
      {restoreCandidate && (
        <div className="admin-edit-box">
          <h3>Restore Student</h3>

          <p>
            Student <b>{restoreCandidate.email}</b> is deactivated.
            Do you want to restore this student?
          </p>

          <button
            className="admin-btn"
            onClick={() => restoreStudent(restoreCandidate.id)}
          >
            Restore Student
          </button>

          <button
            className="admin-btn secondary"
            onClick={() => setRestoreCandidate(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* STUDENT TABLE */}
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
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.is_active ? "Active" : "Deactivated"}</td>
              <td>
                {s.is_active ? (
                  <>
                    <button
                      className="admin-btn danger"
                      onClick={() => deleteStudent(s.id)}
                    >
                      Deactivate
                    </button>

                    <button
                      className="admin-btn danger"
                      onClick={() => forceDeleteStudent(s.id)}
                      style={{ marginLeft: "6px" }}
                    >
                      Force Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="admin-btn"
                      onClick={() => restoreStudent(s.id)}
                    >
                      Restore
                    </button>

                    <button
                      className="admin-btn danger"
                      onClick={() => forceDeleteStudent(s.id)}
                      style={{ marginLeft: "6px" }}
                    >
                      Force Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageStudents;
