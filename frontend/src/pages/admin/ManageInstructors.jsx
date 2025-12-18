import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/manage-instructors.css";
import "../../styles/admin/admin-common.css";

function ManageInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add instructor state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Edit instructor state
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Fetch instructors
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/accounts/admin/instructors/")
      .then((res) => {
        setInstructors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch instructors", err);
        setLoading(false);
      });
  }, []);

  // Add instructor
  const addInstructor = () => {
    if (!newName || !newEmail || !newPassword) {
      alert("All fields are required");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/accounts/admin/instructors/create/", {
        name: newName,
        email: newEmail,
        password: newPassword,
      })
      .then((res) => {
        setInstructors([
          ...instructors,
          {
            id: res.data.id,
            name: newName,
            email: newEmail,
          },
        ]);

        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setShowAddForm(false);
      })
      .catch((err) => {
        console.error("Failed to add instructor", err);
        alert("Error creating instructor");
      });
  };

  // Start edit
  const startEdit = (instructor) => {
    setEditingInstructor(instructor);
    setEditName(instructor.name);
    setEditEmail(instructor.email);
  };

  // Update instructor
  const updateInstructor = () => {
    axios
      .put(
        `http://127.0.0.1:8000/accounts/admin/instructors/${editingInstructor.id}/`,
        {
          name: editName,
          email: editEmail,
        }
      )
      .then(() => {
        setInstructors(
          instructors.map((i) =>
            i.id === editingInstructor.id
              ? { ...i, name: editName, email: editEmail }
              : i
          )
        );
        setEditingInstructor(null);
      })
      .catch((err) => {
        console.error("Failed to update instructor", err);
      });
  };

  // Delete instructor
  const deleteInstructor = (id) => {
    if (!window.confirm("Are you sure you want to remove this instructor?")) {
      return;
    }

    axios
      .delete(
        `http://127.0.0.1:8000/accounts/admin/instructors/${id}/delete/`
      )
      .then(() => {
        setInstructors(instructors.filter((i) => i.id !== id));
      })
      .catch((err) => {
        console.error("Failed to delete instructor", err);
      });
  };

  return (
    <div className="admin-box">
      <h2>Manage Instructors</h2>

      <div className="admin-actions">
        <button
          className="admin-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add Instructor
        </button>
      </div>

      {/* Add Instructor Form */}
      {showAddForm && (
        <div className="admin-edit-box">
          <h3>Add Instructor</h3>

          <input
            type="text"
            placeholder="Instructor Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Instructor Email"
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
            <button className="admin-btn" onClick={addInstructor}>
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

      {/* Edit Instructor Form */}
      {editingInstructor && (
        <div className="admin-edit-box">
          <h3>Edit Instructor</h3>

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
        </div>
      )}

      {/* Instructors Table */}
      {loading ? (
        <p>Loading instructors...</p>
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
            {instructors.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No instructors found
                </td>
              </tr>
            ) : (
              instructors.map((inst) => (
                <tr key={inst.id}>
                  <td>{inst.name}</td>
                  <td>{inst.email}</td>
                  <td>
                    <button
                      className="admin-btn secondary"
                      onClick={() => startEdit(inst)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="admin-btn danger"
                      onClick={() => deleteInstructor(inst.id)}
                    >
                      Remove
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

export default ManageInstructors;
