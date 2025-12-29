import { useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

function ChangePassword() {
  const userId = localStorage.getItem("user_id");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE}/accounts/change-password/`, {
        user_id: userId,
        old_password: oldPassword,
        new_password: newPassword,
      });

      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to change password");
    }
  };

  return (
    <div className="profile-card" style={{ marginTop: "30px" }}>
      <h3>Change Password</h3>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* OLD PASSWORD */}
        <div className="form-group password-group">
          <label>Old Password</label>
          <div className="password-input">
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowOld(!showOld)}
            >
              {showOld ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* NEW PASSWORD */}
        <div className="form-group password-group">
          <label>New Password</label>
          <div className="password-input">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        <button type="submit" className="save-btn">
          Update Password
        </button>

        {message && <p className="success-text">{message}</p>}
      </form>
    </div>
  );
}

export default ChangePassword;
