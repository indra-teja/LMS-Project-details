import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/manage-instructors.css";
import "../../styles/admin/admin-common.css";

const API = "http://127.0.0.1:8000";

function ManageInstructors() {
  const [instructors, setInstructors] = useState([]);

  // add instructor
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // edit instructor
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  /* =========================
     LOAD INSTRUCTORS
     ========================= */
  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = () => {
    axios.get(`${API}/accounts/admin/instructors/`).then((res) => {
      setInstructors(res.data);
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
     CREATE INSTRUCTOR
     ========================= */
  const addInstructor = () => {
    if (!newName || !newEmail || !newPassword) {
      alert("All fields are required");
      return;
    }

    axios
      .post(`${API}/accounts/admin/instructors/create/`, {
        name: newName,
        email: newEmail,
        password: newPassword,
      })
      .then(() => {
        alert("Instructor created successfully");
        resetAddForm();
        loadInstructors();
      })
      .catch(() => alert("Failed to create instructor"));
  };

  const resetAddForm = () => {
    setShowAddForm(false);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
  };

  /* =========================
     EDIT INSTRUCTOR
     ========================= */
  const startEdit = (inst) => {
    setEditingInstructor(inst);
    setEditName(inst.name);
    setEditEmail(inst.email);
  };

  const updateInstructor = () => {
    axios
      .put(
        `${API}/accounts/admin/instructors/${editingInstructor.id}/`,
        {
          name: editName,
          email: editEmail,
        }
      )
      .then(() => {
        alert("Instructor updated");
        setEditingInstructor(null);
        loadInstructors();
      })
      .catch(() => alert("Update failed"));
  };

  /* =========================
     DELETE INSTRUCTOR
     ========================= */
  const deleteInstructor = (id) => {
    if (!window.confirm("Remove this instructor?")) return;

    axios
      .delete(`${API}/accounts/admin/instructors/${id}/delete/`)
      .then(() => {
        alert("Instructor removed");
        loadInstructors();
      })
      .catch(() => alert("Delete failed"));
  };

  return (
    <div className="admin-box">
      <h2>Manage Instructors</h2>

      {/* ADD BUTTON */}
      <button
        className="admin-btn"
        onClick={() => {
          setShowAddForm(true);
          setNewPassword(generatePassword());
        }}
      >
        Add Instructor
      </button>

      {/* ADD FORM */}
      {showAddForm && (
        <div className="admin-edit-box">
          <h3>Add Instructor</h3>

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

          <button className="admin-btn" onClick={addInstructor}>
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

      {/* EDIT FORM */}
      {editingInstructor && (
        <div className="admin-edit-box">
          <h3>Edit Instructor</h3>

          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <input
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />

          <button className="admin-btn" onClick={updateInstructor}>
            Update
          </button>

          <button
            className="admin-btn secondary"
            onClick={() => setEditingInstructor(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {instructors.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.email}</td>
              <td>
                <button
                  className="admin-btn secondary"
                  onClick={() => startEdit(i)}
                >
                  Edit
                </button>

                <button
                  className="admin-btn danger"
                  onClick={() => deleteInstructor(i.id)}
                  style={{ marginLeft: "6px" }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageInstructors;
