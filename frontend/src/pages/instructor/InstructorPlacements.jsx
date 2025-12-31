import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/instructor/placements.css";

const API = "http://127.0.0.1:8000";

function InstructorPlacements() {
  const instructorId = localStorage.getItem("user_id");
  const [placements, setPlacements] = useState([]);
  const [message, setMessage] = useState("");

  const loadPlacements = () => {
    axios
      .get(`${API}/placements/instructor/`, {
        params: { instructor_id: instructorId },
      })
      .then((res) => setPlacements(res.data));
  };

  useEffect(() => {
    loadPlacements();
  }, []);

  const toggleStatus = (id) => {
    axios
      .post(`${API}/placements/toggle/`, {
        placement_id: id,
      })
      .then(() => {
        setMessage("Status updated");
        loadPlacements();
      });
  };

  return (
    <div className="placements-page">
      <h2>Placements (Instructor)</h2>

      {message && <div className="popup success">{message}</div>}

      <div className="placements-grid">
        {placements.length === 0 && (
          <p>No placements for your courses</p>
        )}

        {placements.map((p) => (
          <div className="placement-card" key={p.id}>
            <h3>{p.company_name}</h3>
            <p className="role">{p.role}</p>
            <p>Course: {p.course}</p>
            <p className="deadline">Deadline: {p.deadline}</p>

            <span className={`status ${p.status === "ACTIVE" ? "active" : "closed"}`}>
              {p.status}
            </span>

            <button onClick={() => toggleStatus(p.id)}>
              {p.is_active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorPlacements;
