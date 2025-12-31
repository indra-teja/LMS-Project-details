import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/instructor/instructor-profile.css";

const API_BASE = "http://127.0.0.1:8000";

function InstructorProfile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  // change password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Load profile
  useEffect(() => {
    axios
      .get(`${API_BASE}/accounts/instructor/profile/`)
      .then((res) => {
        setProfile(res.data);
        setName(res.data.name);
      })
      .catch((err) => {
        console.error("Profile load failed", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Update profile
  const updateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    if (photo) {
      formData.append("profile_photo", photo);
    }

    axios
      .put(`${API_BASE}/accounts/instructor/profile/`, formData)
      .then(() => {
        setEditMode(false);
        setPhoto(null);
        return axios.get(`${API_BASE}/accounts/instructor/profile/`);
      })
      .then((res) => {
        setProfile(res.data);
        setName(res.data.name);
      })
      .catch((err) => {
        console.error("Profile update failed", err);
      });
  };

  // Change password
  const changePassword = () => {
    setPasswordMsg("");
    setPasswordError("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    axios
      .post(`${API_BASE}/accounts/change-password/`, {
        user_id: profile.id,
        old_password: oldPassword,
        new_password: newPassword,
      })
      .then((res) => {
        setPasswordMsg(res.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        setPasswordError(
          err.response?.data?.error || "Password change failed"
        );
      });
  };

  if (loading) {
    return (
      <div className="i-box">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="i-box">
        <p>Profile not available</p>
      </div>
    );
  }

  return (
    <div className="i-box">
      <h2>Instructor Profile</h2>

      <div className="profile-card">
        <div className="profile-section">
          <img
            src={
              photo
                ? URL.createObjectURL(photo)
                : profile.profile_photo
                ? `${API_BASE}${profile.profile_photo}`
                : "https://via.placeholder.com/150"
            }
            alt="Instructor"
            className="profile-img"
          />

          <div className="profile-details">
            {!editMode ? (
              <>
                <h3>{profile.name}</h3>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Role:</strong> {profile.role}
                </p>

                <button
                  className="update-btn"
                  onClick={() => setEditMode(true)}
                >
                  Update Profile
                </button>
              </>
            ) : (
              <>
                <label>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label>Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />

                <div className="btn-group">
                  <button className="update-btn" onClick={updateProfile}>
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setEditMode(false);
                      setPhoto(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="profile-card">
        <h3>Change Password</h3>

        <label>Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {passwordError && <p className="error-text">{passwordError}</p>}
        {passwordMsg && <p className="success-text">{passwordMsg}</p>}

        <button className="update-btn" onClick={changePassword}>
          Change Password
        </button>
      </div>
    </div>
  );
}

export default InstructorProfile;
