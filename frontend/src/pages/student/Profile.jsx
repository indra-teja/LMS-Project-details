import "../../styles/student/profile.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ChangePassword from "./ChangePassword";

const API_BASE = "http://127.0.0.1:8000";

function Profile() {
  const studentId = localStorage.getItem("student_id");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // Load profile
  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`${API_BASE}/accounts/student/profile/`, {
        params: { student_id: studentId },
      })
      .then((res) => {
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });

        if (res.data.profile_photo) {
          setPreview(`${API_BASE}${res.data.profile_photo}`);
        } else {
          setPreview(null);
        }
      })
      .catch(() => {
        setMessage("Failed to load profile");
      });
  }, [studentId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("student_id", studentId);
    data.append("name", form.name);
    data.append("phone", form.phone);

    if (photo) {
      data.append("profile_photo", photo);
    }

    try {
      const res = await axios.post(
        `${API_BASE}/accounts/student/profile/update/`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.profile_photo) {
        setPreview(`${API_BASE}${res.data.profile_photo}`);
      }

      setMessage("Profile updated successfully");
    } catch {
      setMessage("Failed to update profile");
    }
  };

  return (
    <div className="student-profile">
      <h1>Profile</h1>
      <p className="profile-subtitle">
        Manage your personal information and security
      </p>

      <div className="profile-card">
        <div className="profile-photo-section">
          <img
            src={preview || "https://via.placeholder.com/120"}
            alt="Profile"
            className="profile-photo"
          />

          <label className="photo-upload-btn">
            Change Photo
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} disabled />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>

          {message && <p className="success-text">{message}</p>}
        </form>
      </div>

      {/* Change Password Section */}
      <ChangePassword />
    </div>
  );
}

export default Profile;
