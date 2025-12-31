import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/student/placements.css";

const API = "http://127.0.0.1:8000";

function StudentPlacements() {
  const studentId = localStorage.getItem("user_id");

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD STUDENT PLACEMENTS ---------------- */
  const loadPlacements = () => {
    if (!studentId) return;

    setLoading(true);

    axios
      .get(`${API}/placements/student/`, {
        params: { student_id: Number(studentId) }, // ✅ FIXED
      })
      .then((res) => {
        setPlacements(res.data);
      })
      .catch((err) => {
        console.error("Failed to load placements", err);
        setPlacements([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlacements();
  }, [studentId]);

  /* ---------------- APPLY ---------------- */
  const apply = (placementId, link) => {
    axios.post(`${API}/placements/apply/`, {
      student_id: Number(studentId),
      placement_id: placementId,
    });

    window.open(link, "_blank");
  };

  return (
    <div className="placements-page">
      <h2>Placements</h2>

      {loading && <p>Loading placements...</p>}

      {!loading && placements.length === 0 && (
        <p style={{ opacity: 0.7 }}>
          No placements available for your enrolled courses
        </p>
      )}

      <div className="placements-grid">
        {placements.map((p) => (
          <div className="placement-card" key={p.id}>
            <h3>{p.company_name}</h3>

            <p className="role">{p.role}</p>

            {/* Optional but very useful */}
            {p.course && (
              <p className="course">
                Course: <strong>{p.course}</strong>
              </p>
            )}

            <p className="eligibility">{p.eligibility}</p>

            <p className="deadline">
              Last Date: {p.deadline}
            </p>

            <span
              className={`status ${
                p.status === "ACTIVE" ? "active" : "closed"
              }`}
            >
              {p.status}
            </span>

            <button
              disabled={p.status !== "ACTIVE" || p.applied}
              onClick={() => apply(p.id, p.apply_link)}
            >
              {p.applied
                ? "Applied"
                : p.status === "ACTIVE"
                ? "Apply Now"
                : "Closed"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentPlacements;
