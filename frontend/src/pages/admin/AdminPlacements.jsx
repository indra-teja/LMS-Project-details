import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/placements.css";

const API = "http://127.0.0.1:8000";

function AdminPlacements() {
  const userId = localStorage.getItem("user_id");

  const [placements, setPlacements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    role: "",
    eligibility: "",
    apply_link: "",
    deadline: "",
    course_id: "",
  });

  /* -------- LOAD COURSES -------- */
  const loadCourses = () => {
    axios.get(`${API}/courses/admin/`)
      .then((res) => setCourses(res.data));
  };

  /* -------- LOAD PLACEMENTS (FIXED) -------- */
  const loadPlacements = () => {
    axios.get(`${API}/placements/manage/`, {
      params: { user_id: userId }   // ✅ REQUIRED
    })
    .then((res) => setPlacements(res.data))
    .catch((err) => {
      console.error("LOAD PLACEMENTS FAILED", err.response?.data);
    });
  };

  useEffect(() => {
    loadCourses();
    loadPlacements();
  }, []);

  /* -------- CREATE (FIXED) -------- */
  const createPlacement = () => {
    if (!form.course_id) {
      setMessage("Select a course");
      setType("error");
      return;
    }

    axios
      .post(`${API}/placements/create/`, {
        company_name: form.company_name,
        role: form.role,
        eligibility: form.eligibility,
        apply_link: form.apply_link,
        deadline: form.deadline,
        course_id: Number(form.course_id),   // ✅ MUST be Number
        created_by: userId,
      })
      .then((res) => {
        console.log("CREATED:", res.data);
        setMessage("Placement uploaded successfully");
        setType("success");
        setForm({
          company_name: "",
          role: "",
          eligibility: "",
          apply_link: "",
          deadline: "",
          course_id: "",
        });
        loadPlacements();
      })
      .catch((err) => {
        console.error("CREATE FAILED", err.response?.data);
        setMessage(err.response?.data?.error || "Failed to upload placement");
        setType("error");
      });
  };

  /* -------- TOGGLE -------- */
  const toggleStatus = (id) => {
    axios.post(`${API}/placements/toggle/`, {
      placement_id: id
    }).then(() => loadPlacements());
  };

  /* -------- DELETE (FIXED) -------- */
  const deletePlacement = (id) => {
    if (!window.confirm("Delete this placement?")) return;

    axios.delete(`${API}/placements/delete/`, {
      data: {
        placement_id: id,
        user_id: userId,   // ✅ REQUIRED
      },
    }).then(() => loadPlacements());
  };

  /* -------- AUTO HIDE MESSAGE -------- */
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  return (
    <div className="placements-page">
      <h2>Placements (Admin)</h2>

      {message && <div className={`popup ${type}`}>{message}</div>}

      <div className="placement-card">
        <h3>Add Placement</h3>

        <select
          value={form.course_id}
          onChange={(e) =>
            setForm({ ...form, course_id: e.target.value })
          }
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <input placeholder="Company"
          value={form.company_name}
          onChange={(e) =>
            setForm({ ...form, company_name: e.target.value })
          } />

        <input placeholder="Role"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          } />

        <input placeholder="Eligibility"
          value={form.eligibility}
          onChange={(e) =>
            setForm({ ...form, eligibility: e.target.value })
          } />

        <input placeholder="Apply Link"
          value={form.apply_link}
          onChange={(e) =>
            setForm({ ...form, apply_link: e.target.value })
          } />

        <input type="date"
          value={form.deadline}
          onChange={(e) =>
            setForm({ ...form, deadline: e.target.value })
          } />

        <button onClick={createPlacement}>Create</button>
      </div>

      <div className="placements-grid">
        {placements.length === 0 && <p>No placements found</p>}

        {placements.map((p) => (
          <div className="placement-card" key={p.id}>
            <h3>{p.company_name}</h3>
            <p>{p.role}</p>
            <p>Course: {p.course}</p>
            <p>Deadline: {p.deadline}</p>

            <span className={`status ${p.status === "ACTIVE" ? "active" : "closed"}`}>
              {p.status}
            </span>

            <button onClick={() => toggleStatus(p.id)}>
              {p.is_active ? "Deactivate" : "Activate"}
            </button>

            <button
              style={{ background: "#ef4444", color: "#fff" }}
              onClick={() => deletePlacement(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPlacements;
